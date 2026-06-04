import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const existingAdmin = await User.findOne({ employeeId: 'ADMIN001' });
    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Super Admin',
      placeOfWork: 'Headquarters',
      dateOfBirth: new Date('1980-01-01'),
      employeeId: 'ADMIN001',
      phoneNumber: '1234567890',
      role: 'Admin',
      password: hashedPassword
    });

    return NextResponse.json({ message: 'Admin seeded successfully', user: adminUser });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
