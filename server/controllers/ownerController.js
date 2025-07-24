// import imagekit from "../configs/imagekit.js";
// import Booking from "../models/Booking.js";
// import Car from "../models/Car.js";
// import User from "../models/User.js";
// import fs from "fs";

// // change user role
// export const changeRoleToOwner = async (req, res) => {
// 	try {
// 		const { _id } = req.user;
// 		await User.findByIdAndUpdate(_id, { role: "owner" });

// 		res.status(200).json({
// 			success: true,
// 			message: "now you can list cars",
// 		});
// 	} catch (error) {
// 		console.log(error.message);
// 		res.status(500).json({ success: false, message: error.message });
// 	}
// };

// // list car
// export const addCar = async (req, res) => {
// 	try {
// 		const { _id } = req.user;
// 		let car = JSON.parse(req.body.carData);
// 		const imageFile = req.file;

// 		// upload image to imagekit
// 		const fileBuffer = fs.readFileSync(imageFile.path);

// 		const response = await imagekit.upload({
// 			file: fileBuffer,
// 			fileName: imageFile.originalname,
// 			folder: "/cars",
// 		});

// 		// Foptimization through imagekit URL  transformation
// 		var optimizedImageURL = imagekit.url({
// 			path: response.filePath,
// 			transformation: [
// 				{ width: "1280" }, // width resize
// 				{ quality: "auto" }, // auto compression
// 				{ format: "webp" }, // convert to modern format
// 			],
// 		});

// 		const image = optimizedImageURL;

// 		await Car.create({ ...car, owner: _id, image });

// 		res.json({ success: true, message: "car added" });
// 	} catch (error) {
// 		console.log(error.message);
// 		res.status(500).json({ success: false, message: error.message });
// 	}
// };

// // list owner cars
// export const getOwnerCars = async (req, res) => {
// 	try {
// 		const { _id } = req.user;
// 		const cars = await Car.find({ owner: _id });

// 		res.status(200).json({ success: true, cars });
// 	} catch (error) {
// 		console.log(error.message);
// 		res.status(500).json({ success: false, message: error.message });
// 	}
// };

// // toggle car availability
// export const toggleCarAvailability = async (req, res) => {
// 	try {
// 		const { _id } = req.user;
// 		const { carId } = req.body;
// 		const car = await Car.findById(carId);

// 		// check if car belongs to the user
// 		if (car.owner.toString() !== _id.toString()) {
// 			return res
// 				.status(401)
// 				.json({ success: false, message: "unauthorized" });
// 		}

// 		car.isAvailable = !car.isAvailable;
// 		await car.save();

// 		res.status(200).json({
// 			success: true,
// 			message: "availability toggled",
// 		});
// 	} catch (error) {
// 		console.log(error.message);
// 		res.status(500).json({ success: false, message: error.message });
// 	}
// };

// // delete a car
// export const deleteCar = async (req, res) => {
// 	try {
// 		const { _id } = req.user;
// 		const { carId } = req.body;
// 		const car = await Car.findById(carId);

// 		// check if car belongs to the user
// 		if (car.owner.toString() !== _id.toString()) {
// 			return res
// 				.status(401)
// 				.json({ success: false, message: "unauthorized" });
// 		}

// 		car.owner = null;
// 		car.isAvailable = false;

// 		await car.save();

// 		res.status(200).json({
// 			success: true,
// 			message: "car removed",
// 		});
// 	} catch (error) {
// 		console.log(error.message);
// 		res.status(500).json({ success: false, message: error.message });
// 	}
// };

// // get dashboard data
// export const getDashboardData = async (req, res) => {
// 	try {
// 		const { _id } = req.user;

// 		if (role !== "owner") {
// 			return res
// 				.status(401)
// 				.json({ success: false, message: "unauthorized" });
// 		}

// 		const cars = await Car.find({ owner: _id });
// 		const bookings = await Booking.find({ owner: _id })
// 			.populate("car")
// 			.sort({ createdAt: -1 });

// 		const pendingBookings = await Booking.find({
// 			owner: _id,
// 			status: "pending",
// 		});
// 		const completedBookings = await Booking.find({
// 			owner: _id,
// 			status: "confirmed",
//         });
        
//         // calculate monthly revenue from bookings whre status is confirmed
//         const monthlyRevenue = bookings.slice().filter(booking => booking.status === 'confirmed').reduce(() => acc + booking.price, 0)

