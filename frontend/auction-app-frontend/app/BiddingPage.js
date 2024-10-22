import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

export default function BiddingPage() {
  const { auctionId, teamId } = useLocalSearchParams();
  const [auctionData, setAuctionData] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentBid, setCurrentBid] = useState(0);
  const [bidHistory, setBidHistory] = useState([]);
  const [socket, setSocket] = useState(null);
  const [auctionStatus, setAuctionStatus] = useState('waiting');
  const router = useRouter();
  const [teams, setTeams] = useState({});

  useEffect(() => {
    fetchAuctionData();
    const newSocket = io('https://iplauctionbackend-1.onrender.com');
    setSocket(newSocket);

    newSocket.emit('joinAuction', { auctionId, teamId });

    newSocket.on('auctionStatus', handleAuctionStatus);
    newSocket.on('auctionStarted', handleAuctionStarted);
    newSocket.on('bidUpdate', handleBidUpdate);
    newSocket.on('playerUpdate', handlePlayerUpdate);
    newSocket.on('timerUpdate', handleTimerUpdate);
    newSocket.on('auctionEnded', handleAuctionEnded);
    newSocket.on('error', handleError);

    return () => {
      newSocket.disconnect();
    };
  }, []);

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
        const teamMap = {};
        data.teams.forEach(team => {
          teamMap[team.id] = team.name;
        });
        setTeams(teamMap);
      } else {
        console.error('Failed to fetch auction data. Status:', response.status);
        Alert.alert('Error', 'Failed to fetch auction data');
      }
    } catch (error) {
      console.error('Error fetching auction data:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleAuctionStatus = (data) => {
    setAuctionStatus(data.status);
    if (data.currentPlayer) {
      handlePlayerUpdate(data.currentPlayer);
    }
  };

  const handleAuctionStarted = (data) => {
    setAuctionStatus('active');
    handlePlayerUpdate(data.currentPlayer);
  };

  const handlePlayerUpdate = (data) => {
    setCurrentPlayer(data.player);
    setCurrentBid(data.currentBid);
    setTimeLeft(data.timeLeft);
    setBidHistory([]);
  };

  const handleBidUpdate = (bid) => {
    setCurrentBid(bid.amount);
    const teamName = teams[bid.teamId] || 'Unknown Team';
    setBidHistory(prevHistory => [...prevHistory, { ...bid, teamName }]);
  };

  const handleTimerUpdate = (data) => {
    setTimeLeft(data.timeLeft);
  };

  const handleAuctionEnded = () => {
    Alert.alert('Auction Completed', 'All players have been auctioned.');
    router.back();
  };

  const handleError = (error) => {
    Alert.alert('Error', error.message);
  };

  const handleBid = () => {
    if (socket && currentPlayer && auctionStatus === 'active') {
      const newBid = currentBid + (auctionData?.bid_increment || 0);
      socket.emit('placeBid', {
        auctionId,
        playerId: currentPlayer.id,
        teamId,
        amount: newBid
      });
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (auctionStatus === 'waiting') {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-white text-xl">Waiting for auction to start...</Text>
      </View>
    );
  }

  if (!currentPlayer || !auctionData) {
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
        disabled={auctionStatus !== 'active'}
      >
        <Text className="text-white font-bold text-center">
          {auctionStatus === 'active' 
            ? `Place Bid (${(currentBid + auctionData.bid_increment).toLocaleString()})`
            : 'Waiting for auction to start'}
        </Text>
      </TouchableOpacity>
      <FlatList
        data={bidHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text className="text-gray-300">{item.teamName}: ${item.amount.toLocaleString()}</Text>
        )}
      />
      <TouchableOpacity 
        className="bg-red-500 p-4 rounded mt-4"
        onPress={() => router.back()}
      >
        <Text className="text-white font-bold text-center">Exit Auction</Text>
      </TouchableOpacity>
    </View>
  );
}
