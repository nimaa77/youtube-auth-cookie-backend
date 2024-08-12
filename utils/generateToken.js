import { SignJWT } from "jose"
import crypto from "crypto"

import {
  ACCESS_TOKEN_AGE,
  SECRET,
} from "../config/index.js"

const secret = new TextEncoder().encode(
  SECRET
)
const alg = "HS256"

export async function generateAccessToken(
  user
) {
  return new SignJWT({ user })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(
      `${ACCESS_TOKEN_AGE / 1000}s`
    )
    .sign(secret)
}

export function generateRefreshToken() {
  const token = crypto
    .randomBytes(32)
    .toString("hex")
  return token
}
