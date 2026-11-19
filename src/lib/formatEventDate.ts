export function formatEventDate(value: string | null | undefined): string {
  if (!value?.trim()) return 'Date unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return date.toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata',
  });
}
