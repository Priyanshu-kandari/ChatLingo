import { generateStreamToken } from '../lib/stream.js';

export const getStreamToken = async (req, res) => {
  try {
    // Issue a Stream auth token for the logged-in user.
    const token = generateStreamToken(req.user.id);
    res.status(200).json({ token });
  } catch (err) {
    console.error();
  }
};
