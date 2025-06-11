import { connectDB } from '../../../lib/mongodb';
import Task from '../../../models/Task';


export async function GET() {
  await connectDB();
  const tasks = await Task.find();
  return Response.json(tasks);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const task = await Task.create(body);
  return Response.json(task, { status: 201 });
}
