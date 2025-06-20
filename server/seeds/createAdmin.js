const mongoose = require("mongoose");
const { User, Admin } = require("../models/User");
require("dotenv").config();

const createAdminUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/shkva",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );

    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: "admin@shkva.edu",
      role: "admin",
    });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      email: "admin@shkva.edu",
      password: "admin123", // This will be hashed automatically
      role: "admin",
      profile: {
        firstName: "System",
        lastName: "Administrator",
        phone: "+1234567890",
      },
    });

    await adminUser.save();

    // Create admin profile
    const adminProfile = new Admin({
      user: adminUser._id,
      adminId: "ADM001",
      permissions: [
        {
          module: "users",
          actions: ["create", "read", "update", "delete"],
        },
        {
          module: "students",
          actions: ["create", "read", "update", "delete"],
        },
        {
          module: "teachers",
          actions: ["create", "read", "update", "delete"],
        },
        {
          module: "reports",
          actions: ["read", "export"],
        },
      ],
    });

    await adminProfile.save();

    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@shkva.edu");
    console.log("Password: admin123");
    console.log("Role: admin");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

// Run the seeder
createAdminUser();
