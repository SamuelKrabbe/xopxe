export const YEAR_RANGES = [
  { value: "1950", label: "A partir de 1950", min: 1950, max: 9999 },
  { value: "1900", label: "1900 a 1949", min: 1900, max: 1949 },
  { value: "1800", label: "1800 a 1899", min: 1800, max: 1899 },
  { value: "0", label: "Antes de 1800", min: 0, max: 1799 },
];

export const RATING_RANGES = [
  { value: "4.5", label: "★★★★★", min: 4.5 },
  { value: "3.5", label: "★★★★", min: 3.5 },
  { value: "2.5", label: "★★★", min: 2.5 },
];

export function findYearRange(value) {
  return YEAR_RANGES.find((range) => range.value === value);
}

export function findRatingRange(value) {
  return RATING_RANGES.find((range) => range.value === value);
}
