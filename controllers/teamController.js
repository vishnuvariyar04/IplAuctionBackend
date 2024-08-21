import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createTeam = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const newTeam = await prisma.team.create({
      data: {
        name,
        ownerId: userId,
      },
    });
    res.status(201).json(newTeam);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getTeams = async (req, res) => {
  try {
    const teams = await prisma.team.findMany();
    res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getTeam = async (req, res) => {
  const { id } = req.params;

  try {
    const team = await prisma.team.findUnique({
      where: { id },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateTeam = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedTeam = await prisma.team.update({
      where: { id },
      data: { name },
    });

    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteTeam = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.team.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const joinAuction = async (req, res) => {
  const { id } = req.params; // teamId
  const { auctionId } = req.body;

  try {
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
    });

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    const updatedTeam = await prisma.team.update({
      where: { id },
      data: {
        auctions: {
          connect: { id: auctionId },
        },
      },
    });

    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error('Error in joinAuction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
