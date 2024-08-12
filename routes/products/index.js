import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  const products = [
    { id: 1, name: "Product 1" },
    { id: 2, name: "Product 2" },
    { id: 3, name: "Product 3" },
  ];

  res.send({ data: products });
});

export default router;
