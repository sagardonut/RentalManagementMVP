const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.model');
const Room = require('./models/Room.model');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ ERROR: MONGO_URI is not defined in .env');
  process.exit(1);
}

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB Atlas for seeding...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected successfully.');

    // Clear existing data
    console.log('Clearing existing rooms and agents...');
    await Room.deleteMany({});
    await User.deleteMany({ role: { $in: ['agent', 'superadmin'] } });

    // 1. Create SuperAdmin
    console.log('Creating SuperAdmin...');
    const superAdmin = await User.create({
      fullName: "System Admin",
      email: "admin@urbansanctuary.com",
      password: "password123", // Pre-save hook hashes this
      phone: "+977 984-0000000",
      role: "superadmin"
    });
    console.log('✅ SuperAdmin created.');

    // 2. Create Agents
    console.log('Creating Agents...');
    const passwordHash = await bcrypt.hash('password123', 10);
    const agents = await User.insertMany([
      {
        fullName: "Arjun Shrestha",
        email: "arjun@urbansanctuary.com",
        password: passwordHash,
        phone: "+977 980-1234567",
        role: "agent",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMLqNAq9bWo-r4khyOHdNQRZamrFAjbWXzeq3GKUHFMsEaRkieMB3HBkW8ibpXNS8c6Lo11xudIr_CWnoFF4reTrEaJR_VMborHC9Tc96aBJDvCo7t55Ky5JLQlELzu2CIVOr2x9n69mhEF3KpsGGWw8LyKACVFXY20jZWzH40PLi5MVSBzzth5Dg6ZFQIPkNiSBv5mWqAyKd9vzFX1akvmFdB8lmh2tr4PN8O2VoJwjvgczjPuqN_fD83s4o30gr6wvsYHiOneNCA",
        specialization: "Senior Property Manager"
      },
      {
        fullName: "Sita Thapa",
        email: "sita@urbansanctuary.com",
        password: passwordHash,
        phone: "+977 984-7654321",
        role: "agent",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIDoeqpAeKABELZofIRm-GyFTlPqTruFYqJbaNlG_59mNnt1zybFQNBXETPKp6L5aQWb6gqvh0xDvswN9UVUyiBNbFplcY_S1LrdhChBqs9vAkEqGgjfpRT_TZVA1gWV6y9mmwRpkNJX2GjsKhAixFxCcZLHT4hK6qquV78I4X8L0ZkqrL1cnP3k6e-9WoFyea93WPtCvbE0zJN6SGQrOQJjcp4jVmyOqrGYnpIAjEC63HthAZ6vOLvteO14bvyNtZGrBac6LFU5xN",
        specialization: "Residential Specialist"
      }
    ]);
    console.log(`✅ ${agents.length} agents created.`);

    // 3. Create Rooms
    console.log('Creating Rooms...');
    await Room.insertMany([
      {
        title: "Modern Studio in Naxal",
        description: "Modern minimalist studio apartment in Naxal with large window and city view.",
        pricePerMonth: 35000,
        location: "Naxal, Kathmandu",
        type: "Studio",
        agentId: agents[0]._id,
        amenities: ["wifi", "ac_unit", "local_parking"],
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuA4VEIDfc8LX1ctDwfXFeeBViGvO0pJwMnURZieV7RTLbSqsBvGCN1DGFnRAyYBUj2986mO5twKg_IPRPNFRNA9FAjfPS41yjTEbgSB5HAOzXECCFCx_ecvPdO1bQ5OLkAFMROl9Im3a0RvzH_CWcQ6rOeqFBZDm2_svsSc2D-aTBgxPABOHHFkyW0iJrUWAlPNU2QeIPbQQfNDHFmzgNl6D3mnfF3lvKf-G_6XkLa7mhx9H8xHTeaoJqKvlmGx7tp6z3k_uiTJL6JC"],
        isVerified: true
      },
      {
        title: "Chic 1BHK Baneshwor",
        description: "Airy sunlit bedroom with wooden floors and Himalayan decor in Baneshwor.",
        pricePerMonth: 22000,
        location: "New Baneshwor, Kathmandu",
        type: "1 BHK",
        agentId: agents[0]._id,
        amenities: ["wifi", "kitchen"],
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuA8jVkZFg7Mqtdh59UcCsrMKE4q1jOWs4RsUZTfDfbtYKmHQ72MwE4zZYBpvpGgVrJr8owr8N6N9Zdlh4tRpyWamw0a4dtFz00I0JNTujeHQ0CxyetC8PJbNPMqDduGgThEYSm_ESYWqz4QTXd2ERL9Myer4t6G0NrEQwN3zYMI3u29_aZhN7P2j9e-n6RuCoddk3vbJEz2Xb2847mxN5oyZ6gRtYUwMJBy8OtAzppAYA4Dw03vdFuw3McmdkPFmiYd3cNoUwb-2DZX"],
        isVerified: false
      },
      {
        title: "Lazimpat Penthouse",
        description: "Luxury penthouse living room with mountain views in Lazimpat.",
        pricePerMonth: 85000,
        location: "Lazimpat, Kathmandu",
        type: "Penthouse",
        agentId: agents[1]._id,
        amenities: ["pool", "ac_unit", "wifi"],
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBtD-1zr6YoUO91nf5R6vQ5p_dE1y9SYpAKzoGB1_YIVhbCRTxHOSfcawA_fUmBysdeOT07pKbdXnc8DZpKVlRrlJOT7NEWX_6xUMpyhCjwKYmyRX6p-IJ1f8eM-prCJ8Rc4QtL6Y8flCcprtk3NEvzMXjXZXDQNoZ0WGbeszF4m9ezh_fZidEdPIx6AyJ-juM97c0luviTSw1hrdw-3m5FBiwm-zHVab-kPbAnAlK7OgMXUtY7mMkx5G_g_oLH8wLGcXJRYzPJzp-T"],
        isVerified: true
      }
    ]);
    console.log('✅ Rooms seeded successfully.');

    console.log('🚀 Seeding complete! Database is ready.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
