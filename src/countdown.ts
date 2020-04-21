import { parse, end, toSeconds, Duration, pattern } from 'iso8601-duration';

interface CountdownConfig {
  [duration: string]: string;
}

type Action = () => void;
type Canceller = Action;

export type CancellablePromise<T = void> = { cancel: Canceller, done: Promise<T> };

function getEndDate(config: Date | string | Duration): Date {
  if (config instanceof Date) return config;
  if (typeof config === 'string') {
    return pattern.test(config) ? end(parse(config)) : new Date(config);
  }
  return end(config);
}

interface Bucket {
  endAt: Date, // Time after which this bucket no longer applies
  pace: number, // Interval rate for this bucket
}

// Sorted buckets by end time, earliest first
function getBuckets(config: CountdownConfig, to: Date | string | Duration): Bucket[] {
  const endDate = getEndDate(to);
  const endTime = endDate.getTime();
  return Object.keys(config)
    .map(key => {
      return {
        endAt: new Date(endTime - toSeconds(parse(key)) * 1000),
        pace: toSeconds(parse(config[key])) * 1000,
      }
    })
    .sort((a, b) => a.endAt.getTime() - b.endAt.getTime());
}

function runInterval(fn: Action, pace: number): Canceller {
  fn();
  const i = setInterval(fn, pace);
  return () => clearInterval(i);
}

function runTimeout(fn: Action, date: Date): CancellablePromise {
  let resolve: Function, reject: Function;
  const done = new Promise<void>((good, bad) => { [resolve, reject] = [good, bad]; });

  let complete = false;

  const t = setTimeout(() => {
    if (complete) return;
    complete = true;
    fn();
    resolve();
  }, date.getTime() - Date.now());

  const cancel = () => {
    if (complete) return;
    complete = true;
    clearTimeout(t);
    reject(new Error("Cancelled"));
  }

  return { cancel, done };
}

function runCountdown(buckets: Bucket[], fn: Action): CancellablePromise {
  let stopInterval: Canceller, bucketPromise: CancellablePromise, cancelled = false;

  async function execute() {
    for (let bucket of buckets) {
      if (cancelled) return;
      if (Date.now() > bucket.endAt.getTime()) continue;

      stopInterval = runInterval(fn, bucket.pace);
      bucketPromise = runTimeout(stopInterval, bucket.endAt);

      await bucketPromise.done;
    }

    if (!cancelled) fn();
  }

  function cancel() {
    cancelled = true;
    bucketPromise.cancel();
    stopInterval();
  }

  return { cancel, done: execute() };
}

export function countdown(endTime: Date | string | Duration, config: CountdownConfig, fn: Action): CancellablePromise {
  const buckets = getBuckets(config, endTime);
  return runCountdown(buckets, fn);
}
