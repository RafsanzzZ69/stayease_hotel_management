import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import http from "http";
import { Server } from "socket.io";
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import roomTypeRoutes from './routes/roomTypeRoutes.js'; 
import roomRoutes from './routes/roomRoutes.js'; // Assuming you have this route

import bookingRoutes from "./routes/bookingRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import serviceRequestRoutes from "./routes/serviceRequestRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";

dotenv.config();

import staffRouter from "./routes/staffRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
//AI handler 
import aiRoutes from "./routes/aiRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
console.log("GOOGLE_GEMINI_API_KEY =", process.env.GOOGLE_GEMINI_API_KEY ? "FOUNDyes" : "MISSING");
console.log("STRIPE_SECRET_KEY =", process.env.STRIPE_SECRET_KEY ? "FOUNDyes" : "MISSING");
console.log("STRIPE_PUBLISHABLE_KEY =", process.env.STRIPE_PUBLISHABLE_KEY ? "FOUNDyes" : "MISSING");




const app = express();
const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend vite URL
    methods: ["GET", "POST", "PATCH"]
  },
});

// ✅ Make io available globally (import in routes)
export { io };

// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.mongo);
    console.log('Database connected successfullyyy');
  } catch (error) {
    throw new Error('Database connection failed');
  }
};
mongoose.connection.on('disconnected', () => {
  console.log('Database disconnected');
});
mongoose.connection.on('connected', () => {
  console.log('Database connected');
});

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Welcome to StayEase');
});

//middleware to parse JSON

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roomtypes', roomTypeRoutes);
app.use('/api/rooms', roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/ratings", ratingRoutes);
app.use('/api/staff', staffRouter); // Use the staff router for all the managements 
app.use('/api/admin', adminRouter); // Use the admin router for admin tasks
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payment", paymentRoutes);

// ✅ Socket.IO connection
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);
  // Listen for client to register user
  socket.on("registerUser", ({ userId }) => {
    if (userId) {
      socket.join(userId); // personal room
      console.log(`User ${userId} joined personal room`);
    }
    
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ✅ Start server (with http server, not app)
server.listen(3000, () => {
  connect();
  console.log("Server is running on port 3000 and is using socket.io");
});
// Start the server
// app.listen(3000, () => {
//     connect();
//   console.log('Server is running on port 3000  ');
// });
// app._router.stack.forEach(r => {
//   if (r.route) {
//     console.log(r.route.path);
//   }
// });




