import express from "express";

import {
  saveUserRefreshToken,
  removeRefreshToken,
} from "../../db/refreshToken.js";
import {
  ACCESS_TOKEN_AGE,
  IS_PROD,
  REFRESH_TOKEN_AGE,
} from "./../../config/index.js";
import { validateRefreshToken } from "../../utils/validateRefreshToken.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken.js";
import { getUser } from "../../utils/getUser.js";

const router = express.Router();

router.post("/", async (req, res) => {
  // read refresh token from cookies
  const refreshTokenCookie = req.cookies["refresh_token"];

  // if no refresh token, return 401
  if (!refreshTokenCookie) {
    return res.sendStatus(401);
  }

  // validate refresh token
  const data = validateRefreshToken(refreshTokenCookie);

  // if invalid refresh token, return 401
  if (!data) {
    res.clearCookie("refresh_token");
    res.clearCookie("access_token");
    res.clearCookie("accessToken_expires");

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

  res.cookie("refresh_token", newRefreshToken, {
    path: "/api/v1/refresh-token",
    httpOnly: true,
    secure: IS_PROD,
    maxAge: REFRESH_TOKEN_AGE,
  });

  res.cookie("access_token", newAccessToken, {
    path: "/api",
    httpOnly: true,
    secure: IS_PROD,
    maxAge: REFRESH_TOKEN_AGE,
  });

  res.cookie("accessToken_expires", Date.now() + ACCESS_TOKEN_AGE, {
    maxAge: REFRESH_TOKEN_AGE,
  });

  res.status(201).send();
});

export default router;
