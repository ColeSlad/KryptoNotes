// utils/hashPassword.ts
export async function hashPassword(password: string): Promise<string> {
  // Dynamically import to avoid bundling on screens that don’t need it
  const argon2 = await import("argon2-browser");

  const hash = await argon2.hash({
    pass: password,
    salt: window.crypto.getRandomValues(new Uint8Array(16)), // unique salt per hash
    type: argon2.ArgonType.Argon2id,
    time: 3,        // iterations
    mem: 4096,      // memory in KB
    hashLen: 32,    // hash length
    parallelism: 1, // threads
  });

  return hash.encoded; // return encoded Argon2id string
}
