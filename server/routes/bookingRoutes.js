import express from "express";
import {
	changeBookingStatus,
	checkAvailabilityOfCar,
	createBooking,
	getOwnerBookings,
	getUserBookings,
} from "../controllers/bookingController.js";
import { protect } from "../middlewares/auth.js";

const bookingRouter = express.Router();

bookingRouter
	.post("/check-availability", checkAvailabilityOfCar)
	.post("/create", protect, createBooking)
	.get("/user", protect, getUserBookings)
	.get("/owner", protect, getOwnerBookings)
	.post("/change-status", protect, changeBookingStatus);

export default bookingRouter;
