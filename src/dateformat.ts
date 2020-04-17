export const long = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  weekday: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
}).format;

export const med = new Intl.DateTimeFormat("en-US", {
  year: undefined,
  month: "short",
  weekday: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

export const short = new Intl.DateTimeFormat("en-US", {
  year: undefined,
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

export const medTz = new Intl.DateTimeFormat("en-US", {
  year: undefined,
  month: "short",
  weekday: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  timeZoneName: "short",
});
