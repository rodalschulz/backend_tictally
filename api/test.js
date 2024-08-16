// import prisma from "../prisma/prisma.js";

import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
// Generate a random 256-bit key (32 bytes)
const key = process.env.KEY;
const iv = process.env.IV;

// Encryption function
function encrypt(text) {
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

// Example usage
const data = "Sensitive information";
const encryptedData = encrypt(data);
console.log("Encrypted data to store:", encryptedData);

// Decryption function
function decrypt(encryptedData) {
  if (encryptedData.length === 96 && !/\s/.test(encryptedData)) {
    const algorithm = "aes-256-cbc";
    const iv = encryptedData.slice(0, 32); // Extract the IV from the string (32 characters for hex)
    const encryptedText = encryptedData.slice(32); // The remaining is the encrypted data
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(key, "hex"), // Use 'hex' instead of 'utf8'
      Buffer.from(iv, "hex") // Use 'hex' instead of 'utf8'
    );
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } else return encryptedData;
}

// Example usage
const decryptedData = decrypt("simple string");
console.log("Decrypted data:", decryptedData); // Outputs: 'Sensitive information'

// try {
//   const insertUser = await prisma.user.create({
//     data: {
//       email: "example@example3.com",
//       username: "example_user3",
//       password: "hashed_password",
//     },
//   });
//   console.log(insertUser);
// } catch (error) {
//   console.error(error);
// }

// try {
//   const newCollaboration = await prisma.collaboration.create({
//     data: {
//       name: "Example Collaboration",
//       creatorId: "6643fd8e965f71ceefe3fc0b",
//       users: {
//         create: [
//           {
//             userId: "6643fd8e965f71ceefe3fc0b",
//             role: "MASTER",
//           },
//           {
//             userId: "6643fde148671442b60862c5",
//             role: "USER", // Role of the second user in the collaboration
//           },
//         ],
//       },
//     },
//   });
//   console.log("New collaboration created:", newCollaboration);
// } catch (error) {
//   console.error("Error creating collaboration:", error);
// }

// const date = new Date();
// const timezoneOffsetMinutes = date.getTimezoneOffset();
// const timezoneOffsetHours = timezoneOffsetMinutes / 60;
// try {
//   const newActivity = await prisma.activity.create({
//     data: {
//       userId: "664409e3b7878bacc5558ed8",
//       date: new Date("2024-05-16T09:00:00.000Z"),
//       category: "WORK",
//       timezone: `${timezoneOffsetHours > 0 ? "-" : "+"}${Math.abs(
//         timezoneOffsetHours
//       )}`,
//     },
//   });
//   console.log("New activity created:", newActivity);
// } catch (error) {
//   console.error("Error creating activity:", error);
// }

// try {
//   const newActivity = await prisma.activity.create({
//     data: {
//       userId: "6643fd8e965f71ceefe3fc0b",
//       collaborationId: "6643f1b2aef7bc9e13d10e2a",
//       day: "Monday",
//       date: new Date("2023-05-14T09:00:00.000Z"),
//       category: "MEETING",
//     },
//   });
//   console.log("New activity created:", newActivity);
// } catch (error) {
//   console.error("Error creating activity:", error);
// }

// try {
//   const newPending = await prisma.pending.create({
//     data: {
//       userId: "6643fde148671442b60862c5",
//       //   collaborationId: "6643f1b2aef7bc9e13d10e2a",
//       description: "Pending task description",
//     },
//   });
//   console.log("New pending created:", newPending);
// } catch (error) {
//   console.error("Error creating pending:", error);
// }

// try {
//   const newPending = await prisma.pending.create({
//     data: {
//       userId: "6643fde148671442b60862c5",
//       collaborationId: "6643feb06ddf3330adf99390",
//       description: "Pending task description",
//     },
//   });
//   console.log("New pending created:", newPending);
// } catch (error) {
//   console.error("Error creating pending:", error);
// }
