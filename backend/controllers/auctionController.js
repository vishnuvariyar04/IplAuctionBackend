import {WebSocketServer} from 'ws';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createAuction = async (req, res) => {
  const { name, description, start_time, bid_duration, max_teams, players_per_team, bid_increment } = req.body;
  const auctioneerId = req.user?.id;

  if (!auctioneerId) {
    return res.status(401).json({ error: 'Unauthorized: User ID not found' });
  }

  try {
    console.log('Received auction data:', req.body);
    console.log('Received file:', req.file);

    let rules_file = '';
    if (req.file) {
      console.log('File received:', req.file);
      rules_file = req.file.filename; // or the URL where the file is stored
    }

    const newAuction = await prisma.auction.create({
      data: {
        name,
        description,
        rules_file,
        start_time: new Date(start_time),
        bid_duration: parseInt(bid_duration),
        max_teams: parseInt(max_teams),
        players_per_team: parseInt(players_per_team),
        bid_increment: parseInt(bid_increment),
        auctioneerId,
      },
    });
    console.log('Created auction:', newAuction);
    res.status(201).json(newAuction);
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

export const getAuctions = async (req, res) => {
  try {
    console.log('Fetching auctions from database...');
    const auctions = await prisma.auction.findMany();
    console.log('Auctions fetched:', auctions);
    res.status(200).json(auctions);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

export const getAuction = async (req, res) => {
  const { id } = req.params;

  try {
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: { teams: true, players: true },
    });

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    res.json({
      id: auction.id,
      name: auction.name,
      teams: auction.teams,
      players: auction.players,
    });
  } catch (error) {
    console.error('Error fetching auction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateAuction = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  

  try {
    const updatedAuction = await prisma.auction.update({
      where: { id },
      data: { name },
    });

    res.status(200).json(updatedAuction);
  } catch (error) {
    console.error('Error updating auction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteAuction = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.auction.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting auction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




