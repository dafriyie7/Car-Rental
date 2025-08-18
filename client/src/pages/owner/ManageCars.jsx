import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import TitleOwner from "../../components/owner/TitleOwner";
import { useAppContext } from "../../context/appContext";
import toast from "react-hot-toast";

const ManageCars = () => {
	// Grab context values
	const { isOwner, axios, currency } = useAppContext();

	// Local state to hold cars
	const [cars, setCars] = useState([]);

	// Fetch all cars owned by the current owner
	const fetchOwnerCars = async () => {
		try {
			const { data } = await axios.get("/api/owner/cars");

			if (data.success) {
				setCars(data.cars);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	// Toggle car availability (Available <-> Unavailable)
	const toggleAvailability = async (carId) => {
		try {
			const { data } = await axios.post("/api/owner/toggle-car", {
				carId,
			});

			if (data.success) {
				toast.success(data.message);
				fetchOwnerCars(); // Refresh list after update
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	// Delete a car from the system
	const deleteCar = async (carId) => {
		try {
			const confirmDelete = window.confirm(
				"Are you sure you want to delete this car?"
			);
			if (!confirmDelete) return; // Exit if user cancels

			const { data } = await axios.post("/api/owner/delete-car", {
				carId,
			});

			if (data.success) {
				toast.success(data.message);
				fetchOwnerCars(); // Refresh list
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	// Fetch cars once the component mounts (and only if user is an owner)
	useEffect(() => {
		if (isOwner) fetchOwnerCars();
	}, [isOwner]);

	return (
		<div className="px-4 pt-10 md:px-10 w-full">
			<TitleOwner
				title="Manage Cars"
				subTitle="View all listed cars, update their details, or remove them from the booking platform."
			/>

			<div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
				<table className="w-full border-collapse text-left text-sm text-gray-600">
					<thead className="text-gray-500">
						<tr>
							<th className="p-3 font-medium">Car</th>
							<th className="p-3 font-medium max-md:hidden">
								Category
							</th>
							<th className="p-3 font-medium">Price</th>
							<th className="p-3 font-medium max-md:hidden">
								Status
							</th>
							<th className="p-3 font-medium">Actions</th>
						</tr>
					</thead>

					<tbody>
						{cars.map((car) => (
							<tr
								key={car._id}
								className="border-t border-borderColor"
							>
								{/* Car details */}
								<td className="p-3 flex items-center gap-3">
									<img
										src={car.image}
										alt={`${car.brand} ${car.model}`}
										className="h-12 w-12 aspect-square rounded-md object-cover"
									/>
									<div className="max-md:hidden">
										<p className="font-medium">
											{car.brand} {car.model}
										</p>
										<p className="text-xs text-gray-500">
											{car.seating_capacity} •{" "}
											{car.transmission}
										</p>
									</div>
								</td>

								{/* Car category */}
								<td className="p-3 max-md:hidden">
									{car.category}
								</td>

								{/* Car price */}
								<td className="p-3">
									{currency}{" "}
									{car.pricePerDay.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}{" "}
									/ day
								</td>

								{/* Availability status */}
								<td className="p-3 max-md:hidden">
									<span
										className={`px-3 py-1 rounded-full text-xs ${
											car.isAvailable
												? "bg-green-100 text-green-500"
												: "bg-red-100 text-red-500"
										}`}
									>
										{car.isAvailable
											? "Available"
											: "Unavailable"}
									</span>
								</td>

								{/* Actions (toggle availability + delete) */}
								<td className="flex items-center gap-3 p-3">
									<img
										src={
											car.isAvailable
												? assets.eye_close_icon
												: assets.eye_icon
										}
										alt="toggle availability"
										className="cursor-pointer"
										onClick={() =>
											toggleAvailability(car._id)
										}
									/>
									<img
										src={assets.delete_icon}
										alt="delete car"
										className="cursor-pointer"
										onClick={() => deleteCar(car._id)}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ManageCars;
