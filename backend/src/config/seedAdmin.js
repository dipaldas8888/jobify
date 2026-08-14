import User from "../models/User.js";

export const seedAdmin = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@jobify.com").toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";
    const adminName = process.env.ADMIN_NAME || "Platform Administrator";

    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      // Create admin user (pre-save hook in User model hashes password)
      adminUser = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        isVerified: true,
      });
      console.log(`⚡ [Admin Seeder] Created initial admin user: ${adminEmail}`);
    } else {
      let needsSave = false;
      if (adminUser.role !== "admin") {
        adminUser.role = "admin";
        needsSave = true;
      }
      if (!adminUser.isVerified) {
        adminUser.isVerified = true;
        needsSave = true;
      }
      const isPasswordSame = await adminUser.matchPassword(adminPassword);
      if (!isPasswordSame) {
        adminUser.password = adminPassword; // pre-save hook will hash it
        needsSave = true;
      }
      if (needsSave) {
        await adminUser.save();
        console.log(`⚡ [Admin Seeder] Synced admin account settings for: ${adminEmail}`);
      }
    }
  } catch (error) {
    console.error(`⚠️ [Admin Seeder Error]: ${error.message}`);
  }
};
