export default function parseBuildNumber(title: string): string {
  const regex = /Build ([0-9]*)/;
  const exec = regex.exec(title);
  return exec?.[1] ?? '';
}
