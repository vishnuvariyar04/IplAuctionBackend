import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BiddingPage() {
  const { auctionId, teamId } = useLocalSearchParams();
  const [auctionData, setAuctionData] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentBid, setCurrentBid] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchAuctionData();
  }, []);

  useEffect(() => {
    if (auctionData) {
      startBiddingProcess();
    }
  }, [auctionData]);

  const fetchAuctionData = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch(`https://iplauctionbackend-1.onrender.com/api/auctions/${auctionId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAuctionData(data);
      } else {
        console.error('Failed to fetch auction data. Status:', response.status);
        Alert.alert('Error', 'Failed to fetch auction data');
      }
    } catch (error) {
      console.error('Error fetching auction data:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const startBiddingProcess = () => {
    if (auctionData.players.length > 0) {
      setCurrentPlayer(auctionData.players[0]);
      setCurrentBid(auctionData.players[0].price);
      setTimeLeft(auctionData.bid_duration * 60); // Convert minutes to seconds
      startTimer();
    } else {
      Alert.alert('Auction Completed', 'All players have been auctioned.');
      router.back();
    }
  };

  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          moveToNextPlayer();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const moveToNextPlayer = () => {
    const nextIndex = currentPlayerIndex + 1;
    if (nextIndex < auctionData.players.length) {
      setCurrentPlayerIndex(nextIndex);
      setCurrentPlayer(auctionData.players[nextIndex]);
      setCurrentBid(auctionData.players[nextIndex].price);
      setTimeLeft(auctionData.bid_duration * 60); // Reset timer for new player
      startTimer();
    } else {
      Alert.alert('Auction Completed', 'All players have been auctioned.');
      router.back();
    }
  };

  const handleBid = async () => {
    const newBid = currentBid + auctionData.bid_increment;
    setCurrentBid(newBid);

    // Here you would typically send the bid to your backend
    // For now, we'll just simulate a successful bid
    Alert.alert('Bid Placed', `Your bid of $${newBid.toLocaleString()} has been placed!`);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (!currentPlayer) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-white text-xl">Loading auction data...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900 p-4">
      <Text className="text-white text-2xl font-bold mb-4">{currentPlayer.name}</Text>
      <Text className="text-gray-300 mb-2">Type: {currentPlayer.type}</Text>
      <Text className="text-gray-300 mb-2">Age: {currentPlayer.age}</Text>
      <Text className="text-gray-300 mb-2">Nationality: {currentPlayer.nationality}</Text>
      <Text className="text-gray-300 mb-2">Runs: {currentPlayer.runs}</Text>
      <Text className="text-gray-300 mb-2">Wickets: {currentPlayer.wickets}</Text>
      <Text className="text-gray-300 mb-2">Base Price: ${currentPlayer.price.toLocaleString()}</Text>
      <Text className="text-gray-300 mb-2">Current Bid: ${currentBid.toLocaleString()}</Text>
      <Text className="text-gray-300 mb-2">Bid Increment: ${auctionData.bid_increment.toLocaleString()}</Text>
      <Text className="text-gray-300 mb-4">Time Left: {formatTime(timeLeft)}</Text>
      <TouchableOpacity 
        className="bg-green-500 p-4 rounded mb-4"
        onPress={handleBid}
      >
        <Text className="text-white font-bold text-center">Place Bid (${(currentBid + auctionData.bid_increment).toLocaleString()})</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        className="bg-red-500 p-4 rounded"
        onPress={() => router.back()}
      >
        <Text className="text-white font-bold text-center">Exit Auction</Text>
      </TouchableOpacity>
    </View>
  );
}
