import mongoose from 'mongoose';

// Establish MongoDB connection for the backend.
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected Successfully');
  } catch (err) {
    console.log('Error connecting to DB', err);
    process.exit(1);
  }
};
