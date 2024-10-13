import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const { JWT_SECRET } = process.env; // Ensure you have a JWT_SECRET in your environment variables

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' });
};

// Register User
export const register = async (req, res) => {
  const { username, password, email, phone_num } = req.body;

  console.log('Incoming request:', req.body); // Log the incoming request

  if (!username || !password || !email || !phone_num) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        phone_num
      },
    });

    const token = generateToken(user.id);
    res.cookie('token', token, { httpOnly: true });

    res.status(201).json({
      id: user.id,
      username: user.username,
    });
  } catch (error) {
    console.error('Error creating user:', error); // Log the error for debugging
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
      console.log(user);

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
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        auctions: true,
        teams: true,
        player: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      phone_num: user.phone_num,
      auctions: user.auctions,
      teams: user.teams,
      player: user.player,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Logout User
export const logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out' });
};
