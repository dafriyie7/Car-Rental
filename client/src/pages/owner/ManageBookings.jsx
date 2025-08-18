import { useEffect, useState } from "react";
import TitleOwner from "../../components/owner/TitleOwner";
import { useAppContext } from "../../context/appContext";
import toast from "react-hot-toast";

const ManageBookings = () => {
	// Extract values from global context
	const { currency, axios, isOwner } = useAppContext();

	// Local state for all bookings
	const [bookings, setBookings] = useState([]);

	/**
	 * Fetch all bookings belonging to the current owner
	 */
	const fetchOwnerBookings = async () => {
		try {
			const { data } = await axios.get("/api/booking/owner");
			if (data.success) {
				setBookings(data.bookings);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	/**
	 * Change booking status (pending → confirmed/cancelled)
	 * @param {string} bookingId - The ID of the booking
	 * @param {string} status - New status for the booking
	 */
	const changeBookingStatus = async (bookingId, status) => {
		try {
			const { data } = await axios.post("/api/booking/change-status", {
				bookingId,
				status,
			});

			if (data.success) {
				toast.success(data.message);
				fetchOwnerBookings(); // Refresh bookings after status change
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	// Load bookings once when component mounts
	useEffect(() => {
		if (isOwner) {
			fetchOwnerBookings();
		}
	}, [isOwner]);

	return (
		<div className="px-4 pt-10 md:px-10 w-full">
			{/* Page Header */}
			<TitleOwner
				title={"Manage Bookings"}
				subTitle={
					"Track all customer bookings, approve or cancel requests, and manage booking statuses."
				}
			/>

			{/* Bookings Table */}
			<div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
				<table className="w-full border-collapse text-left text-sm text-gray-600">
					{/* Table Head */}
					<thead className="text-gray-500">
						<tr>
							<th className="p-3 font-medium">Car</th>
							<th className="p-3 font-medium max-md:hidden">
								Date Range
							</th>
							<th className="p-3 font-medium">Total</th>
							<th className="p-3 font-medium max-md:hidden">
								Payment
							</th>
							<th className="p-3 font-medium">Actions</th>
						</tr>
					</thead>

					{/* Table Body */}
					<tbody>
						{bookings.map((booking, index) => (
							<tr
								key={index}
								className="border-t border-borderColor text-gray-500"
							>
								{/* Car Info */}
								<td className="p-3 flex items-center gap-3">
									<img
										src={booking.car.image}
										alt={`${booking.car.brand} ${booking.car.model}`}
										className="h-12 w-12 aspect-square rounded-md object-cover"
									/>
									<p className="font-medium max-md:hidden">
										{booking.car.brand} {booking.car.model}
									</p>
								</td>

								{/* Date Range */}
								<td className="p-3 max-md:hidden">
									{booking.pickupDate.split("T")[0]} to{" "}
									{booking.returnDate.split("T")[0]}
								</td>

								{/* Total Price */}
								<td className="p-3">
									{currency}{" "}
									{booking.price.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</td>

								{/* Payment Method */}
								<td className="p-3 max-md:hidden">
									<span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
										Offline
									</span>
								</td>

								{/* Booking Actions */}
								<td className="p-3">
									{booking.status === "pending" ? (
										<select
											onChange={(e) =>
												changeBookingStatus(
													booking._id,
													e.target.value
												)
											}
											value={booking.status}
											className="px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none"
										>
											<option value="pending">
												Pending
											</option>
											<option value="cancelled">
												Cancelled
											</option>
											<option value="confirmed">
												Confirmed
											</option>
										</select>
									) : (
										<span
											className={`px-3 py-1 rounded-full text-xs font-semibold ${
												booking.status === "confirmed"
													? "bg-green-100 text-green-500"
													: "bg-red-100 text-red-500"
											}`}
										>
											{booking.status}
										</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ManageBookings;