//         const dashboardData = {
//             totalCars: cars.length,
//             totalBookings: bookings.length,
//             pendingBookings: pendingBookings.length,
//             completedBookings: completedBookings.length,
//             recentBookings: bookings.slice(0, 3),
//             monthlyRevenue
//         }

//         res.status(200).json({success: true, dashboardData})
// 	} catch (error) {
// 		console.log(error.message);
// 		res.status(500).json({ success: false, message: error.message });
// 	}
// };

// //update user image
// export const updateUserImage = async (req, res) => {
//     try {
//         const { _id } = req.user;
//         const imageFile = req.file

// 		// upload image to imagekit
// 		const fileBuffer = fs.readFileSync(imageFile.path);

// 		const response = await imagekit.upload({
// 			file: fileBuffer,
// 			fileName: imageFile.originalname,
// 			folder: "/users",
// 		});

// 		// Foptimization through imagekit URL  transformation
// 		var optimizedImageURL = imagekit.url({
// 			path: response.filePath,
// 			transformation: [
// 				{ width: "400" }, // width resize
// 				{ quality: "auto" }, // auto compression
// 				{ format: "webp" }, // convert to modern format
// 			],
// 		});

//         const image = optimizedImageURL;
        
//         await User.findByIdAndUpdate(_id, { image });
//         res.status(200).json({success: true, message: "image updated"})
// 	} catch (error) {
//         console.log(error.message)
//         res.status(500).json({success: false, message: error.message})
//     }
// }

import imagekit from "../configs/imagekit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";

// change user role
export const changeRoleToOwner = async (req, res) => {
	try {
		const { _id } = req.user;
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

// list car
export const addCar = async (req, res) => {
	try {
		const { _id } = req.user;
		let car;

		try {
			car = JSON.parse(req.body.carData);
		} catch (parseError) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid car data format" });
		}

		const imageFile = req.file;
		if (!imageFile) {
			return res
				.status(400)
				.json({ success: false, message: "No image uploaded" });
		}

		const fileBuffer = fs.readFileSync(imageFile.path);

		const response = await imagekit.upload({
			file: fileBuffer,
			fileName: imageFile.originalname,
			folder: "/cars",
		});

		fs.unlinkSync(imageFile.path); // optional cleanup

		const optimizedImageURL = imagekit.url({
			path: response.filePath,
			transformation: [
				{ width: "1280" },
				{ quality: "auto" },
				{ format: "webp" },
			],
		});

		await Car.create({ ...car, owner: _id, image: optimizedImageURL });

		res.status(201).json({ success: true, message: "Car added" });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};

// list owner cars
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

// toggle car availability
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

// delete a car
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

		if (car.owner.toString() !== _id.toString()) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}

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

// get dashboard data
export const getDashboardData = async (req, res) => {
	try {
		const { _id, role } = req.user;

		if (role !== "owner") {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}

		const cars = await Car.find({ owner: _id });
		const bookings = await Booking.find({ owner: _id })
			.populate("car")
			.sort({ createdAt: -1 });

		const pendingBookings = bookings.filter((b) => b.status === "pending");
		const completedBookings = bookings.filter(
			(b) => b.status === "confirmed"
		);

		const monthlyRevenue = completedBookings.reduce(
			(acc, booking) => acc + booking.price,
			0
		);

		const dashboardData = {
			totalCars: cars.length,
			totalBookings: bookings.length,
			pendingBookings: pendingBookings.length,
			completedBookings: completedBookings.length,
			recentBookings: bookings.slice(0, 3),
			monthlyRevenue,
		};

		res.status(200).json({ success: true, dashboardData });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};

// update user image
export const updateUserImage = async (req, res) => {
	try {
		const { _id } = req.user;
		const imageFile = req.file;

		if (!imageFile) {
			return res
				.status(400)
				.json({ success: false, message: "No image uploaded" });
		}

		const fileBuffer = fs.readFileSync(imageFile.path);

		const response = await imagekit.upload({
			file: fileBuffer,
			fileName: imageFile.originalname,
			folder: "/users",
		});

		fs.unlinkSync(imageFile.path); // optional cleanup

		const optimizedImageURL = imagekit.url({
			path: response.filePath,
			transformation: [
				{ width: "400" },
				{ quality: "auto" },
				{ format: "webp" },
			],
		});

		await User.findByIdAndUpdate(_id, { image: optimizedImageURL });

		res.status(200).json({ success: true, message: "Image updated" });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};
