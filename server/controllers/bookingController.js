import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// check car availability of car for a given date
export const checkAvailability = async (car, pickupDate, returnDate) => {
	const bookings = await Booking.find({
		car,
		pickupDate: { $lte: returnDate },
		returnDate: { $gte: pickupDate },
	});
	return bookings.length === 0;
};

// check car availability for a given date  and location
export const checkAvailabilityOfCar = async (req, res) => {
	try {
		const { location, pickupDate, returnDate } = req.body;

		// fetch all available cars for the given location
		const cars = await Car.find({ location, isAvailable: true });

		// check car availability for a given date range by using promise
		const availableCarsPromise = cars.map(async (car) => {
			const isAvailable = await checkAvailability(
				car._id,
				pickupDate,
				returnDate
            );
            return {...car._doc, isAvailable: isAvailable}
        });
        
        let availableCars = await Promise.all(availableCarsPromise)
        availableCars = availableCars.filter(car => car.isAvailable === true)

        res.status(200).json({success: true, availableCars})
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};

// create booking
export const createBooking = async (req, res) => {
	try {
		const { _id } = req.user;
		const { car, pickupDate, returnDate } = req.body;

		// Validate input
		if (!car || !pickupDate || !returnDate) {
			return res
				.status(400)
				.json({
					success: false,
					message: "car, pickupDate and returnDate are required",
				});
		}
		if (isNaN(new Date(pickupDate)) || isNaN(new Date(returnDate))) {
			return res
				.status(400)
				.json({
					success: false,
					message: "Invalid pick-up or return date",
				});
		}

		// Check availability
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

		const carData = await Car.findById(car);
		if (!carData) {
			return res
				.status(404)
				.json({ success: false, message: "Car not found" });
		}

		// Calculate price
		const picked = new Date(pickupDate);
		const returned = new Date(returnDate);
		const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
		const price = carData.pricePerDay * noOfDays;

		// Create booking
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

// list user bookings
export const getUserBookings = async (req, res) => {
    try {
        const { _id } = req.user
        const bookings = await Booking.find({ user: _id }).populate("car").sort({ createdAt: -1 })
        res.status(200).json({success: true, bookings})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: error.message})
    }
}

// get owner bookings
export const getOwnerBookings = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(401).json({success: false, message: "unauthorized"})
        }
        const bookings = await Booking.find({ owner: req.user._id }).populate("car user").select("-user.password").sort({ createdAt: -1 })
        
        res.status(200).json({success: true, bookings})
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};

// owner update booking status
export const changeBookingStatus = async (req, res) => {
	try {
		const { _id } = req.user;
		const { bookingId, status } = req.body; // FIXED: from req.body

		const booking = await Booking.findById(bookingId).populate("car");

		if (!booking) {
			return res
				.status(404)
				.json({ success: false, message: "Booking not found" });
		}

		if (booking.car.owner.toString() !== _id.toString()) {
			return res
				.status(401)
				.json({ success: false, message: "Unauthorized" });
		}

		booking.status = status;
		await booking.save();

		res.status(200).json({ success: true, message: "Status updated" });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};
