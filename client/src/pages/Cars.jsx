import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const Cars = () => {
	// Get query parameters from the URL (pickup location & dates)
	const [searchParams] = useSearchParams();
	const pickupLocation = searchParams.get("pickupLocation");
	const pickupDate = searchParams.get("pickupDate");
	const returnDate = searchParams.get("returnDate");

	// Access global context values
	const { cars, axios } = useAppContext();

	// Local state for search filter input and filtered car list
	const [input, setInput] = useState("");
	const [filteredCars, setFilteredCars] = useState([]);

	// Boolean to check if user is searching with location & dates
	const isSearchData = pickupLocation && pickupDate && returnDate;

	/**
	 * Apply client-side filter based on user input (brand, model, category, etc.)
	 */
	const applyFilter = () => {
		if (!input || input.trim() === "") {
			setFilteredCars(cars); // Show all cars if no input
			return;
		}

		const lower = input.toLowerCase();

		const filtered = cars.filter((car) => {
			const brand = car.brand?.toLowerCase() || "";
			const model = car.model?.toLowerCase() || "";
			const category = car.category?.toLowerCase() || "";
			const transmission = car.transmission?.toLowerCase() || "";
			const features = car.features?.toLowerCase() || "";

			return (
				brand.includes(lower) ||
				model.includes(lower) ||
				category.includes(lower) ||
				transmission.includes(lower) ||
				features.includes(lower)
			);
		});

		setFilteredCars(filtered);
	};

	/**
	 * Call API to check availability of cars based on location & dates
	 */
	const searchCarAvailability = async () => {
		try {
			const { data } = await axios.post(
				"/api/booking/check-availability",
				{
					location: pickupLocation,
					pickupDate,
					returnDate,
				}
			);

			if (data.success) {
				setFilteredCars(data.availableCars);

				if (data.availableCars.length === 0) {
					toast.error("No cars available");
				}
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error("Failed to check availability");
		}
	};

	/**
	 * Run availability check when search parameters exist
	 */
	useEffect(() => {
		if (isSearchData) {
			searchCarAvailability();
		}
	}, [pickupLocation, pickupDate, returnDate]);

	/**
	 * Run local filter when user types into the search bar
	 */
	useEffect(() => {
		if (!isSearchData && cars.length > 0) {
			applyFilter();
		}
	}, [input, cars]);

	return (
		<div>
			{/* Page Title & Search Input */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="flex flex-col items-center py-20 bg-light max-md:px-4"
			>
				<Title
					title={"Available Cars"}
					subTitle={
						"Browse our selection of premium vehicles available for your next adventure"
					}
				/>

				{/* Search Bar */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.5 }}
					className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow"
				>
					<img
						src={assets.search_icon}
						alt="search"
						className="w-4 h-4 mr-2"
					/>
					<input
						onChange={(e) => setInput(e.target.value)}
						value={input}
						type="text"
						placeholder="Search by make, model or features"
						className="w-full h-full outline-none text-gray-500"
					/>
					<img
						src={assets.filter_icon}
						alt="filter"
						className="w-4 h-4 ml-2"
					/>
				</motion.div>
			</motion.div>

			{/* Car Results Section */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.6, duration: 0.5 }}
				className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10"
			>
				{/* Car Count */}
				<p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
					Showing {filteredCars.length} Cars
				</p>

				{/* Car Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
					{filteredCars.map((car, index) => (
						<motion.div
							key={car._id || index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 * index, duration: 0.4 }}
						>
							<CarCard car={car} />
						</motion.div>
					))}
				</div>
			</motion.div>
		</div>
	);
};

export default Cars;
