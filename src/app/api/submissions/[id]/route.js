import dbConnect from "@/lib/db";
import Submission from "@/models/Submission";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'Admin' && session.user.role !== 'Manager')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { status } = await req.json();
    
    await dbConnect();

    const submission = await Submission.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('labour', 'name employeeId');

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json({ submission });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
