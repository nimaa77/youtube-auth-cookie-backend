import express from "express"
import auth from "./auth/index.js"
import me from "./me/index.js"
import products from "./products/index.js"
import orders from "./orders/index.js"
import refreshToken from "./refresh-token/index.js"
import { validateToken } from "../utils/validateToken.js"

const router = express.Router()

// public routes
router.use("/auth", auth)
router.use("/products", products)

// refresh token route
router.use(
  "/refresh-token",
  refreshToken
)

// private routes
router.use("/me", validateToken, me)
router.use(
  "/orders",
  validateToken,
  orders
)

export default router
