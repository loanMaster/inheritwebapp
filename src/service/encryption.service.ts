import { v4 as uuidv4 } from "uuid";

export class EncryptionService {
  private async createKey(
    password: string,
    iv: Uint8Array,
    keyUsages: KeyUsage[]
  ): Promise<CryptoKey> {
    const pwUtf8 = new TextEncoder().encode(password);
    const pwHash = await crypto.subtle.digest("SHA-256", pwUtf8);

    const alg = { name: "AES-GCM", iv: iv };

    return crypto.subtle.importKey("raw", pwHash, alg, false, keyUsages);
  }

  async encrypt(
    blob: Blob,
    password: string
  ): Promise<{ blob: Blob; iv: string }> {
    const ivStr = uuidv4();
    const iv = new TextEncoder().encode(ivStr);

    const key = await this.createKey(password, iv, ["encrypt"]);

    const ctBuffer = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      await blob.arrayBuffer()
    );

    return { blob: new Blob([ctBuffer]), iv: ivStr };
  }

  async decrypt(
    arrayBuffer: ArrayBuffer,
    password: string,
    ivStr: string
  ): Promise<Blob> {
    const iv = new TextEncoder().encode(ivStr);

    const key = await this.createKey(password, iv, ["decrypt"]);

    const decryptedArrayBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      arrayBuffer
    );
    return new Blob([decryptedArrayBuffer]);
  }
}
