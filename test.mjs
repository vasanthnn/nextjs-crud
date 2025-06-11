import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); 


import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Connection error:', err));
