import dbConnect from "@/lib/db";
import Submission from "@/models/Submission";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'Admin' && session.user.role !== 'Manager')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { content, type } = await req.json();
    
    await dbConnect();

    const submission = await Submission.findById(id);

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    submission.remarks.push({
      author: session.user.id,
      content,
      type
    });

    await submission.save();

    const updatedSubmission = await Submission.findById(id)
      .populate('labour', 'name employeeId');

    return NextResponse.json({ submission: updatedSubmission }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
