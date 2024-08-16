import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const key = process.env.ENCRYPT_KEY;
const iv = process.env.IV;
if (key === undefined || iv === undefined) {
  console.log("--- ERROR READING ENCRYPTION ENV VARIABLES ---");
}

export function encrypt(text) {
  //   const key = process.env.ENCRYPT_KEY;
  //   const iv = process.env.IV;
  //   if (key === undefined || iv === undefined) {
  //     console.log("ERROR READING ENV VARIABLES");
  //     return;
  //   }
  const algorithm = "aes-256-cbc";
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv + encrypted;
}

export function decrypt(encryptedData) {
  //   const key = process.env.ENCRYPT_KEY;
  //   const iv = process.env.IV;
  //   if (key === undefined || iv === undefined) {
  //     console.log("ERROR READING ENV VARIABLES");
  //     return;
  //   }
  if (encryptedData.length > 30 && !/\s/.test(encryptedData)) {
    const algorithm = "aes-256-cbc";
    const iv = encryptedData.slice(0, 32);
    const encryptedText = encryptedData.slice(32);
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(key, "hex"),
      Buffer.from(iv, "hex")
    );
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } else return encryptedData;
}
