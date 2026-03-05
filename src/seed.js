import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/product.js"; // adjust if your path differs

dotenv.config();

const products = [
  {
    name: "Halal Shawarma",
    price: 3500,
    description: "Delicious halal beef shawarma with fresh veggies",
    images: ["https://via.placeholder.com/300x200.png?text=Shawarma"],
    stock: 20,
  },
  {
    name: "Samsung Galaxy S24",
    price: 500000,
    description: "Latest Samsung flagship with premium features",
    images: ["https://via.placeholder.com/300x200.png?text=Galaxy+S24"],
    stock: 15,
  },
  {
    name: "Men’s Sneakers",
    price: 25000,
    description: "Comfortable sneakers for everyday wear",
    images: ["https://via.placeholder.com/300x200.png?text=Sneakers"],
    stock: 50,
  },
  {
    name: "Organic Honey",
    price: 8000,
    description: "100% pure organic honey from trusted farms",
    images: ["https://via.placeholder.com/300x200.png?text=Honey"],
    stock: 30,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected");

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("Seeding done");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seed();
