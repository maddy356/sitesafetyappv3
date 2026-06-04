import dbConnect from "@/lib/db";
import Submission from "@/models/Submission";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  
  let query = {};
  
  if (session.user.role === 'Labour') {
    query = { labour: session.user.id };
  } else if (session.user.role === 'Manager' || (session.user.role === 'Admin' && session.user.employeeId !== 'ADMIN001')) {
    // Regular Admin or Manager: Fetch their placeOfWork first
    const managerUser = await User.findById(session.user.id);
    if (managerUser && managerUser.placeOfWork) {
      // Find all users in the same placeOfWork
      const companyUsers = await User.find({ placeOfWork: managerUser.placeOfWork }).select('_id');
      const companyUserIds = companyUsers.map(u => u._id);
      query = { labour: { $in: companyUserIds } };
    } else {
      // If they have no placeOfWork assigned, show none to be safe
      query = { labour: null };
    }
  }
  // Super Admin (ADMIN001) sees all, so query remains {}
  
  const submissions = await Submission.find(query)
    .populate('labour', 'name employeeId placeOfWork')
    .sort({ createdAt: -1 });
    
  return NextResponse.json({ submissions });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'Labour' && session.user.role !== 'Admin')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();

    const newSubmission = await Submission.create({
      labour: session.user.id,
      formType: data.formType,
      formData: data.formData,
      status: 'Pending'
    });

    return NextResponse.json({ submission: newSubmission }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
