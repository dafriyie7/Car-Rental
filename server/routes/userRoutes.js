import express from "express";
import {
	getCars,
	getUserData,
	loginUser,
	registerUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter
	.post("/register", registerUser)
	.post("/login", loginUser)
	.get("/data", protect, getUserData)
	.get('/cars', getCars)

export default userRouter;
