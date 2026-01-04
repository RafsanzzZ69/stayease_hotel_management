console.log("Starting seed script...");
import mongoose from "mongoose";
import dotenv from "dotenv";
import FoodService from "./models/FoodService.js";
import HousekeepingService from "./models/HousekeepingService.js";

dotenv.config();

// Connect to DB
mongoose
  .connect(process.env.mongo)
  .then(() => console.log("MongoDB connected for seeding..."))
  .catch((err) => console.error("DB connection error:", err));

// Seed function
const seedDatabase = async () => {
  try {
    console.log("Seeding started...");
    // Clear existing data
    await FoodService.deleteMany();
    await HousekeepingService.deleteMany();
    console.log("Existing collections cleared.");

    // Food Services
    const foodItems = [
      {
        name: "Cheeseburger",
        description: "Juicy beef patty with cheese, lettuce, and tomato",
        category: "Main Course",
        price: 8.99,
        imageUrl: "https://unsplash.com/photos/meat-and-cheese-burger-surrounded-by-sesame-seeds-_qxbJUr9RqI?utm_content=creditShareLink&utm_medium=referral&utm_source=unsplash",
      },
      {
        name: "Margherita Pizza",
        description: "Classic pizza with mozzarella, tomatoes, and basil",
        category: "Main Course",
        price: 12.5,
        imageUrl: "https://unsplash.com/photos/round-cooked-pizza-x00CzBt4Dfk",
      },
    //   {
    //     name: "Caesar Salad",
    //     description: "Crispy romaine lettuce with Caesar dressing",
    //     category: "Snacks",
    //     price: 7.0,
    //     imageUrl: "https://example.com/caesar.jpg",
    //   },
    //   {
    //     name: "Coke",
    //     description: "Refreshing Coca-Cola soft drink",
    //     category: "Drinks",
    //     price: 2.5,
    //     imageUrl: "https://example.com/coke.jpg",
    //   },
    //   {
    //     name: "Chocolate Cake",
    //     description: "Rich and moist chocolate cake slice",
    //     category: "Dessert",
    //     price: 5.0,
    //     imageUrl: "https://example.com/chocolate-cake.jpg",
    //   },
    ];

    await FoodService.insertMany(foodItems);
    console.log("FoodService collection seeded.");

    // Housekeeping Services
    const housekeepingItems = [
      {
        name: "Extra Towels",
        description: "Request additional towels for your room",
      },
      {
        name: "Room Cleaning",
        description: "Full cleaning of your room including bed and bathroom",
      },
      {
        name: "Laundry",
        description: "Clothes washing and ironing service",
      },
      {
        name: "Mini Bar Refill",
        description: "Refill minibar items in your room",
      },
    ];

    await HousekeepingService.insertMany(housekeepingItems);
    console.log("HousekeepingService collection seeded.");

    console.log("Seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
