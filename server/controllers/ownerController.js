import imagekit from "../configs/imagekit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";

// change user role to owner
export const changeRoleToOwner = async (req, res) => {
	try {
		const { _id } = req.user;
		// update user role so they can list cars
		await User.findByIdAndUpdate(_id, { role: "owner" });

		res.status(200).json({
			success: true,
			message: "Now you can list cars",
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};

// add a car for listing
export const addCar = async (req, res) => {
	try {
		const { _id } = req.user;
		let car;

		// parse car data sent in request body
		try {
			car = JSON.parse(req.body.carData);
		} catch (parseError) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid car data format" });
		}

		// ensure image is uploaded
		const imageFile = req.file;
		if (!imageFile) {
			return res
				.status(400)
				.json({ success: false, message: "No image uploaded" });
		}

		// read uploaded image
		const fileBuffer = fs.readFileSync(imageFile.path);

		// upload image to ImageKit
		const response = await imagekit.upload({
			file: fileBuffer,
			fileName: imageFile.originalname,
			folder: "/cars",
		});

		// delete temp file
		fs.unlinkSync(imageFile.path);

		// generate optimized image URL
		const optimizedImageURL = imagekit.url({
			path: response.filePath,
			transformation: [
				{ width: "1280" },
				{ quality: "auto" },
				{ format: "webp" },
			],
		});

		// save car entry with image
		await Car.create({ ...car, owner: _id, image: optimizedImageURL });

		res.status(201).json({ success: true, message: "Car added" });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};

// get all cars listed by the logged-in owner
export const getOwnerCars = async (req, res) => {
	try {
		const { _id } = req.user;
		const cars = await Car.find({ owner: _id });

		res.status(200).json({ success: true, cars });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};

// toggle a car’s availability (active/inactive for bookings)
export const toggleCarAvailability = async (req, res) => {
	try {
		const { _id } = req.user;
		const { carId } = req.body;
		const car = await Car.findById(carId);

		if (!car) {
			return res
				.status(404)
				.json({ success: false, message: "Car not found" });
		}

		// ensure only the owner can modify their car
		if (car.owner.toString() !== _id.toString()) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}

		car.isAvailable = !car.isAvailable;
		await car.save();

		res.status(200).json({
			success: true,
			message: "Availability toggled",
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};

// delete a car from listings
export const deleteCar = async (req, res) => {
	try {
		const { _id } = req.user;
		const { carId } = req.body;
		const car = await Car.findById(carId);

		if (!car) {
			return res
				.status(404)
				.json({ success: false, message: "Car not found" });
		}

		// only the owner can delete
		if (car.owner.toString() !== _id.toString()) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}

		// mark car as removed rather than deleting record
		car.owner = null;
		car.isAvailable = false;
		await car.save();

		res.status(200).json({
			success: true,
			message: "Car removed",
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};

// get owner dashboard metrics
export const getDashboardData = async (req, res) => {
	try {
		const { _id, role } = req.user;

		// restrict to owners only
		if (role !== "owner") {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}

		// fetch cars and bookings for this owner
		const cars = await Car.find({ owner: _id });
		const bookings = await Booking.find({ owner: _id })
			.populate("car")
			.sort({ createdAt: -1 });

		// classify bookings
		const pendingBookings = bookings.filter((b) => b.status === "pending");
		const completedBookings = bookings.filter(
			(b) => b.status === "confirmed"
		);

		// calculate revenue from completed bookings
		const monthlyRevenue = completedBookings.reduce(
			(acc, booking) => acc + booking.price,
			0
		);

		const dashboardData = {
			totalCars: cars.length,
			totalBookings: bookings.length,
			pendingBookings: pendingBookings.length,
			completedBookings: completedBookings.length,
			recentBookings: bookings.slice(0, 3), // show last 3 bookings
			monthlyRevenue,
		};

		res.status(200).json({ success: true, dashboardData });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};

// update user profile image
export const updateUserImage = async (req, res) => {
	try {
		const { _id } = req.user;
		const imageFile = req.file;

		if (!imageFile) {
			return res
				.status(400)
				.json({ success: false, message: "No image uploaded" });
		}

		// read uploaded image
		const fileBuffer = fs.readFileSync(imageFile.path);

		// upload to ImageKit
		const response = await imagekit.upload({
			file: fileBuffer,
			fileName: imageFile.originalname,
			folder: "/users",
		});

		// delete temp file
		fs.unlinkSync(imageFile.path);

		// generate optimized URL
		const optimizedImageURL = imagekit.url({
			path: response.filePath,
			transformation: [
				{ width: "400" },
				{ quality: "auto" },
				{ format: "webp" },
			],
		});

		// update user profile with new image
		await User.findByIdAndUpdate(_id, { image: optimizedImageURL });

		res.status(200).json({ success: true, message: "Image updated" });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};
