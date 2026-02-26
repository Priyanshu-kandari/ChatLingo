import dotENV from 'dotenv';
import app from './src/app.js';
import { connectDB } from './src/lib/db.js';

// Load environment variables before bootstrapping the server.
dotENV.config();

const PORT = process.env.PORT;

// Start HTTP server and then connect to MongoDB.
app.listen(PORT, () => {
  console.log('app running at port', PORT);
  connectDB();
});
