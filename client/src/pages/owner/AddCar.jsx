import React, { useState } from "react";
import TitleOwner from "../../components/owner/TitleOwner";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/appContext";
import toast from "react-hot-toast";

const AddCar = () => {
	const { currency, axios } = useAppContext();

	// Initial car state structure
	const initialCarState = {
		brand: "",
		model: "",
		year: "",
		pricePerDay: "",
		category: "",
		transmission: "",
		fuel_type: "",
		seating_capacity: "",
		location: "",
		description: "",
	};

	const [image, setImage] = useState(null);
	const [car, setCar] = useState(initialCarState);
	const [isLoading, setIsLoading] = useState(false);

	// Handle form submission
	const onSubmitHandler = async (e) => {
		e.preventDefault();
		if (isLoading) return;

		// Validate required fields
		if (!image || !car.brand || !car.model) {
			toast.error("Please fill all required fields");
			return;
		}

		setIsLoading(true);

		try {
			const formData = new FormData();
			formData.append("image", image);
			formData.append("carData", JSON.stringify(car));

			const { data } = await axios.post("/api/owner/add-car", formData);

			if (data.success) {
				toast.success(data.message);

				// Reset form after success
				setImage(null);
				setCar(initialCarState);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="px-4 py-10 md:px-10 flex-1">
			{/* Page Title */}
			<TitleOwner
				title="Add New Car"
				subTitle="Fill in details to list a new car for booking, including pricing, availability, and specifications."
			/>

			{/* Add Car Form */}
			<form
				className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl"
				onSubmit={onSubmitHandler}
			>
				{/* Car Image Upload */}
				<div className="flex items-center gap-2 w-full">
					<label htmlFor="car-image">
						<img
							src={
								image
									? URL.createObjectURL(image)
									: assets.upload_icon
							}
							alt="car-upload"
							className="h-14 rounded cursor-pointer"
						/>
						<input
							type="file"
							id="car-image"
							accept="image/*"
							hidden
							onChange={(e) => setImage(e.target.files[0])}
						/>
					</label>
					<p className="text-sm text-gray-500">
						Upload a picture of your car
					</p>
				</div>

				{/* Brand & Model */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<InputField
						label="Brand"
						type="text"
						placeholder="e.g. BMW, Mercedes, Audi..."
						value={car.brand}
						onChange={(e) =>
							setCar({ ...car, brand: e.target.value })
						}
						required
					/>
					<InputField
						label="Model"
						type="text"
						placeholder="e.g. X5, E-Class, M4..."
						value={car.model}
						onChange={(e) =>
							setCar({ ...car, model: e.target.value })
						}
						required
					/>
				</div>

				{/* Year, Price, Category */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					<InputField
						label="Year"
						type="number"
						placeholder="e.g. 2025"
						value={car.year}
						onChange={(e) =>
							setCar({ ...car, year: e.target.value })
						}
						required
					/>
					<InputField
						label={`Daily Price (${currency})`}
						type="number"
						placeholder="e.g. 100"
						value={car.pricePerDay}
						onChange={(e) =>
							setCar({ ...car, pricePerDay: e.target.value })
						}
						required
					/>
					<SelectField
						label="Category"
						value={car.category}
						onChange={(e) =>
							setCar({ ...car, category: e.target.value })
						}
						options={["Sedan", "SUV", "Van"]}
					/>
				</div>

				{/* Transmission, Fuel Type, Seating Capacity */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					<SelectField
						label="Transmission"
						value={car.transmission}
						onChange={(e) =>
							setCar({ ...car, transmission: e.target.value })
						}
						options={["Automatic", "Manual", "Semi-Automatic"]}
					/>
					<SelectField
						label="Fuel Type"
						value={car.fuel_type}
						onChange={(e) =>
							setCar({ ...car, fuel_type: e.target.value })
						}
						options={[
							"Gas",
							"Diesel",
							"Petrol",
							"Electric",
							"Hybrid",
						]}
					/>
					<InputField
						label="Seating Capacity"
						type="number"
						placeholder="e.g. 4"
						value={car.seating_capacity}
						onChange={(e) =>
							setCar({ ...car, seating_capacity: e.target.value })
						}
						required
					/>
				</div>

				{/* Location */}
				<SelectField
					label="Location"
					value={car.location}
					onChange={(e) =>
						setCar({ ...car, location: e.target.value })
					}
					options={[
						"Accra",
						"Kumasi",
						"Sunyani",
						"Tamale",
						"Bolgatanga",
					]}
				/>

				{/* Description */}
				<div className="flex flex-col w-full">
					<label>Description</label>
					<textarea
						rows={5}
						placeholder="Describe the car..."
						required
						className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
						value={car.description}
						onChange={(e) =>
							setCar({ ...car, description: e.target.value })
						}
					/>
				</div>

				{/* Submit Button */}
				<button
					className="flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer"
					disabled={isLoading}
				>
					<img src={assets.tick_icon} alt="submit" />
					{isLoading ? "Listing..." : "List Your Car"}
				</button>
			</form>
		</div>
	);
};

/* 🔹 Reusable InputField Component */
const InputField = ({ label, ...props }) => (
	<div className="flex flex-col w-full">
		<label>{label}</label>
		<input
			className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
			{...props}
		/>
	</div>
);

/* 🔹 Reusable SelectField Component */
const SelectField = ({ label, value, onChange, options }) => (
	<div className="flex flex-col w-full">
		<label>{label}</label>
		<select
			value={value}
			onChange={onChange}
			className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
		>
			<option value="">Select {label.toLowerCase()}</option>
			{options.map((option, idx) => (
				<option key={idx} value={option}>
					{option}
				</option>
			))}
		</select>
	</div>
);

export default AddCar;
