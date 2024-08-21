import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createPlayer = async (req, res) => {
  const { name, age, nationality, type, runs, wickets, price } = req.body;

  try {
    const newPlayer = await prisma.player.create({
      data: {
        name,
        age,
        nationality,
        type,
        runs,
        wickets,
        price,
      },
    });
    res.status(201).json(newPlayer);
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getPlayers = async (req, res) => {
  try {
    const players = await prisma.player.findMany();
    res.status(200).json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getPlayer = async (req, res) => {
  const { id } = req.params;

  try {
    const player = await prisma.player.findUnique({
      where: { id },
    });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.status(200).json(player);
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updatePlayer = async (req, res) => {
  const { id } = req.params;
  const { name, age, nationality, type, runs, wickets, price, sold } = req.body;

  try {
    const updatedPlayer = await prisma.player.update({
      where: { id },
      data: { name, age, nationality, type, runs, wickets, price, sold },
    });

    res.status(200).json(updatedPlayer);
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deletePlayer = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.player.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const joinAuction = async (req, res) => {
  const { id } = req.params; // playerId
  const { auctionId } = req.body;

  try {
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
    });

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    const updatedPlayer = await prisma.player.update({
      where: { id },
      data: {
        auction: {
          connect: { id: auctionId },
        },
      },
    });

    res.status(200).json(updatedPlayer);
  } catch (error) {
    console.error('Error in joinAuction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
