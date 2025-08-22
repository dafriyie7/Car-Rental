# Car Rental API

A backend API for a car rental application built with **Node.js**, **Express**, and **MongoDB**.  
This API manages user authentication, car listings, bookings, and owner dashboards.

---

## Features

- User registration and authentication (JWT-based).
- Role management (User ↔ Owner).
- Car management (add, delete, toggle availability, upload images).
- Booking system with date availability checks.
- Owner dashboard with booking and revenue insights.
- Secure API with authentication middleware.

---

## Tech Stack

- **Node.js** + **Express.js** – API framework  
- **MongoDB + Mongoose** – Database & ODM  
- **JWT** – Authentication  
- **bcrypt** – Password hashing  
- **Multer** – Image upload middleware  
- **CORS** – Cross-origin support  

---

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/dafriyie7/Car-Rental
   cd cd Car-Rental
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file:

   ```env
   PORT=4000

MONGO_URI=YOUR_MONGO_URI
IMAGEKIT_PUBLIC_KEY=YOUR_IMAGEKIT_PUBLIC_KEY
IMAGEKIT_PRIVATE_KEY=YOUR_IMAGEKIT_PRIVATE_KEY
IMAGEKIT_URL_ENDPOINT=YOUR_IMAGEKIT_URL_ENDPOINT
   ```

4. Start the server:

   ```bash
   npm start
   ```

Server will run at:  

```
http://localhost:7000
```

---

## API Routes

### User Routes (`/api/user`)

- `POST /register` → Register a new user  
- `POST /login` → Login user and return JWT  
- `GET /data` → Get user profile (requires JWT)  
- `GET /cars` → Get available cars  

### Owner Routes (`/api/owner`)

- `POST /change-role` → Upgrade user to owner  
- `POST /add-car` → Add a new car (with image upload)  
- `GET /cars` → Get cars listed by the owner  
- `POST /toggle-car` → Toggle car availability  
- `POST /delete-car` → Delete car  
- `GET /dashboard` → Get owner dashboard data  
- `POST /update-image` → Update owner profile image  

### Booking Routes (`/api/booking`)

- `POST /check-availability` → Check if a car is available in a date range  
- `POST /create` → Create a booking (requires JWT)  
- `GET /user` → Get bookings made by user  
- `GET /owner` → Get bookings for owner’s cars  
- `POST /change-status` → Owner updates booking status  

---

## Authentication

- JWT tokens are generated on login/registration.
- Add token in request headers as:

  ```http
  Authorization: <your_token>
  ```

---

## Project Structure

```
├── configs/
│   └── db.js             # Database connection
├── controllers/          # Controllers for user, owner, booking
├── middlewares/
│   ├── auth.js           # Authentication middleware
│   └── multer.js         # File upload handling
├── models/               # Mongoose models (User, Car, Booking)
├── routes/               # Route files
├── server.js             # App entry point
```

---

## Future Improvements

- Add payment gateway integration.
- Add unit & integration tests.
- Enhance role-based access control.
