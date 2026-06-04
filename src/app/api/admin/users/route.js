import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'Admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  
  let query = {};
  if (session.user.employeeId !== 'ADMIN001') {
    // Regular Admin: only show their placeOfWork
    const currentAdmin = await User.findById(session.user.id);
    if (currentAdmin && currentAdmin.placeOfWork) {
      query = { placeOfWork: currentAdmin.placeOfWork };
    } else {
      query = { placeOfWork: null };
    }
  }

  const users = await User.find(query, '-password').sort({ createdAt: -1 });
  return NextResponse.json({ users });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'Admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();

    // Regular admins can only create users in their own company
    if (session.user.employeeId !== 'ADMIN001') {
      const currentAdmin = await User.findById(session.user.id);
      if (currentAdmin && currentAdmin.placeOfWork) {
        data.placeOfWork = currentAdmin.placeOfWork;
      }
    }

    // Auto-generate employee ID based on placeOfWork
    // e.g., "Acme Corp" -> "ACME-XXXX"
    const prefix = data.placeOfWork ? data.placeOfWork.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase() : 'EMP';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedEmployeeId = `${prefix}-${randomSuffix}`;
    
    // Default password to generated EmployeeID if not provided
    const rawPassword = data.password || generatedEmployeeId;
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newUser = await User.create({
      ...data,
      employeeId: generatedEmployeeId,
      password: hashedPassword,
      initialPassword: rawPassword
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    return NextResponse.json({ user: userObj }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
