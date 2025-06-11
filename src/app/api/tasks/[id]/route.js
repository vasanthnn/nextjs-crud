import { connectDB } from '../../../../lib/mongodb';
import Task from '../../../../models/Task';
import mongoose from 'mongoose';


export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const updatedTask = await Task.findByIdAndUpdate(params.id, body, { new: true });
  return Response.json(updatedTask);
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return new Response("Invalid ID", { status: 400 });
    }

    const deleted = await Task.findByIdAndDelete(params.id);

    if (!deleted) {
      return new Response("Task not found", { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("❌ DELETE error:", err.message);
    return new Response("Server error", { status: 500 });
  }
}

