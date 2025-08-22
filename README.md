# Luxury Rent - Full Stack Car Rental Platform

A modern car rental platform with a **React frontend** and a **Node.js + Express backend**.  
The system allows users to book cars, track reservations, and enables owners to manage listings, availability, and bookings.

[Live Demo](https://car-rental-one-virid.vercel.app/)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)

---

## Features

### User

- Register and login with JWT authentication
- Browse available cars
- Book cars with rental details
- Manage and track booking history

### Owner

- Switch role to owner
- Add, update, and delete car listings
- Toggle car availability
- View dashboard statistics
- Manage customer bookings (approve, cancel, etc.)

### General

- Responsive UI built with TailwindCSS
- Smooth animations using Framer Motion
- Toast notifications for success and error handling
- REST API with role-based access

---

## Tech Stack

**Frontend (Client)**

- React (Vite)
- TailwindCSS
- Framer Motion
- React Context API
- Axios
- react-hot-toast

**Backend (Server)**

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt for password hashing
- Multer for file uploads
- CORS enabled

---

## Project Structure

luxury-rent/
│── client/ # React frontend
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── context/
│ │ ├── pages/
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
│
│── server/ # Node.js backend
│ ├── configs/
│ ├── controllers/
│ ├── middlewares/
│ ├── models/
│ ├── routes/
│ ├── server.js
│ └── package.json
│
└── README.md # Root documentation

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/dafriyie7/luxury-rent.git
cd luxury-rent

### 2. Setup the server

```bash
cd server
npm install
```

### 3. Create a .env file in the server folder

```bash
PORT=7000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Start the server

```bash
npm run dev
```

### 5. Setup the client

```bash
cd client
npm install
```

## Environment Variables

### 6. Create a .env file in the client folder

```bash
VITE_CURRENCY=USD
VITE_BASE_URL=http://localhost:7000
```

### 6. Start the client

```bash
npm run dev
```
