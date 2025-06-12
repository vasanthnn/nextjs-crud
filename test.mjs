import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected"))
  .catch(err => console.error("❌ Failed:", err));
