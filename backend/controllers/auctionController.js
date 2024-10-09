import {WebSocketServer} from 'ws';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createAuction = async (req, res) => {
  const { name, description, rules_file, start_time, bid_duration, max_teams, players_per_team, bid_increment } = req.body;
  const auctioneerId = req.user.id;

  try {
    const newAuction = await prisma.auction.create({
      data: {
        name,
        description,
        rules_file,
        start_time,
        bid_duration,
        max_teams,
        players_per_team,
        bid_increment,
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




const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', async (message) => {
    try {
      const { auctionId, teamId, playerPrice } = JSON.parse(message);
      const updatedPlayer = await prisma.player.update({
        where: { auctionId_teamId: { auctionId, teamId } },
        data: { price: playerPrice, sold: true },
      });
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(updatedPlayer));
        }
      });
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

export const auctionController = {
  async startAuction(req, res) {
    const { id } = req.params;
    try {
      const auction = await prisma.auction.findUnique({
        where: { id },
        include: { players: true, teams: true },
      });

      if (!auction) {
        return res.status(404).json({ error: 'Auction not found' });
      }

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ auction, players: auction.players, teams: auction.teams }));
        }
      });

      res.json({ message: 'Auction started' });
    } catch (error) {
      console.error('Error starting auction:', error);
      res.status(500).json({ error: 'Error starting auction' });
    }
  },
};

