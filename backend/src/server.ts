import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { dbConnect } from "./configs/database.config";
dbConnect();

import foodRouter from "./routers/food.router";
import userRouter from "./routers/user.router";
const app = express();
//localhost:4200
//localhost:5000

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);

const port = 5000;

app.listen(port, () => {
  console.log("Website served on http://localhost:" + port);
});
