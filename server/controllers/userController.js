import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Car from "../models/Car.js"

// generate jwt token
const generateToken = (userId) => {
	return jwt.sign(userId, process.env.JWT_SECRET);
};

// create a user
export const registerUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password || password.length < 8) {
			return res
				.status(400)
				.json({
					success: false,
					message:
						"All fields are required and password must be at least 8 characters long",
				});
		}

		const userExists = await User.findOne({ email });

		if (userExists) {
			return res
				.status(400)
				.json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});
		const token = generateToken(user._id.toString());
		res.status(201).json({ success: true, token });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// user login
export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		const ismatch = await bcrypt.compare(password, user.password);
		if (!ismatch) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid credentials" });
		}

		const token = generateToken(user._id.toString());
		res.status(200).json({ success: true, token });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// get user data using jwt
export const getUserData = async (req, res) => {
	try {
		const { user } = req
		res.status(200).json({success: true, user})
	} catch (error) {
		console.log(error.message)
		res.status(500).json({success: false, message: error.message})
	}
}

// get all cars for the frontend
export const getCars = async (req, res) => {
	try {
		const cars = await Car.find({ isAvailable: true })
		res.status(200).json({success: true, cars})
	} catch (error) {
		
	}
}