# Luxury Rent - Car Rental Platform

A modern car rental platform built with **React, TailwindCSS, Context API, and Framer Motion**, enabling users to book cars, manage their reservations, and allowing owners to manage listings and booking statuses.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Author](#author)
- [License](#license)

## Features

- User Bookings Dashboard  
  - View active and past bookings  
  - Track rental period, pickup location, and total cost  
  - Booking statuses: pending, confirmed, cancelled  

- Owner Bookings Management  
  - Approve or cancel requests  
  - Change booking status directly via dashboard  

- Modern UI/UX  
  - Smooth animations with Framer Motion  
  - Responsive layout using TailwindCSS  
  - Clean and minimalistic design  

- Notifications  
  - Instant success/error feedback using react-hot-toast  

- Reusable Components  
  - Shared UI elements like Title, TitleOwner, etc.  

## Tech Stack

- Frontend: React (with Vite)  
- Styling: TailwindCSS  
- Animations: Framer Motion  
- State Management: React Context API (useAppContext)  
- Notifications: react-hot-toast  
- HTTP Client: Axios  
- Backend API (assumed): Node.js + Express  

## Project Structure

```
src/
│── assets/              # Images, icons, dummy data
│── components/          # Reusable components
│   ├── Title.jsx
│   ├── owner/TitleOwner.jsx
│── context/             # Global app context
│   ├── appContext.js
│── pages/
│   ├── Banner.jsx         # Landing banner section
│   ├── MyBookings.jsx     # User bookings page
│   ├── ManageBookings.jsx # Owner bookings management
│── App.jsx                # Root component
│── main.jsx               # Entry point
```

## Core Components

### Banner (Banner.jsx)

- Landing hero section with gradient background
- Animated heading & image
- Call-to-action button for listing a car

### MyBookings (MyBookings.jsx)

- Fetches and displays user bookings
- Shows car details, rental period, and total price
- Status badges (confirmed / cancelled)
- Motion-animated booking cards

### ManageBookings (ManageBookings.jsx)

- Dashboard for owners to track customer bookings
- Update booking status via dropdown
- Displays booking details in a table view

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/luxury-rent.git
cd luxury-rent
```

### 2. Install Dependencies

```bash
npm install
```

### 3. add a .env file

```bash
VITE_CURRENCY=YOUR_VITE_CURRENCY
VITE_BASE_URL=YOUR_BACKEND_PORT
```

### 3. Start the Development Server

```bash
npm run dev
```

The app will be available at <http://localhost:5173>

## Configuration

- Update `appContext.js` with your backend API base URL
- Ensure backend is running before testing booking features

## Author

Developed by Dan

## License

This project is licensed under the MIT License.
