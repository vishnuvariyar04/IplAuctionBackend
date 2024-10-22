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

    socket.on('joinAuction', async (data) => {
      const { auctionId, teamId } = data;
      socket.join(auctionId);
      console.log(`User joined auction: ${auctionId}`);

      if (!currentAuctions[auctionId]) {
        await initializeAuction(auctionId);
      }

      const auctionData = getCurrentAuctionData(auctionId);
      if (auctionData) {
        socket.emit('auctionStatus', auctionData);
      } else {
        socket.emit('error', { message: 'Auction not found or not started' });
      }
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

  const startTime = new Date(auction.start_time);
  const currentTime = new Date();
  const timeDifference = startTime.getTime() - currentTime.getTime();

  if (timeDifference > 0) {
    // Auction hasn't started yet
    setTimeout(() => startAuction(auctionId), timeDifference);
    currentAuctions[auctionId] = { 
      status: 'waiting', 
      startTime,
      endTime: new Date(startTime.getTime() + auction.players.length * auction.bid_duration * 1000)
    };
  } else {
    // Auction should have started
    startAuction(auctionId);
  }
};

const startAuction = async (auctionId) => {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: { players: true }
  });

  if (!auction) return;

  currentAuctions[auctionId] = {
    status: 'active',
    currentPlayerIndex: 0,
    players: auction.players,
    currentBid: auction.players[0].price,
    timeLeft: auction.bid_duration,
    timer: null,
    highestBidder: null,
    endTime: new Date(Date.now() + auction.players.length * auction.bid_duration * 1000)
  };

  startAuctionTimer(auctionId);
  io.to(auctionId).emit('auctionStarted', getCurrentAuctionData(auctionId));
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

const moveToNextPlayer = async (auctionId) => {
  const auction = currentAuctions[auctionId];
  const currentPlayer = auction.players[auction.currentPlayerIndex];

  if (auction.highestBidder) {
    await updatePlayerTeam(currentPlayer.id, auction.highestBidder);
    io.to(auctionId).emit('playerSold', { 
      playerId: currentPlayer.id, 
      teamId: auction.highestBidder, 
      amount: auction.currentBid 
    });
  } else {
    io.to(auctionId).emit('playerUnsold', { playerId: currentPlayer.id });
  }

  auction.currentPlayerIndex++;
  
  if (auction.currentPlayerIndex >= auction.players.length) {
    endAuction(auctionId);
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
  if (auction && auction.status === 'active' && amount > auction.currentBid) {
    auction.currentBid = amount;
    auction.highestBidder = teamId;
    auction.timeLeft = 60; // Reset timer on new bid
    io.to(auctionId).emit('bidUpdate', { playerId, teamId, amount });
    io.to(auctionId).emit('playerUpdate', getCurrentPlayerData(auctionId));
  }
};

const getCurrentPlayerData = (auctionId) => {
  const auction = currentAuctions[auctionId];
  return auction ? {
    player: auction.players[auction.currentPlayerIndex],
    currentBid: auction.currentBid,
    timeLeft: auction.timeLeft,
    highestBidder: auction.highestBidder
  } : null;
};

const updatePlayerTeam = async (playerId, teamId) => {
  try {
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: { teamId: teamId },
    });
    console.log('Player updated:', updatedPlayer);
  } catch (error) {
    console.error('Error updating player team:', error);
  }
};

export const placeBid = (req, res) => {
  const { auctionId, playerId, teamId, amount } = req.body;
  io.to(auctionId).emit('bidUpdate', { playerId, teamId, amount });
  res.status(200).json({ message: 'Bid placed successfully' });
};

export const getBidsForAuction = (req, res) => {
  res.status(200).json({ message: 'Bids are managed in real-time' });
};

const getCurrentAuctionData = (auctionId) => {
  const auction = currentAuctions[auctionId];
  return auction ? {
    status: auction.status,
    currentPlayer: getCurrentPlayerData(auctionId),
    endTime: auction.endTime
  } : null;
};
