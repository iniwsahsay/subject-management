// Run this script once to create test users in MongoDB.
// Usage: npx ts-node src/scripts/seedUsers.ts
//
// This creates:
//   Tenant:  "Springfield University"  (tenant_id: "tenant-001")
//   User 1:  admin@example.com / Secret@123  → role: ADMIN, all permissions
//   User 2:  user@example.com  / Secret@123  → role: USER,  SUBJECT_READ only

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import Tenant from "../models/Tenant";
import User from "../models/User";

async function seed(): Promise<void> {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI not set in .env");

    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Create tenant
    const tenantId = "tenant-001";
    await Tenant.deleteMany({ tenant_id: tenantId });
    await Tenant.create({
        tenant_id: tenantId,
        name: "Springfield University",
        isActive: true
    });
    console.log("Tenant created: tenant-001");

    // Hash password — bcrypt adds a random salt automatically
    const hashedPassword = await bcrypt.hash("Secret@123", 10);

    // Remove existing test users
    await User.deleteMany({ email: { $in: ["admin@example.com", "user@example.com"] } });

    // ADMIN user — has all four permissions
    await User.create({
        user_id: uuidv4(),
        tenant_id: tenantId,
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        roles: ["ADMIN"],
        permissions: ["SUBJECT_CREATE", "SUBJECT_READ", "SUBJECT_UPDATE", "SUBJECT_DELETE"],
        isActive: true
    });
    console.log("Admin user created: admin@example.com");

    // USER — read-only
    await User.create({
        user_id: uuidv4(),
        tenant_id: tenantId,
        username: "user",
        email: "user@example.com",
        password: hashedPassword,
        roles: ["USER"],
        permissions: ["SUBJECT_READ"],
        isActive: true
    });
    console.log("Regular user created: user@example.com");

    await mongoose.disconnect();
    console.log("Done. You can now test login with these credentials.");
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
