import express from "express";
import cookieParser from "cookie-parser";
import apiRouter from "./routes/api.route.js";
import cors from "cors";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/v1", apiRouter);

app.listen(4000, () => {
  console.log(`Server is running on port 4000`);
});
