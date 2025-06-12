import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String, 
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
