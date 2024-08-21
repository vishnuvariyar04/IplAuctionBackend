import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createAuction = async (req, res) => {
  const { name } = req.body;
  const auctioneerId = req.user.id;

  try {
    const newAuction = await prisma.auction.create({
      data: {
        name,
        auctioneerId,
      },
    });
    res.status(201).json(newAuction);
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAuctions = async (req, res) => {
  try {
    const auctions = await prisma.auction.findMany();
    res.status(200).json(auctions);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAuction = async (req, res) => {
  const { id } = req.params;

  try {
    const auction = await prisma.auction.findUnique({
      where: { id },
    });

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    res.status(200).json(auction);
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
