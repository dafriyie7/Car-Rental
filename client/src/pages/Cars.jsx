// import React, { useEffect, useState } from "react";
// import Title from "../components/Title";
// import { assets } from "../assets/assets";
// import CarCard from "../components/CarCard";
// import { useSearchParams } from "react-router-dom";
// import { useAppContext } from "../context/appContext";
// import toast from "react-hot-toast";

// const Cars = () => {

// 	// getting search params from the url
// 	const [searchParams] = useSearchParams()
// 	const pickupLocation = searchParams.get('pickupLocation')
// 	const pickupDate = searchParams.get('pickupDate')
// 	const returnDate = searchParams.get('returnDate')

// 	const {cars, axios} = useAppContext()

// 	const [input, setInput] = useState();
// 	const [filteredCars, setFilteredCars] = useState([])

// 	const isSearchData = pickupLocation && pickupDate && returnDate

// 	const applyFilter = async () => {
// 		if (input === '') {
// 			setFilteredCars(cars)
// 			return null
// 		}
// 	}

// 	const searchCarAvailability = async () => {
// 		const { data } = await axios.post("/api/booking/check-availability", {
// 			location: pickupLocation,
// 			pickupDate,
// 			returnDate,
// 		});

// 		if (data.success) {
// 			setFilteredCars(data.availableCars)

// 			if (data.availableCars.length === 0) {
// 				toast.error('no cars available')
// 			}
// 			return null
// 		}
// 	}

// 	useEffect(() => {
// 		isSearchData && searchCarAvailability()
// 	}, [])

// 	useEffect(() => {
// 		cars.length > 0 && !isSearchData && applyFilter()
// 	},[input, cars])

// 	return (
// 		<div>
// 			<div className="flex flex-col items-center py-20 bg-light max-md:px-4">
// 				<Title
// 					title={"Available Cars"}
// 					subTitle={
// 						"Browse our selection of premium vehicles available for your next adventure"
// 					}
// 				/>

// 				<div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
// 					<img
// 						src={assets.search_icon}
// 						alt=""
// 						className="w-4 h-4 mr-2"
// 					/>
// 					<input
// 						onClick={(e) => setInput(e.target.value)}
// 						value={input}
// 						type="text"
// 						placeholder="search by make, model or features"
// 						className="w-full h-full outline-none text-gray-500"
// 					/>
// 					<img
// 						src={assets.filter_icon}
// 						alt=""
// 						className="w-4 h-4 ml-2"
// 					/>
// 				</div>
// 			</div>
//             <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
//                 <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">Showing {filteredCars.length} Cars</p>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
//                     {filteredCars.map((car, index) => (
//                         <div key={index}>
//                             <CarCard car={car} />
//                         </div>
//                     )) }
//                 </div>
//             </div>
// 		</div>
// 	);
// };

// export default Cars;

import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import toast from "react-hot-toast";

const Cars = () => {
	const [searchParams] = useSearchParams();
	const pickupLocation = searchParams.get("pickupLocation");
	const pickupDate = searchParams.get("pickupDate");
	const returnDate = searchParams.get("returnDate");

	const { cars, axios } = useAppContext();

	const [input, setInput] = useState("");
	const [filteredCars, setFilteredCars] = useState([]);

	const isSearchData = pickupLocation && pickupDate && returnDate;

	const applyFilter = () => {
		if (!input || input.trim() === "") {
			setFilteredCars(cars);
			return;
		}

		const lower = input.toLowerCase();

		const filtered = cars.slice().filter((car) => {
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

	useEffect(() => {
		if (isSearchData) {
			searchCarAvailability();
		}
	}, [pickupLocation, pickupDate, returnDate]);

	useEffect(() => {
		if (!isSearchData && cars.length > 0) {
			applyFilter();
		}
	}, [input, cars]);

	return (
		<div>
			<div className="flex flex-col items-center py-20 bg-light max-md:px-4">
				<Title
					title={"Available Cars"}
					subTitle={
						"Browse our selection of premium vehicles available for your next adventure"
					}
				/>

				<div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
					<img
						src={assets.search_icon}
						alt=""
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
						alt=""
						className="w-4 h-4 ml-2"
					/>
				</div>
			</div>

			<div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
				<p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
					Showing {filteredCars.length} Cars
				</p>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
					{filteredCars.map((car, index) => (
						<div key={index}>
							<CarCard car={car} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Cars;
