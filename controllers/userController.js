import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// dotenv.config();

const { JWT_SECRET } = process.env; // Ensure you have a JWT_SECRET in your environment variables

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' });
};

// Register User
export const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);
    res.cookie('token', token, { httpOnly: true });

    res.status(201).json({
      id: user.id,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Login User
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user.id);
      res.cookie('token', token, { httpOnly: true });

      res.json({
        id: user.id,
        username: user.username,
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Get Current User
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    res.json({
      id: user.id,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// Logout User
export const logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out' });
};
