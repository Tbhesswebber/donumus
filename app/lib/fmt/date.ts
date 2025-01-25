const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
  style: "long",
});
type RelativeTimeUnit = Exclude<
  Parameters<typeof relativeTimeFormatter.format>[1],
  "quarter" | `${string}s`
>;

export function formatTimeRelative(value: Date) {
  const now = new Date();
  const unit = getBestUnit(now, value);
  const difference = getDifferenceInUnit(unit, now, value);

  return relativeTimeFormatter.format(difference, unit);
}

const unitMap: Record<RelativeTimeUnit, number> = {
  day: 86_400_000,
  hour: 3_600_000,
  minute: 60_000,
  month: 2_628_000_000,
  second: 1_000,
  week: 604_800_000,
  year: 31_536_000_000,
};

function getBestUnit(source: Date, target: Date): RelativeTimeUnit {
  const elapsed = target.getTime() - source.getTime();

  for (const [unit, ms] of Object.entries(unitMap)) {
    if (Math.abs(elapsed) > ms / 2) {
      return unit as RelativeTimeUnit; // casting because Object.entries types are wrong
    }
  }

  return "second";
}

function getDifferenceInUnit(
  unit: RelativeTimeUnit,
  source: Date,
  target: Date,
) {
  const elapsed = target.getTime() - source.getTime();
  const normalized = elapsed - (elapsed % unitMap[unit]);

  return normalized / unitMap[unit];
}
