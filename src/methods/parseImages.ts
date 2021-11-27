export function parseMDImage(body: string): string[] {
  const regex = /!\[[^\]]*\]\((?<filename>.*?)?\)/g;
  return [...body.matchAll(regex)].map(m => m.groups!.filename);
}
