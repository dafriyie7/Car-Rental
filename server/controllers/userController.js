import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Car from "../models/Car.js";

// generate jwt token with user id
const generateToken = (userId) => {
	return jwt.sign(userId, process.env.JWT_SECRET);
};

// register new user
export const registerUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// basic validation
		if (!name || !email || !password || password.length < 8) {
			return res.status(400).json({
				success: false,
				message:
					"All fields are required and password must be at least 8 characters long",
			});
		}

		// check if email already exists
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res
				.status(400)
				.json({ success: false, message: "User already exists" });
		}

		// hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// create user
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		// issue jwt
		const token = generateToken(user._id.toString());
		res.status(201).json({ success: true, token });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// login user
export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		// check password
		const ismatch = await bcrypt.compare(password, user.password);
		if (!ismatch) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid credentials" });
		}

		// issue jwt
		const token = generateToken(user._id.toString());
		res.status(200).json({ success: true, token });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// return authenticated user info
export const getUserData = async (req, res) => {
	try {
		const { user } = req;
		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};

// get all available cars for clients
export const getCars = async (req, res) => {
	try {
		const cars = await Car.find({ isAvailable: true });
		res.status(200).json({ success: true, cars });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ success: false, message: error.message });
	}
};
