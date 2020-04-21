import { parse, end, toSeconds, Duration } from 'iso8601-duration';

type CountdownTarget = { to: string | Date } | { for: string | Duration };

interface CountdownBuckets {
  [duration: string]: string;
}

export type CountdownConfig = CountdownBuckets & CountdownTarget;

type Action = () => void;
type Canceller = Action;

export type CancellablePromise<T = void> = { cancel: Canceller, done: Promise<T> };

function getEndDate(config: CountdownConfig): Date {
  if (config.to) {
    return typeof config.to === 'string'
      ? new Date(config.to)
      : config.to;
  } else {
    const duration: Duration = typeof config.for === 'string'
      ? parse(config.for)
      : config.for;
    return end(duration);
  }
}

interface Bucket {
  endAt: Date, // Time after which this bucket no longer applies
  pace: number, // Interval rate for this bucket
}

// Sorted buckets by end time, earliest first
function getBuckets(config: CountdownConfig, endDate: Date): Bucket[] {
  const endTime = endDate.getTime();
  return Object.keys(config)
    .filter(key => !['for', 'to'].includes(key))
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

export function countdown(config: CountdownConfig, fn: Action): CancellablePromise {
  const endDate = getEndDate(config);
  const buckets = getBuckets(config, endDate);
  return runCountdown(buckets, fn);
}

