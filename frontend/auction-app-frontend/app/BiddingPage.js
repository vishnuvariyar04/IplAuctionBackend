import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

export default function BiddingPage() {
  const { auctionId, teamId } = useLocalSearchParams();
  const [auctionData, setAuctionData] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [socket, setSocket] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const newSocket = io('https://iplauctionbackend-1.onrender.com');
    setSocket(newSocket);

    newSocket.emit('joinAuction', auctionId);

    newSocket.on('auctionStateUpdate', (data) => {
      setAuctionData(data);
      setCurrentPlayer(data.players[data.currentPlayerIndex]);
      setCurrentBid(data.currentBid);
      setTimeLeft(data.timeLeft);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      Alert.alert('Error', 'Failed to connect to the auction. Please try again.');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [auctionId]);

  const handleBid = async () => {
    if (!currentPlayer) {
      Alert.alert('Error', 'No current player to bid on.');
      return;
    }
    const newBid = currentBid + auctionData.bid_increment;
    socket.emit('placeBid', {
      auctionId,
      playerId: currentPlayer.id,
      teamId,
      amount: newBid
    });
  };

  if (!auctionData || !currentPlayer) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-white text-xl">Loading auction data...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900 p-4">
      <Text className="text-white text-2xl font-bold mb-4">{currentPlayer.name}</Text>
      <Text className="text-gray-300 mb-2">Current Bid: ${currentBid.toLocaleString()}</Text>
      <Text className="text-gray-300 mb-2">Time Left: {formatTime(timeLeft)}</Text>
      <TouchableOpacity 
        className="bg-green-500 p-4 rounded mb-4"
        onPress={handleBid}
      >
        <Text className="text-white font-bold text-center">Place Bid</Text>
      </TouchableOpacity>
    </View>
  );
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};