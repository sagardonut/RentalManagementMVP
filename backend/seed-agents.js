// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const User = require('./models/User.model');
// const Room = require('./models/Room.model');
// require('dotenv').config();

// const MONGO_URI = process.env.MONGO_URI;

// // Real agent data with professional photos
// const agentsData = [
//   {
//     fullName: "Arjun Shrestha",
//     email: "arjun@urbansanctuary.com",
//     phone: "+977 980-1234567",
//     role: "agent",
//     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
//     specialization: "Premium Properties & Penthouses",
//     experience: "12 years in luxury real estate",
//     bio: "Specializing in high-end apartments and penthouses in Kathmandu's most prestigious neighborhoods. Previously worked with major property developers in Nepal.",
//     languages: ["English", "Nepali", "Newari"],
//     isVerified: true
//   },
//   {
//     fullName: "Sita Thapa",
//     email: "sita@urbansanctuary.com",
//     phone: "+977 984-7654321",
//     role: "agent",
//     avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
//     specialization: "Residential & Family Homes",
//     experience: "8 years in residential leasing",
//     bio: "Expert in finding perfect family homes across Kathmandu. Known for excellent client relationships and extensive knowledge of schools and amenities nearby.",
//     languages: ["English", "Nepali", "Hindi"],
//     isVerified: true
//   },
//   {
//     fullName: "Raj Poudel",
//     email: "raj@urbansanctuary.com",
//     phone: "+977 981-2345678",
//     role: "agent",
//     avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
//     specialization: "Commercial & Investment Properties",
//     experience: "15 years in commercial real estate",
//     bio: "Former banker turned real estate expert. Helps clients find commercial spaces, investment properties, and lucrative rental opportunities in Kathmandu.",
//     languages: ["English", "Nepali"],
//     isVerified: true
//   },
//   {
//     fullName: "Maya Gurung",
//     email: "maya@urbansanctuary.com",
//     phone: "+977 982-3456789",
//     role: "agent",
//     avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
//     specialization: "Studios & Budget-Friendly Rentals",
//     experience: "5 years in student and young professional housing",
//     bio: "Passionate about helping students and young professionals find affordable, quality housing. Extensive network of budget-friendly apartments across Kathmandu.",
//     languages: ["English", "Nepali", "Gurung"],
//     isVerified: true
//   },
//   {
//     fullName: "Nirav Shrestha",
//     email: "nirav@urbansanctuary.com",
//     phone: "+977 985-4567890",
//     role: "agent",
//     avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
//     specialization: "Heritage Properties & Cultural Homes",
//     experience: "7 years in heritage property management",
//     bio: "Specializes in traditional Newari houses and heritage properties in Patan and Kathmandu. Deep knowledge of historical architecture and renovation projects.",
//     languages: ["English", "Nepali", "Newari"],
//     isVerified: true
//   },
//   {
//     fullName: "Anita Karki",
//     email: "anita@urbansanctuary.com",
//     phone: "+977 986-5678901",
//     role: "agent",
//     avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
//     specialization: "Expat & Diplomatic Housing",
//     experience: "6 years serving expat community",
//     bio: "Trusted advisor for expatriates and diplomats. Expert in international standards, quick move-ins, and properties meeting embassy requirements.",
//     languages: ["English", "Nepali", "Hindi"],
//     isVerified: true
//   }
// ];

// const seedAgents = async () => {
//   try {
//     console.log('🔌 Connecting to MongoDB Atlas...');
//     await mongoose.connect(MONGO_URI);
//     console.log('✅ Connected successfully.');

//     const passwordHash = await bcrypt.hash('password123', 10);

//     // Update existing agents and create new ones
//     console.log('👥 Seeding authentic agents...');

//     for (const agentData of agentsData) {
//       const existingAgent = await User.findOne({ email: agentData.email });

//       if (existingAgent) {
//         // Update existing agent with new data
//         await User.findByIdAndUpdate(existingAgent._id, {
//           fullName: agentData.fullName,
//           phone: agentData.phone,
//           avatar: agentData.avatar,
//           isActive: true,
//           status: 'verified',
//           // Store extra fields in a meta object or just add what we can
//           specialization: agentData.specialization
//         });
//         console.log(`   ✅ Updated: ${agentData.fullName}`);
//       } else {
//         // Create new agent
//         await User.create({
//           ...agentData,
//           password: passwordHash,
//           status: 'verified',
//           isActive: true
//         });
//         console.log(`   ✅ Created: ${agentData.fullName}`);
//       }
//     }

//     // Now reassign rooms to agents for better distribution
//     console.log('\n🏠 Linking rooms to agents...');

//     const agents = await User.find({ role: 'agent', isActive: true });
//     console.log(`   Found ${agents.length} active agents`);

//     // Get all rooms and reassign them
//     const rooms = await Room.find({});
//     const roomsPerAgent = Math.ceil(rooms.length / agents.length);

//     for (let i = 0; i < rooms.length; i++) {
//       const agentIndex = Math.floor(i / roomsPerAgent);
//       const agent = agents[agentIndex % agents.length];

//       await Room.findByIdAndUpdate(rooms[i]._id, { agentId: agent._id });
//       console.log(`   → "${rooms[i].title.substring(0, 40)}..." assigned to ${agent.fullName}`);
//     }

//     // Summary
//     console.log('\n📊 Final Summary:');
//     console.log(`   Total Agents: ${await User.countDocuments({ role: 'agent' })}`);
//     console.log(`   Total Rooms: ${await Room.countDocuments()}`);

//     console.log('\n👤 Agent Breakdown:');
//     for (const agent of agents) {
//       const roomCount = await Room.countDocuments({ agentId: agent._id });
//       console.log(`   - ${agent.fullName}: ${roomCount} rooms`);
//     }

//     console.log('\n✅ Agent seeding complete with authentic data and real photos!');
//     console.log('   Agent login: agent email + password "password123"');
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Seeding failed:', error.message);
//     process.exit(1);
//   }
// };

// seedAgents();