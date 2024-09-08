import express from "express";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken.js";

import { getUser } from "../../utils/getUser.js";
import { validateCredentials } from "../../utils/validateCredentials.js";

import { ACCESS_TOKEN_AGE } from "../../config/index.js";

import { saveUserRefreshToken } from "../../db/refreshToken.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const isValid = validateCredentials(email, password);

  if (!isValid) {
    return res.status(401).send({
      error: "Invalid credentials",
    });
  }

  const user = getUser(email);
  const accessToken = await generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  // save refresh token to db
  saveUserRefreshToken(user.id, refreshToken);

  return res.status(200).send({
    accessToken,
    refreshToken,
    accessToken_expires: Date.now() + ACCESS_TOKEN_AGE,
    user,
  });
});

router.post("/logout", async (req, res) => {
  // TODO: Remove refresh token from db

  res.status(200).send();
});

export default router;
