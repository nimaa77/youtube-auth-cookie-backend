import express from "express"

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken.js"

import { getUser } from "../../utils/getUser.js"
import { validateCredentials } from "../../utils/validateCredentials.js"

import {
  ACCESS_TOKEN_AGE,
  IS_PROD,
  REFRESH_TOKEN_AGE,
} from "../../config/index.js"

import { saveUserRefreshToken } from "../../db/refreshToken.js"

const router = express.Router()

router.post(
  "/login",
  async (req, res) => {
    const { email, password } = req.body
    const isValid = validateCredentials(
      email,
      password
    )

    if (!isValid) {
      return res
        .status(401)
        .send({
          error: "Invalid credentials",
        })
    }

    const user = getUser(email)
    const accessToken =
      await generateAccessToken(user)
    const refreshToken =
      generateRefreshToken()

    // save refresh token to db
    saveUserRefreshToken(
      user.id,
      refreshToken
    )

    res.cookie(
      "refresh_token",
      refreshToken,
      {
        path: "/api/v1/refresh-token",
        httpOnly: true,
        secure: IS_PROD,
        maxAge: REFRESH_TOKEN_AGE,
      }
    )

    res.cookie(
      "access_token",
      accessToken,
      {
        path: "/api",
        httpOnly: true,
        secure: IS_PROD,
        maxAge: REFRESH_TOKEN_AGE,
      }
    )

    res.cookie(
      "accessToken_expires",
      Date.now() + ACCESS_TOKEN_AGE,
      {
        maxAge: REFRESH_TOKEN_AGE,
      }
    )

    res.send(user)
  }
)

router.post(
  "/logout",
  async (req, res) => {
    res.clearCookie("refresh_token")
    res.clearCookie("access_token")
    res.clearCookie(
      "accessToken_expires"
    )

    res.status(200).send()
  }
)

export default router
