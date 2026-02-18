import express from "express";
import authRoutes from "./Routes/auth.routes.js"
import chatRoutes from "./Routes/chat.route.js"
import userRoutes from "./Routes/user.route.js"
import cookieParser from "cookie-parser"

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

export default app