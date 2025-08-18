import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import TitleOwner from "../../components/owner/TitleOwner";
import { useAppContext } from "../../context/appContext";
import toast from "react-hot-toast";

const DashboardOwner = () => {
	const { axios, isOwner, currency } = useAppContext();

	// Dashboard state
	const [data, setData] = useState({
		totalCars: 0,
		totalBookings: 0,
		pendingBookings: 0,
		completedBookings: 0,
		recentBookings: [],
		monthlyRevenue: 0,
	});

	// Fetch dashboard data from backend
	const fetchDashboardData = async () => {
		try {
			const { data } = await axios.get("/api/owner/dashboard");

			if (data.success) {
				setData(data.dashboardData);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	// Dashboard summary cards
	const DashboardCards = [
		{
			title: "Total Cars",
			value: data.totalCars,
			icon: assets.carIconColored,
		},
		{
			title: "Total Bookings",
			value: data.totalBookings,
			icon: assets.listIconColored,
		},
		{
			title: "Pending",
			value: data.pendingBookings,
			icon: assets.cautionIconColored,
		},
		{
			title: "Confirmed",
			value: data.completedBookings,
			icon: assets.listIconColored,
		},
	];

	// Load data when user is confirmed as owner
	useEffect(() => {
		if (isOwner) {
			fetchDashboardData();
		}
	}, [isOwner]);

	return (
		<div className="px-4 pt-10 md:px-10 flex-1">
			{/* Page Title */}
			<TitleOwner
				title="Admin Dashboard"
				subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities."
			/>

			{/* Dashboard Summary Cards */}
			<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl">
				{DashboardCards.map((card, index) => (
					<div
						key={index}
						className="flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor"
					>
						<div>
							<h1 className="text-xs text-gray-500">
								{card.title}
							</h1>
							<p className="text-lg font-semibold">
								{card.value}
							</p>
						</div>

						<div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
							<img
								src={card.icon}
								alt={`${card.title}-icon`}
								className="w-4 h-4"
							/>
						</div>
					</div>
				))}
			</div>

			<div className="flex flex-wrap items-start gap-6 mb-8 w-full">
				{/* Recent Bookings Section */}
				<div className="p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full">
					<h1 className="text-lg font-medium">Recent Bookings</h1>
					<p className="text-gray-500">Latest customer bookings</p>

					{data.recentBookings.length > 0 ? (
						data.recentBookings.map((booking, index) => (
							<div
								key={index}
								className="mt-4 flex items-center justify-between"
							>
								<div className="flex items-center gap-2">
									{/* Icon */}
									<div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
										<img
											src={assets.listIconColored}
											alt="booking-icon"
											className="h-5 w-5"
										/>
									</div>

									{/* Booking Info */}
									<div>
										<p>
											{booking.car.brand}{" "}
											{booking.car.model}
										</p>
										<p className="text-sm text-gray-500">
											{booking.createdAt.split("T")[0]}
										</p>
									</div>
								</div>

								{/* Price + Status */}
								<div className="flex items-center gap-2 font-medium">
									<p className="text-sm text-gray-500">
										{currency}{" "}
										{booking.price.toLocaleString(
											undefined,
											{
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											}
										)}
									</p>
									<p className="px-3 py-0.5 border border-borderColor rounded-full text-sm">
										{booking.status}
									</p>
								</div>
							</div>
						))
					) : (
						<p className="text-gray-400 mt-4">No recent bookings</p>
					)}
				</div>

				{/* Monthly Revenue Section */}
				<div className="p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs">
					<h1 className="text-lg font-medium">Monthly Revenue</h1>
					<p className="text-gray-500">Revenue for current month</p>
					<p className="text-3xl mt-6 font-semibold text-primary">
						{currency}
						{data.monthlyRevenue.toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</p>
				</div>
			</div>
		</div>
	);
};

export default DashboardOwner;
