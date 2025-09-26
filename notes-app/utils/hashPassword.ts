import * as Crypto from "expo-crypto";

export async function hashPassword(password: string, salt: string): Promise<string> {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + salt
  );
  return hash;
}
