// const Room = require("../models/rooms");

import Room from "../models/rooms.js";


// const RoomType = require("../models/roomtype");
import RoomType from "../models/roomtype.js";

import { io } from "../index.js";

// Create a new Room
export const createRoom = async (req, res) => {
  try {
    const { roomNumber, roomType, floor,  status } = req.body;

    // Check if RoomType exists
    const type = await RoomType.findById(roomType);
    if (!type) {
      return res.status(404).json({ message: "RoomType not found" });
    }

    // Check if room number exists
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: "Room number already exists" });
    }

    const newRoom = new Room({
      roomNumber,
      roomType: type._id,
      floor,
      
      
     
      status: status || "available"
    });

    await newRoom.save();
    io.emit("roomCreated", newRoom);
    res.status(201).json({ message: "Room created successfully", room: newRoom });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all rooms
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("roomType");
    res.status(200).json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};





