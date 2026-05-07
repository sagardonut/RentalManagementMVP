const mongoose = require('mongoose');
const User = require('./models/User.model');
const dotenv = require('dotenv');

dotenv.config();

const createSuperAdmin = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('❌ CRITICAL: MONGO_URI is not defined in environment variables.');
            process.exit(1);
        }
        
        console.log('🔌 Connecting to:', mongoUri.replace(/:([^@]+)@/, ':****@'));
        const conn = await mongoose.connect(mongoUri);
        console.log('✅ Connected to Atlas!');
        console.log('📁 Database:', conn.connection.name);

        const adminEmail = 'admin@example.com';
        const adminPassword = 'adminpassword123';

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('SuperAdmin already exists with email:', adminEmail);
            process.exit(0);
        }

        const admin = await User.create({
            fullName: 'Super Administrator',
            email: adminEmail,
            password: adminPassword,
            phone: '9841000000',
            role: 'superadmin'
        });

        console.log('SuperAdmin created successfully!');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating SuperAdmin:', error);
        process.exit(1);
    }
};

createSuperAdmin();
