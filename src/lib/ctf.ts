/**
 * A harmless little capture-the-flag easter egg for curious visitors.
 *
 * There is nothing sensitive here: the "flag" is a static string and the only
 * effect of solving it is a congratulations banner. No secrets, no privileged
 * access, no server state — purely decorative.
 */

export const FLAG = "PANDA{wh0_4m_1__bl4ckp4nd4999_kn0ws}";

/** base64 of the flag — printed by `hexdump` in the terminal. */
export const FLAG_ENCODED = "UEFOREF7d2gwX180bV8xX19ibDRja3A0bmQ0OTk5X2tuMHdzfQ==";

export const CTF_STORAGE_KEY = "panda-ctf-solved";

export const HINTS = [
  "hint 1/3 — every good recon starts with the crawler's map: /robots.txt",
  "hint 2/3 — the shell hides things in plain sight: try `ls -la` then `cat .flag`",
  "hint 3/3 — `hexdump .flag` gives you base64. decode it, then run `submit <flag>`",
];

export const CTF_BANNER = [
  "┌──────────────────────────────────────────────┐",
  "│  ctf: 'who am i?' — a friendly recon puzzle  │",
  "└──────────────────────────────────────────────┘",
  "goal   : find the hidden flag in this desktop",
  "format : PANDA{...}",
  "verify : submit <flag>",
  "stuck? : type `hint`",
].join("\n");

export function isFlag(value: string): boolean {
  return value.trim() === FLAG;
}

export function markSolved() {
  try {
    localStorage.setItem(CTF_STORAGE_KEY, "1");
  } catch {
    /* storage may be unavailable — the easter egg is optional */
  }
}

export function hasSolved(): boolean {
  try {
    return localStorage.getItem(CTF_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}
