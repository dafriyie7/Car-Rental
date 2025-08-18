import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets, menuLinks } from "../assets/assets";
import { useState } from "react";
import { useAppContext } from "../context/appContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const Navbar = () => {
	const { setShowLogin, user, logout, isOwner, axios, setIsOwner } =
		useAppContext();

	const location = useLocation();
	const [open, setOpen] = useState(false); // Mobile menu toggle
	const navigate = useNavigate();

	// Switches user role to "owner"
	const changeRole = async () => {
		try {
			const { data } = await axios.post("api/owner/change-role");
			if (data.success) {
				setIsOwner(true);
				toast.success(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<motion.div
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor transition-all sticky top-0 z-50 bg-light"
		>
			{/* Logo */}
			<Link to="/">
				<motion.img
					whileHover={{ scale: 1.05 }}
					src={assets.logo}
					alt="logo"
					className="h-8"
				/>
			</Link>

			{/* Nav links and search bar */}
			<div
				className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50
					${location.pathname === "/" ? "bg-light" : "bg-white"}
					${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
			>
				{/* Dynamic menu links */}
				{menuLinks.map((link, index) => (
					<Link key={index} to={link.path}>
						{link.name}
					</Link>
				))}

				{/* Search bar (visible only on large screens) */}
				<div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
					<input
						type="text"
						className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
						placeholder="search products"
					/>
					<img src={assets.search_icon} alt="search" />
				</div>

				{/* Auth + Owner/Dashboard button group */}
				<div className="flex max-sm:flex-col items-start sm:items-center gap-6">
					{/* Owner / Dashboard toggle */}
					<button
						onClick={() =>
							isOwner ? navigate("/owner") : changeRole()
						}
						className="cursor-pointer"
					>
						{isOwner ? "Dashboard" : "List Cars"}
					</button>

					{/* Login / Logout button */}
					<button
						onClick={() => {
							user ? logout() : setShowLogin(true);
						}}
						className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
					>
						{user ? "Logout" : "Login"}
					</button>
				</div>
			</div>

			{/* Mobile menu toggle */}
			<button
				className="sm:hidden cursor-pointer"
				aria-label="menu"
				onClick={() => setOpen(!open)}
			>
				<img
					src={open ? assets.close_icon : assets.menu_icon}
					alt="menu"
				/>
			</button>
		</motion.div>
	);
};

export default Navbar;
