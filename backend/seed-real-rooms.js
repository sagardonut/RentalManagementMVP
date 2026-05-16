const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.model');
const Room = require('./models/Room.model');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

// Real room data with Unsplash images (free, no API key needed)
const realRoomsData = [
  {
    title: "Spacious Modern Apartment in Lazimpat",
    description: "A beautifully renovated 2BHK apartment with modern finishes, large windows offering abundant natural light, and a stunning view of the city. Features a spacious living area, modern kitchen with appliances, and two comfortable bedrooms with attached bathrooms.",
    pricePerMonth: 65000,
    location: "Lazimpat, Kathmandu",
    type: "2 BHK",
    amenities: ["wifi", "ac_unit", "parking", "washing_machine", "balcony"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80"
    ],
    isVerified: true
  },
  {
    title: "Cozy Studio in Thamel with Rooftop Access",
    description: "Perfect for young professionals, this cozy studio apartment in the heart of Thamel comes with full furniture, high-speed internet, and access to a shared rooftop terrace. Walking distance to cafes, restaurants, and shopping areas.",
    pricePerMonth: 28000,
    location: "Thamel, Kathmandu",
    type: "Studio",
    amenities: ["wifi", "furnished", "security", "rooftop"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80"
    ],
    isVerified: true
  },
  {
    title: "Luxury Penthouse Suite in Naxal",
    description: "Experience premium living in this stunning penthouse featuring panoramic mountain views, premium wooden flooring, designer furniture, smart home features, and a private terrace. Includes dedicated parking and 24/7 security.",
    pricePerMonth: 120000,
    location: "Naxal, Kathmandu",
    type: "Penthouse",
    amenities: ["wifi", "ac_unit", "parking", "security", "balcony", "gym", "pool"],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80"
    ],
    isVerified: true
  },
  {
    title: "Family Home in Baneshwor with Garden",
    description: "A spacious 3BHK house perfect for families, featuring a large living room, fully equipped kitchen, three bedrooms, two bathrooms, and a beautiful private garden. Quiet residential area with easy access to schools and markets.",
    pricePerMonth: 55000,
    location: "Baneshwor, Kathmandu",
    type: "3 BHK",
    amenities: ["parking", "garden", "kitchen", "washing_machine", "balcony"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80"
    ],
    isVerified: true
  },
  {
    title: "Modern 1BHK in Jhamsikhel Near Golf Course",
    description: "Elegant one-bedroom apartment in the upscale Jhamsikhel area, close to the Royal Golf Course. Features contemporary design, modular kitchen, air conditioning, and underground parking. Perfect for working professionals.",
    pricePerMonth: 38000,
    location: "Jhamsikhel, Kathmandu",
    type: "1 BHK",
    amenities: ["wifi", "ac_unit", "parking", "gym", "security"],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80"
    ],
    isVerified: true
  },
  {
    title: "Executive Apartment in Baluwatar",
    description: "Premium executive apartment in the diplomatic enclave of Baluwatar. This fully furnished 2BHK offers premium amenities, high-end finishes, and is perfect for expatriates and diplomats. 24/7 security and concierge service.",
    pricePerMonth: 85000,
    location: "Baluwatar, Kathmandu",
    type: "2 BHK",
    amenities: ["wifi", "ac_unit", "parking", "security", "furnished", "gym", "concierge"],
    images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80"
    ],
    isVerified: true
  },
  {
    title: "Budget-Friendly Room in Koteshwor",
    description: "Affordable single room with basic amenities in Koteshwor. Ideal for students or young professionals on a budget. Walking distance to TU college, shopping malls, and public transportation.",
    pricePerMonth: 12000,
    location: "Koteshwor, Kathmandu",
    type: "Single Room",
    amenities: ["wifi", "shared_bathroom", "parking"],
    images: [
      "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80",
      "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=800&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80"
    ],
    isVerified: false
  },
  {
    title: "Heritage Style Room in Patan with Courtyard",
    description: "Unique accommodation in a traditional Newari house in Patan. Features original timber architecture, private courtyard, modern bathroom, and kitchenette. Perfect for those who appreciate cultural heritage.",
    pricePerMonth: 32000,
    location: "Patan, Kathmandu",
    type: "1 BHK",
    amenities: ["wifi", "kitchen", "courtyard", "cultural"],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&q=80"
    ],
    isVerified: true
  },
  {
    title: "Newly Renovated Apartment in Maharajgunj",
    description: "Freshly renovated 2BHK apartment near BPKIHS hospital. Features new furniture, modern kitchen, inverter backup, and private balcony. Ideal for medical professionals and families.",
    pricePerMonth: 42000,
    location: "Maharajgunj, Kathmandu",
    type: "2 BHK",
    amenities: ["wifi", "ac_unit", "parking", "inverter", "balcony"],
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
      "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80"
    ],
    isVerified: true
  },
  {
    title: "Minimalist Room in Samakhus with Mountain View",
    description: "Clean, minimalist room in Samakhus with stunning Himalayan views. Features large glass windows, modular furniture, and a productive workspace. High-speed fiber internet perfect for remote workers.",
    pricePerMonth: 25000,
    location: "Samakhus, Kathmandu",
    type: "Studio",
    amenities: ["wifi", "mountain_view", "workspace", "parking"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80"
    ],
    isVerified: true
  },
  {
    title: "Duplex Apartment in Kupondole",
    description: "Stunning duplex apartment with two levels in Kupondole. Ground floor has living room and kitchen, upper floor has two bedrooms. Modern finishes, solar backup, and prime location near Jawalakhel.",
    pricePerMonth: 58000,
    location: "Kupondole, Kathmandu",
    type: "2 BHK",
    amenities: ["wifi", "parking", "solar_backup", "balcony"],
    images: [
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&q=80",
      "https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=800&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&q=80"
    ],
    isVerified: true
  },
  {
    title: "Quiet Residential Room in Sinamangal",
    description: "Peaceful room in a quiet Sinamangal neighborhood. Ideal for students at nearby colleges. Basic amenities with option for meal plans. Easy access to airport and city center.",
    pricePerMonth: 15000,
    location: "Sinamangal, Kathmandu",
    type: "Single Room",
    amenities: ["wifi", "near_airport", "quiet"],
    images: [
      "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80"
    ],
    isVerified: false
  }
];

