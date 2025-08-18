import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// Utility function: check if a car is available for a given date range
export const checkAvailability = async (car, pickupDate, returnDate) => {
	const bookings = await Booking.find({
		car,
		// pickup must be before returnDate and return must be after pickupDate => date overlap check
		pickupDate: { $lte: returnDate },
		returnDate: { $gte: pickupDate },
	});
	return bookings.length === 0; // true if no overlapping bookings found
};

// API: get available cars for a location within a date range
export const checkAvailabilityOfCar = async (req, res) => {
	try {
		const { location, pickupDate, returnDate } = req.body;

		// fetch cars at location marked as available
		const cars = await Car.find({ location, isAvailable: true });

		// check each car’s availability within given date range
		const availableCarsPromise = cars.map(async (car) => {
			const isAvailable = await checkAvailability(
				car._id,
				pickupDate,
				returnDate
			);
			// spread _doc to include mongoose document fields
			return { ...car._doc, isAvailable: isAvailable };
		});

		// resolve all promises
		let availableCars = await Promise.all(availableCarsPromise);
		// filter only cars that are still available
		availableCars = availableCars.filter((car) => car.isAvailable === true);

		res.status(200).json({ success: true, availableCars });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};

// API: create a booking
export const createBooking = async (req, res) => {
	try {
		const { _id } = req.user; // user creating booking
		const { car, pickupDate, returnDate } = req.body;

		// validate input
		if (!car || !pickupDate || !returnDate) {
			return res.status(400).json({
				success: false,
				message: "car, pickupDate and returnDate are required",
			});
		}
		// ensure valid date format
		if (isNaN(new Date(pickupDate)) || isNaN(new Date(returnDate))) {
			return res.status(400).json({
				success: false,
				message: "Invalid pick-up or return date",
			});
		}

		// check if car is available
		const isAvailable = await checkAvailability(
			car,
			pickupDate,
			returnDate
		);
		if (!isAvailable) {
			return res
				.status(200)
				.json({ success: false, message: "Car is not available" });
		}

		// verify car exists
		const carData = await Car.findById(car);
		if (!carData) {
			return res
				.status(404)
				.json({ success: false, message: "Car not found" });
		}

		// calculate rental price
		const picked = new Date(pickupDate);
		const returned = new Date(returnDate);
		const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
		const price = carData.pricePerDay * noOfDays;

		// save booking
		await Booking.create({
			car,
			owner: carData.owner,
			user: _id,
			pickupDate,
			returnDate,
			price,
		});

		res.status(200).json({ success: true, message: "Booking created" });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};

// API: get all bookings for logged-in user
export const getUserBookings = async (req, res) => {
	try {
		const { _id } = req.user;
		const bookings = await Booking.find({ user: _id })
			.populate("car") // include car details
			.sort({ createdAt: -1 }); // latest first
		res.status(200).json({ success: true, bookings });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};

// API: get all bookings for car owner
export const getOwnerBookings = async (req, res) => {
	try {
		if (req.user.role !== "owner") {
			return res
				.status(401)
				.json({ success: false, message: "unauthorized" });
		}
		const bookings = await Booking.find({ owner: req.user._id })
			.populate("car user") // include car and user details
			.select("-user.password") // omit password field
			.sort({ createdAt: -1 });

		res.status(200).json({ success: true, bookings });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};

// API: owner can update booking status (e.g., confirmed, cancelled)
export const changeBookingStatus = async (req, res) => {
	try {
		const { _id } = req.user;
		const { bookingId, status } = req.body;

		// check if booking exists
		const booking = await Booking.findById(bookingId).populate("car");
		if (!booking) {
			return res
				.status(404)
				.json({ success: false, message: "Booking not found" });
		}

		// ensure current user is the owner of the car
		if (booking.car.owner.toString() !== _id.toString()) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}

		// update status
		booking.status = status;
		await booking.save();

		res.status(200).json({ success: true, message: "Status updated" });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};
