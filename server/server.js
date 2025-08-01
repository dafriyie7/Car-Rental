import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// intialize express app
const app = express();

// connect database
await connectDB()

// middleware
app.use(cors());
app.use(express.json());

//routes
app.get("/", (req, res) => res.send("server is running"));
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/booking', bookingRouter)

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
