// db.activities.deleteMany({});
//
// db.users.createIndex({ username: 1 }, { unique: true });
// db.users.createIndex({ email: 1 }, { unique: true });

// db.createCollection("users", {
//   validator: {
//     $jsonSchema: {
//       bsonType: "object",
//       required: ["email", "username", "password"],
//       properties: {
//         email: {
//           bsonType: "string",
//           description: "must be a string and is required",
//           pattern: "^\\S+@\\S+\\.\\S+$",
//         },
//         username: {
//           bsonType: "string",
//           description: "must be a string and is required",
//           minLength: 3,
//           maxLength: 22,
//         },
//         password: {
//           bsonType: "string",
//           description: "must be a string and is required",
//         },
//         globalRole: {
//           enum: ["USER", "ADMIN", "MASTER"],
//           description: "must be one of: USER, ADMIN, MASTER",
//         },
//       },
//     },
//   },
// });
