import React, { useState } from "react";
import { assets, cityList } from "../assets/assets";
import { useAppContext } from "../context/appContext";
import { motion } from "motion/react";

// Framer Motion variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }, // children animate one after another
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");

  // Pull shared state & navigation function from context
  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } =
    useAppContext();

  // Handle form submit -> navigate with query params
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      pickupLocation,
      pickupDate,
      returnDate,
    });
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-screen flex flex-col items-center justify-center gap-14 bg-light text-center"
    >
      {/* Hero Heading */}
      <motion.h1
        variants={itemVariants}
        className="text-4xl md:text-5xl font-semibold"
      >
        Luxury Cars on Rent
      </motion.h1>

      {/* Search Form */}
      <motion.form
        variants={itemVariants}
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-[50rem] bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 md:ml-8">
          {/* Pickup Location */}
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="pickup-location" className="text-sm font-medium">
              Pickup Location
            </label>
            <select
              id="pickup-location"
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="border px-2 py-1 rounded-md text-sm"
            >
              <option value="">Select a location</option>
              {cityList.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <p className="px-1 text-sm text-gray-500">
              {pickupLocation
                && pickupLocation}
            </p>
          </div>

          {/* Pickup Date */}
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="pickup-date" className="text-sm font-medium">
              Pick-up Date
            </label>
            <input
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              type="date"
              id="pickup-date"
              min={new Date().toISOString().split("T")[0]} // cannot pick past date
              className="border px-2 py-1 rounded-md text-sm text-gray-500"
              required
            />
          </div>

          {/* Return Date */}
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="return-date" className="text-sm font-medium">
              Return Date
            </label>
            <input
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              type="date"
              id="return-date"
              min={pickupDate || new Date().toISOString().split("T")[0]} 
              // ensures return date is not before pickup date
              className="border px-2 py-1 rounded-md text-sm text-gray-500"
              required
            />
          </div>
        </div>

        {/* Search Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer"
        >
          <img
            src={assets.search_icon}
            alt="search"
            className="brightness-300 w-5 h-5"
          />
          Search
        </motion.button>
      </motion.form>

      {/* Hero Image */}
      <motion.img
        variants={itemVariants}
        src={assets.main_car}
        alt="car"
        className="max-h-[296px]"
      />
    </motion.div>
  );
};

export default Hero;
