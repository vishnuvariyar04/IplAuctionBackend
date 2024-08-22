import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// import dotenv from 'dotenv';

// dotenv.config();

const { JWT_SECRET } = process.env; // Ensure you have a JWT_SECRET in your environment variables

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });
      if (!req.user) {
        return res.status(401).json({ message: 'User not found, authorization denied' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
  };
  
export default authMiddleware;
