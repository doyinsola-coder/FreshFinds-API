import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

async function Admin2() {
  const client = new MongoClient(process.env.MONGO_URL);

  try {
    await client.connect();
    const db = client.db(); 
    const users = db.collection('users');

    const adminEmail = 'admin@marketplace2.com';
    const existingAdmin = await users.findOne({ emailAddress: adminEmail });

    if (existingAdmin) {
      console.log("ℹ️ Admin already exists. Skipping seeding.");
      return;
    }

    console.log("🚀 Creating admin user...");
    const passwordHash = await bcrypt.hash('AdminPassword122', 10);
    
    const adminUser = {
      emailAddress: adminEmail, 
      password: passwordHash,
      role: 'admin',
      isOnline: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await users.insertOne(adminUser);
    console.log(`✅ Admin created! ID: ${result.insertedId}`);
    console.log(`👉 Login with: ${adminEmail} / AdminPassword122`);

  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
  } finally {
    await client.close();
  }
}

Admin2();