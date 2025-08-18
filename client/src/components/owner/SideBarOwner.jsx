import React, { useState } from "react";
import { assets, ownerMenuLinks } from "../../assets/assets";
import { NavLink, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/appContext";
import toast from "react-hot-toast";

const SideBarOwner = () => {
	// Extract user details, axios instance, and fetchUser function from global context
	const { user, axios, fetchUser } = useAppContext();

	// Current route location for highlighting active menu link
	const location = useLocation();

	// Local state for handling image file selected for upload
	const [image, setImage] = useState("");

	/**
	 * Handles updating user profile image.
	 * - Sends the selected image to backend API
	 * - On success, refreshes user data and shows success toast
	 * - On failure, shows error toast
	 */
	const updateImage = async () => {
		try {
			const formData = new FormData();
			formData.append("image", image);

			// Send image upload request to backend
			const { data } = await axios.post(
				"/api/owner/update-image",
				formData
			);

			if (data.success) {
				fetchUser(); // Refresh user info after successful update
				toast.success(data.message);
				setImage(""); // Reset selected image
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<div className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm">
			{/* Profile image section */}
			<div className="group relative">
				<label htmlFor="image">
					{/* Show selected image preview OR fallback to user profile image OR default placeholder */}
					<img
						className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"
						src={
							image
								? URL.createObjectURL(image)
								: user?.image ||
								  "https://images.unsplash.com/photo-1633332755192-727a05c4012d?q=80&w-300"
						}
						alt="Profile"
					/>
					{/* Hidden file input for image selection */}
					<input
						type="file"
						id="image"
						accept="image/*"
						hidden
						onChange={(e) => setImage(e.target.files[0])}
					/>

					{/* Hover overlay with edit icon */}
					<div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
						<img src={assets.edit_icon} alt="edit icon" />
					</div>
				</label>
			</div>

			{/* Save button appears only when a new image is selected */}
			{image && (
				<button
					className="absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer"
					onClick={updateImage}
				>
					Save{" "}
					<img src={assets.check_icon} width={13} alt="check icon" />
				</button>
			)}

			{/* Display user name (hidden on mobile) */}
			<p className="mt-2 text-base max-md:hidden">{user?.name}</p>

			{/* Sidebar navigation menu */}
			<div className="w-full">
				{ownerMenuLinks.map((link, index) => (
					<NavLink
						key={index}
						to={link.path}
						className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
							link.path === location.pathname
								? "bg-primary/10 text-primary"
								: "text-gray-600"
						}`}
					>
						{/* Show colored icon for active link, otherwise default icon */}
						<img
							src={
								link.path === location.pathname
									? link.coloredIcon
									: link.icon
							}
							alt="menu icon"
						/>
						<span className="max-md:hidden">{link.name}</span>

						{/* Highlight bar on the active link */}
						<div
							className={`${
								link.path === location.pathname && "bg-primary"
							} w-1.5 h-8 rounded-l right-0 absolute`}
						></div>
					</NavLink>
				))}
			</div>
		</div>
	);
};

export default SideBarOwner;
