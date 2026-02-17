import express from "express";
import { SignUp , LogIn , LogOut } from "../controllers/auth.controller.js";

const router = express.Router()

router.post("/signUp", SignUp)

router.post("/LogIn", LogIn)

router.post("/LogOut", LogOut)

export default router