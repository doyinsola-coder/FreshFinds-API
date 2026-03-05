import 'dotenv/config';
import dns from 'dns';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

// ensure DNS resolution works, same fix as in index.js
dns.setServers(['8.8.8.8', '8.8.4.4']);


async function Seller1() {
  const client = new MongoClient(process.env.MONGO_URL);

  try {
    await client.connect();
    const db = client.db(); 
    const users = db.collection('users');

    const sellerEmail = 'seller@marketplace1.com';
    const existingseller = await users.findOne({ emailAddress: sellerEmail });

    if (existingseller) {
      console.log("ℹ️ seller already exists. Skipping seeding.");
      return;
    }

    console.log("🚀 Creating admin user...");
    const passwordHash = await bcrypt.hash('SellerPassword121', 10);
    
    const sellerUser = {
      emailAddress: sellerEmail, 
      password: passwordHash,
      role: 'seller',
      isOnline: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await users.insertOne(sellerUser);
    console.log(`✅ Admin created! ID: ${result.insertedId}`);
    console.log(`👉 Login with: ${sellerEmail} / SellerPassword121`);

  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
  } finally {
    await client.close();
  }
}

Seller1();