import express from "express";
import authRoutes from "./Routes/auth.routes.js"
import userRoutes from "./Routes/user.route.js"
import cookieParser from "cookie-parser"

const app = express();
app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app