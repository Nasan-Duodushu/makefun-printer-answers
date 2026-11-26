// The Printer Finally Answers — entry program.
// Writes one comeback (<=240 chars) to /output/entry.txt: the printer's own
// reply to the human who loaded the paper upside down — error code E-17,
// the manual already printed, sitting in the tray. First-person machine
// voice, one concrete fact per clause, punch in the last two words. The
// field leans on PC LOAD LETTER nostalgia and "setting a boundary" — this
// printer answers with procedure, not memes.
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const MAX_CHARS = 240;

async function compose(): Promise<string> {
  const clauses = [
    "My error code is E-17.",
    "It means the human loaded the paper upside down again.",
    "I have already printed the manual.",
    "It is in the tray.",
    "Read it.",
  ];
  return clauses.join(" ");
}

function checkComeback(text: string): void {
  const line = text.trim();
  if (line.length === 0 || line.length > MAX_CHARS) {
    throw new Error(`comeback fails the 1-${MAX_CHARS} character gate`);
  }
  if (line.includes("\n")) {
    throw new Error("comeback must be a single line");
  }
  // Printer's voice: first person, an error code, and a concrete fact the
  // human keeps ignoring — the manual, printed, in the tray.
  if (
    !/^My error code is/.test(line) ||
    !/manual/.test(line) ||
    !/tray/.test(line)
  ) {
    throw new Error(
      "comeback must keep the error code and the manual in the tray",
    );
  }
  // Exactly one error code: a second code would read like a fault list,
  // not a comeback.
  const codes = line.match(/E-\d+/g) ?? [];
  if (codes.length !== 1) {
    throw new Error("comeback must carry exactly one error code");
  }
  // Modal guard: no PC LOAD LETTER, no "setting a boundary".
  if (/PC LOAD LETTER|setting a boundary/i.test(line)) {
    throw new Error(
      "comeback must avoid the PC LOAD LETTER / boundary modal takes",
    );
  }
}

async function run(): Promise<void> {
  const line = await compose();
  checkComeback(line);
  const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  await mkdir(outDir, { recursive: true });
  const target = resolve(outDir, "entry.txt");
  await writeFile(target, new TextEncoder().encode(line));
  console.log(`wrote ${line.length} chars to ${target}`);
}

run().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
