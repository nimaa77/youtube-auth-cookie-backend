import { REFRESH_TOKEN_AGE } from "../config/index.js";

// SIMULATED DATABASE :)
// In a real-world application, you would use a database to store refresh tokens.
let tokens = [];

export function getUserRefreshToken(refreshToken) {
  return tokens.find((token) => token.refreshToken === refreshToken);
}

export function saveUserRefreshToken(userId, refreshToken) {
  tokens.push({
    userId,
    refreshToken,
    expires: Date.now() + REFRESH_TOKEN_AGE,
  });
}

export function removeRefreshToken(refreshToken) {
  tokens = tokens.filter((item) => item.refreshToken !== refreshToken);
}
