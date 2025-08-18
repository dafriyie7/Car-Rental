import jwt from "jsonwebtoken";
import User from "../models/User.js";

// middleware: protect routes by verifying JWT
export const protect = async (req, res, next) => {
	const token = req.headers.authorization;

	// require token
	if (!token) {
		return res
			.status(401)
			.json({ success: false, message: "note authorized" });
	}

	try {
		// decode token to extract userId
		const userId = jwt.decode(token, process.env.JWT_SECRET);

		if (!userId) {
			return res
				.status(401)
				.json({ success: false, message: "not authorized" });
		}

		// attach user to request (exclude password)
		req.user = await User.findById(userId).select("-password");

		next();
	} catch (error) {
		console.log(error.message);
		return res
			.status(401)
			.json({ success: false, message: "not authorized" });
	}
};
