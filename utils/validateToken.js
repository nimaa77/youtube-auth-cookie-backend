import { jwtVerify } from "jose";
import { SECRET } from "../config/index.js";

const secret = new TextEncoder().encode(SECRET);

export async function validateToken(req, res, next) {
  const header = req.headers["authorization"] || "";
  const [type, token] = header.split(" ");

  if (!token) {
    return res.status(401).send({
      error: "Token is required",
    });
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    req.user = payload.user;
  } catch (error) {
    return res.status(401).send({ error: error.code });
  }

  next();
}
