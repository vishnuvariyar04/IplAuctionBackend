import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let io;
let currentAuctions = {};

export const initializeBidController = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinAuction', async (auctionId) => {
      socket.join(auctionId);
      console.log(`User joined auction: ${auctionId}`);

      if (!currentAuctions[auctionId]) {
        await initializeAuction(auctionId);
      }

      // Send current player data to the newly joined user
      socket.emit('playerUpdate', getCurrentPlayerData(auctionId));
    });

    socket.on('placeBid', async (data) => {
      const { auctionId, playerId, teamId, amount } = data;
      await handleBid(auctionId, playerId, teamId, amount);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

const initializeAuction = async (auctionId) => {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: { players: true }
  });
  
  if (!auction) {
    console.error(`Auction with id ${auctionId} not found`);
    return;
  }

  currentAuctions[auctionId] = {
    currentPlayerIndex: 0,
    players: auction.players,
    currentBid: auction.players[0].price,
    timeLeft: auction.bid_duration,
    timer: null,
    highestBidder: null
  };

  startAuctionTimer(auctionId);
};

const startAuctionTimer = (auctionId) => {
  const auction = currentAuctions[auctionId];
  clearInterval(auction.timer);
  
  auction.timer = setInterval(() => {
    auction.timeLeft--;
    if (auction.timeLeft <= 0) {
      clearInterval(auction.timer);
      moveToNextPlayer(auctionId);
    }
    io.to(auctionId).emit('timerUpdate', { timeLeft: auction.timeLeft });
  }, 1000);
};

const moveToNextPlayer = (auctionId) => {
  const auction = currentAuctions[auctionId];
  auction.currentPlayerIndex++;
  
  if (auction.currentPlayerIndex >= auction.players.length) {
    // Auction ended
    io.to(auctionId).emit('auctionEnded');
    delete currentAuctions[auctionId];
  } else {
    auction.currentBid = auction.players[auction.currentPlayerIndex].price;
    auction.timeLeft = 60; // Reset timer for new player
    auction.highestBidder = null;
    startAuctionTimer(auctionId);
    io.to(auctionId).emit('playerUpdate', getCurrentPlayerData(auctionId));
  }
};

const handleBid = async (auctionId, playerId, teamId, amount) => {
  const auction = currentAuctions[auctionId];
  if (amount > auction.currentBid) {
    auction.currentBid = amount;
    auction.highestBidder = teamId;
    auction.timeLeft = 60; // Reset timer on new bid
    startAuctionTimer(auctionId);
    io.to(auctionId).emit('bidUpdate', { playerId, teamId, amount });
    io.to(auctionId).emit('playerUpdate', getCurrentPlayerData(auctionId));
  }
};

const getCurrentPlayerData = (auctionId) => {
  const auction = currentAuctions[auctionId];
  return {
    player: auction.players[auction.currentPlayerIndex],
    currentBid: auction.currentBid,
    timeLeft: auction.timeLeft,
    highestBidder: auction.highestBidder
  };
};

export const placeBid = (req, res) => {
  const { auctionId, playerId, teamId, amount } = req.body;
  io.to(auctionId).emit('bidUpdate', { playerId, teamId, amount });
  res.status(200).json({ message: 'Bid placed successfully' });
};

export const getBidsForAuction = (req, res) => {
  res.status(200).json({ message: 'Bids are managed client-side' });
};