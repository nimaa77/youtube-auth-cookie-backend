import express from "express"

const router = express.Router()

router.get("/", (req, res) => {
  res.send({
    data: [
      {
        title: "Next.js for Beginners",
        price: 100,
        quantity: 2,
        status: "pending",
      },
    ],
  })
})

export default router
