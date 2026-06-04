import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sitesafetyapp';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  placeOfWork: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  employeeId: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Manager', 'Labour'], default: 'Labour' },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ employeeId: 'ADMIN001' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Super Admin',
      placeOfWork: 'Headquarters',
      dateOfBirth: new Date('1980-01-01'),
      employeeId: 'ADMIN001',
      phoneNumber: '1234567890',
      role: 'Admin',
      password: hashedPassword
    });

    console.log('Admin seeded successfully (ID: ADMIN001, Pass: admin123)');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
