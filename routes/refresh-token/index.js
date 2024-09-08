import express from "express";

import {
  saveUserRefreshToken,
  removeRefreshToken,
} from "../../db/refreshToken.js";
import { ACCESS_TOKEN_AGE } from "./../../config/index.js";
import { validateRefreshToken } from "../../utils/validateRefreshToken.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken.js";
import { getUser } from "../../utils/getUser.js";

const router = express.Router();

router.post("/", async (req, res) => {
  // read refresh token from cookies
  const refreshTokenCookie = req.body["refresh_token"];

  // if no refresh token, return 401
  if (!refreshTokenCookie) {
    return res.sendStatus(401);
  }

  // validate refresh token
  const data = validateRefreshToken(refreshTokenCookie);

  // if invalid refresh token, return 401
  if (!data) {
    return res.sendStatus(401);
  }

  // get user info from db
  const user = getUser(data.userId);

  // generate new access token
  const newAccessToken = await generateAccessToken(user);

  const newRefreshToken = generateRefreshToken();

  // save new refresh token to db
  saveUserRefreshToken(user.id, newRefreshToken);

  // remove old refresh token form db
  removeRefreshToken(data.refreshToken);

  return res.status(200).send({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessToken_expires: Date.now() + ACCESS_TOKEN_AGE,
  });
});

export default router;
