export function parsePositiveInt(
  value: string | FormDataEntryValue | null | undefined,
): number | null {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}
