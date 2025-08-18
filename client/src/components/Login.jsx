import { useState } from "react";
import { useAppContext } from "../context/appContext";
import toast from "react-hot-toast";

const Login = () => {
	const { setShowLogin, axios, setToken, navigate } = useAppContext();

	// Auth state (login or register)
	const [state, setState] = useState("login");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// Handles login/signup form submit
	const onSubmitHandler = async (event) => {
		event.preventDefault();

		try {
			// Different payload depending on state
			const payload =
				state === "login"
					? { email, password }
					: { name, email, password };

			// API call
			const { data } = await axios.post(`/api/user/${state}`, payload);

			// Success flow
			setToken(data.token);
			localStorage.setItem("token", data.token);
			setShowLogin(false);
			navigate("/");
		} catch (error) {
			// Error handling
			const message = error.response?.data?.message || error.message;
			toast.error(message);
		}
	};

	return (
		// Overlay background (click to close)
		<div
			onClick={() => setShowLogin(false)}
			className="fixed inset-0 z-100 flex items-center bg-black/50 text-sm text-gray-600"
		>
			{/* Auth form (stop propagation to prevent closing) */}
			<form
				onClick={(e) => e.stopPropagation()}
				onSubmit={onSubmitHandler}
				className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
			>
				{/* Heading */}
				<p className="text-2xl font-medium m-auto">
					<span className="text-primary">User</span>{" "}
					{state === "login" ? "Login" : "Sign Up"}
				</p>

				{/* Name (only for register) */}
				{state === "register" && (
					<div className="w-full">
						<label className="block mb-1">Name</label>
						<input
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Type here"
							className="border border-gray-200 rounded w-full p-2 outline-primary"
							type="text"
							required
						/>
					</div>
				)}

				{/* Email */}
				<div className="w-full">
					<label className="block mb-1">Email</label>
					<input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Type here"
						className="border border-gray-200 rounded w-full p-2 outline-primary"
						type="email"
						required
					/>
				</div>

				{/* Password */}
				<div className="w-full">
					<label className="block mb-1">Password</label>
					<input
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Type here"
						className="border border-gray-200 rounded w-full p-2 outline-primary"
						type="password"
						required
					/>
				</div>

				{/* Toggle between login/register */}
				{state === "register" ? (
					<p>
						Already have an account?{" "}
						<span
							onClick={() => setState("login")}
							className="text-primary cursor-pointer"
						>
							Click here
						</span>
					</p>
				) : (
					<p>
						Don’t have an account?{" "}
						<span
							onClick={() => setState("register")}
							className="text-primary cursor-pointer"
						>
							Click here
						</span>
					</p>
				)}

				{/* Submit button */}
				<button className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
					{state === "register" ? "Create Account" : "Login"}
				</button>
			</form>
		</div>
	);
};

export default Login;
