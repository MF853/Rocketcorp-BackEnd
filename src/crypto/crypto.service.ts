import { Injectable } from "@nestjs/common";
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from "crypto";
import { promisify } from "util";

@Injectable()
export class CryptoService {
  private readonly algorithm = "aes-256-ctr";
  private readonly secretKey =
    process.env.CRYPTO_SECRET_KEY || "default-secret-key-change-in-production";
  private readonly scryptAsync = promisify(scrypt);

  async encrypt(text: string): Promise<string> {
    if (!text || text.trim() === "") {
      return text;
    }

    const salt = randomBytes(16);
    const key = (await this.scryptAsync(this.secretKey, salt, 32)) as Buffer;
    const iv = randomBytes(16);

    const cipher = createCipheriv(this.algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return `${salt.toString("hex")}:${iv.toString("hex")}:${encrypted.toString(
      "hex"
    )}`;
  }

  async decrypt(encryptedText: string): Promise<string> {
    if (!encryptedText || encryptedText.trim() === "") {
      return encryptedText;
    }

    // Check if the text is already encrypted (has the expected format)
    if (!encryptedText.includes(":")) {
      // If not encrypted, return as is (backward compatibility)
      return encryptedText;
    }

    try {
      const [saltHex, ivHex, encryptedHex] = encryptedText.split(":");

      const salt = Buffer.from(saltHex, "hex");
      const iv = Buffer.from(ivHex, "hex");
      const encrypted = Buffer.from(encryptedHex, "hex");

      const key = (await this.scryptAsync(this.secretKey, salt, 32)) as Buffer;

      const decipher = createDecipheriv(this.algorithm, key, iv);
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);

      return decrypted.toString();
    } catch (error) {
      console.error("Error decrypting text:", error);
      // Return original text if decryption fails (backward compatibility)
      return encryptedText;
    }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */
  async encryptObject<T extends Record<string, any>>(obj: T): Promise<T> {
    if (!obj) return obj;

    const result = { ...obj } as any;

    // Encrypt justificativa fields
    if ("justificativa" in result && typeof result.justificativa === "string") {
      result.justificativa = await this.encrypt(result.justificativa);
    }

    if (
      "justificativa_gestor" in result &&
      typeof result.justificativa_gestor === "string"
    ) {
      result.justificativa_gestor = await this.encrypt(
        result.justificativa_gestor
      );
    }

    if (
      "justificativaGestor" in result &&
      typeof result.justificativaGestor === "string"
    ) {
      result.justificativaGestor = await this.encrypt(
        result.justificativaGestor
      );
    }

    // Encrypt 360 evaluation fields
    if ("pontosFortes" in result && typeof result.pontosFortes === "string") {
      result.pontosFortes = await this.encrypt(result.pontosFortes);
    }

    if ("pontosMelhora" in result && typeof result.pontosMelhora === "string") {
      result.pontosMelhora = await this.encrypt(result.pontosMelhora);
    }

    return result;
  }

  async decryptObject<T extends Record<string, any>>(obj: T): Promise<T> {
    if (!obj) return obj;

    const result = { ...obj } as any;

    // Decrypt justificativa fields
    if ("justificativa" in result && typeof result.justificativa === "string") {
      result.justificativa = await this.decrypt(result.justificativa);
    }

    if (
      "justificativa_gestor" in result &&
      typeof result.justificativa_gestor === "string"
    ) {
      result.justificativa_gestor = await this.decrypt(
        result.justificativa_gestor
      );
    }

    if (
      "justificativaGestor" in result &&
      typeof result.justificativaGestor === "string"
    ) {
      result.justificativaGestor = await this.decrypt(
        result.justificativaGestor
      );
    }

    // Decrypt 360 evaluation fields
    if ("pontosFortes" in result && typeof result.pontosFortes === "string") {
      result.pontosFortes = await this.decrypt(result.pontosFortes);
    }

    if ("pontosMelhora" in result && typeof result.pontosMelhora === "string") {
      result.pontosMelhora = await this.decrypt(result.pontosMelhora);
    }

    return result;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */
}
