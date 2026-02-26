import jwt from 'jsonwebtoken';
import userModel from '../models/User.model.js';

export const protectRoute = async (req, res, next) => {
  try {
    // Read and verify JWT from cookies.
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token Provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
    }

    const user = await userModel.findById(decoded.userID).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized -  user not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log('error in protectRoute middleware', err);
  }
};
