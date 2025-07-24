import express from "express";
import { protect } from "../middlewares/auth.js";
import {
	addCar,
	changeRoleToOwner,
	deleteCar,
	getDashboardData,
	getOwnerCars,
	toggleCarAvailability,
    updateUserImage,
} from "../controllers/ownerController.js";
import upload from "../middlewares/multer.js";

const ownerRouter = express.Router();

ownerRouter
	.post("/change-role", protect, changeRoleToOwner)
	.post("/add-car", upload.single("image"), protect, addCar)
	.get("/cars", protect, getOwnerCars)
	.post("/toggle-car", protect, toggleCarAvailability)
    .post("/delete-car", protect, deleteCar)
    .get('/dashboard', protect, getDashboardData)
    .post('/update-image', upload.single("image"), protect, updateUserImage)

export default ownerRouter;
