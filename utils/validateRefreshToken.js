import { getUserRefreshToken } from "../db/refreshToken.js"

export function validateRefreshToken(
  refreshToken
) {
  const token = getUserRefreshToken(
    refreshToken
  )

  if (!token) {
    return null
  }

  if (token.expires < Date.now()) {
    return null
  }

  return token
}
