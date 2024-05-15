import prisma from "../prisma/prisma.js";

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

// try {
//   const newActivity = await prisma.activity.create({
//     data: {
//       userId: "6643fe29ee4281c912701859",
//       day: "Monday",
//       date: new Date("2023-05-14T09:00:00.000Z"),
//       category: "WORK",
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
