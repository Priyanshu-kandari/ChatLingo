import express from "express";
import authRoutes from "./Routes/auth.routes.js";
import chatRoutes from "./Routes/chat.route.js";
import userRoutes from "./Routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

export default app;
