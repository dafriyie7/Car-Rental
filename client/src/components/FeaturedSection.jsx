import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import CarCard from "./CarCard";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { motion } from "motion/react";

const FeaturedSection = () => {
	// Get all cars from global context
	const { cars } = useAppContext();

	// React Router navigation hook
	const navigate = useNavigate();

	return (
		<motion.div
			// Fade in + slide up for entire section
			initial={{ opacity: 0, y: 40 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, ease: "easeOut" }}
			className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32"
		>
			{/* Section title with animation */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.5 }}
			>
				<Title
					title="Featured Vehicles"
					subTitle="Explore our selection of premium vehicles available for your next adventure."
				/>
			</motion.div>

			{/* Featured cars grid */}
			<motion.div
				initial={{ opacity: 0, y: 100 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5, duration: 1 }}
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18"
			>
				{cars.slice(0, 6).map((car) => (
					// Animate each card separately (scale + fade)
					<motion.div
						key={car._id}
						initial={{ opacity: 0, scale: 0.95 }}
						whileInView={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.4, ease: "easeOut" }}
					>
						<CarCard car={car} />
					</motion.div>
				))}
			</motion.div>

			{/* "Explore all cars" button */}
			<motion.button
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6, duration: 0.4 }}
				onClick={() => {
					navigate("/cars"); // Navigate to all cars page
					scrollTo(0, 0); // Scroll to top
				}}
				className="flex items-center justify-center gap-2 px-2 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer"
			>
				Explore all cars
				<img src={assets.arrow_icon} alt="arrow" />
			</motion.button>
		</motion.div>
	);
};

export default FeaturedSection;
