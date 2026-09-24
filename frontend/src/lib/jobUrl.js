const KNOWN_SOURCES = [
  ["linkedin.com", "LinkedIn"],
  ["greenhouse.io", "Greenhouse"],
  ["lever.co", "Lever"],
  ["indeed.com", "Indeed"],
  ["myworkdayjobs.com", "Workday"],
  ["stepstone.de", "StepStone"],
];

// Returns { status: "empty" | "invalid" } or { status: "valid", url, host, source }.
export function parseJobUrl(value) {
  const raw = value.trim();
  if (!raw) return { status: "empty" };

  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.replace(/^www\./, "");
    if (!/^https?:$/.test(parsed.protocol) || !host.includes(".")) {
      return { status: "invalid" };
    }
    const known = KNOWN_SOURCES.find(
      ([domain]) => host === domain || host.endsWith(`.${domain}`)
    );
    return { status: "valid", url: parsed.href, host, source: known ? known[1] : host };
  } catch {
    return { status: "invalid" };
  }
}
