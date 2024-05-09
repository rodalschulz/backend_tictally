import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authCheck = (req, res, next) => {
  try {
    console.log("Console: Checking user's credentials middleware");
    const JWT_SECRET = process.env.JWT_SECRET;
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ response: "No token provided" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log(`Decoded token: ${JSON.stringify(decoded)}`);
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ error: "Unauthenticated" });
  }
};

export default { authCheck };