const seedRealData = async () => {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected successfully.');

    // Clear existing rooms only (keep users/admins)
    console.log('Clearing existing rooms...');
    await Room.deleteMany({});

    // Get or create agents
    let agents = await User.find({ role: 'agent' });
    let agentIds = agents.map(a => a._id);

    // If no agents, create some
    if (agentIds.length === 0) {
      console.log('Creating default agents...');
      const passwordHash = await bcrypt.hash('password123', 10);
      const newAgents = await User.insertMany([
        {
          fullName: "Arjun Shrestha",
          email: "arjun@urbansanctuary.com",
          password: passwordHash,
          phone: "+977 980-1234567",
          role: "agent",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
          specialization: "Senior Property Manager"
        },
        {
          fullName: "Sita Thapa",
          email: "sita@urbansanctuary.com",
          password: passwordHash,
          phone: "+977 984-7654321",
          role: "agent",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
          specialization: "Residential Specialist"
        },
        {
          fullName: "Raj Poudel",
          email: "raj@urbansanctuary.com",
          password: passwordHash,
          phone: "+977 981-2345678",
          role: "agent",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
          specialization: "Commercial Properties"
        }
      ]);
      agentIds = newAgents.map(a => a._id);
      console.log(`✅ ${newAgents.length} agents created.`);
    }

    // Add agent IDs to rooms
    const roomsWithAgents = realRoomsData.map((room, index) => ({
      ...room,
      agentId: agentIds[index % agentIds.length]
    }));

    // Insert all rooms
    console.log('🌱 Seeding real room data with Unsplash images...');
    await Room.insertMany(roomsWithAgents);
    console.log(`✅ ${roomsWithAgents.length} rooms created successfully!`);

    // Summary
    const totalRooms = await Room.countDocuments();
    console.log('\n📊 Database Summary:');
    console.log(`   - Total Rooms: ${totalRooms}`);
    console.log('\n🏠 Room Types Added:');
    const typeCounts = await Room.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);
    typeCounts.forEach(t => console.log(`   - ${t._id}: ${t.count}`));

    console.log('\n📍 Locations Added:');
    const locCounts = await Room.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } }
    ]);
    locCounts.forEach(l => console.log(`   - ${l._id}: ${l.count}`));

    console.log('\n✅ Seed complete! Your database now has real room data with real images from Unsplash.');
    console.log('   Images are sourced from Unsplash (free for commercial use).');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedRealData();