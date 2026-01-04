import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    number: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    accountType: {
      type: String,
      enum: ['guest', 'staff', 'admin'],
      default: 'guest',
    },
    country: {
      type: String,
      trim: true,
      
    },

// Optional fields for staff
    salary: {
      type: Number,
      
    },
    department: {
      type: String,
      enum: ["housekeeping", "reception", "kitchen", "security"],
      
    },
    departmentRole: {
    type: String,
    trim: true,
    
    // Example: "cleaning", "laundry", "chef", "waiter", "front desk"
  },
    floorNumber: { type: Number }, // Only meaningful if department = housekeeping

  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

const User = mongoose.model('User', userSchema);

export default User;
