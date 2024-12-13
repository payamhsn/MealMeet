import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// API Routes
import { userRouter } from "./routes/users.js";
import { recipesRouter } from "./routes/recipes.js";

const port = process.env.PORT || 3030;
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

// To connect and confirm database connection
db.once("open", () => {
  console.log("Connected to MongoDB database!");
});

app.listen(port, () =>
  console.log(`Server running on ${port}, http://localhost:${port}`)
);
