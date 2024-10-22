import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AuctionsJoined() {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auctionsData, setAuctionsData] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    fetchTeamData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTeamData = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch(`https://iplauctionbackend-1.onrender.com/api/teams/${id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTeamData(data);
        fetchAuctionsData(data.auctions, authToken);
      } else {
        console.error('Failed to fetch team data. Status:', response.status);
        Alert.alert('Error', 'Failed to fetch team data');
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuctionsData = async (auctions, authToken) => {
    const auctionsDataObj = {};
    for (const auction of auctions) {
      try {
        const response = await fetch(`https://iplauctionbackend-1.onrender.com/api/auctions/${auction.id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          auctionsDataObj[auction.id] = data;
        }
      } catch (error) {
        console.error(`Error fetching auction data for ${auction.id}:`, error);
      }
    }
    setAuctionsData(auctionsDataObj);
  };

  const getAuctionStatus = (auction) => {
    const auctionData = auctionsData[auction.id];
    if (!auctionData) return 'Loading...';
    
    const startTime = new Date(auctionData.start_time);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour after start time
    
    if (currentTime < startTime) {
      return 'Not Started';
    } else if (currentTime >= startTime && currentTime < endTime) {
      return 'In Progress';
    } else {
      return 'Ended';
    }
  };

  const getTimeUntilStart = (auction) => {
    const auctionData = auctionsData[auction.id];
    if (!auctionData) return '';
    const startTime = new Date(auctionData.start_time);
    const timeDiff = startTime - currentTime;
    if (timeDiff <= 0) return 'Starting now';
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    return `Starts in ${hours}h ${minutes}m ${seconds}s`;
  };

  const handleStartBidding = (auction) => {
    const auctionData = auctionsData[auction.id];
    if (!auctionData) return;
    router.push({
      pathname: '/BiddingPage',
      params: { 
        auctionId: auction.id,
        teamId: teamData.id
      }
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <View className="p-4 bg-gray-800">
        <Text className="text-white text-xl font-bold">{teamData?.name}</Text>
      </View>
      <ScrollView className="flex-1 p-4">
        {teamData && teamData.auctions && teamData.auctions.length > 0 ? (
          teamData.auctions.map((auction) => {
            const status = getAuctionStatus(auction);
            return (
              <View key={auction.id} className="bg-gray-800 p-4 rounded-lg mb-4 shadow-md">
                <Text className="text-green-400 text-lg font-bold mb-2">{auction.name}</Text>
                <Text className="text-gray-300 mb-2">{auction.description}</Text>
                <Text className="text-gray-400 mb-2">
                  Status: {status}
                </Text>
                {status === 'Not Started' && (
                  <Text className="text-gray-400 mb-2">{getTimeUntilStart(auction)}</Text>
                )}
                {status === 'In Progress' && (
                  <TouchableOpacity 
                    className="mt-4 bg-blue-500 p-2 rounded"
                    onPress={() => handleStartBidding(auction)}
                  >
                    <Text className="text-white font-bold text-center">Start Bidding</Text>
                  </TouchableOpacity>
                )}
                {status === 'Ended' && (
                  <Text className="text-red-400 mb-2">This auction has ended</Text>
                )}
              </View>
            );
          })
        ) : (
          <Text className="text-white text-lg mb-4">This team hasn't joined any auctions yet.</Text>
        )}
      </ScrollView>
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-blue-500 p-4 rounded-full"
        onPress={() => router.push({pathname: '/Auctions', params: { teamId: teamData?.id }})}
      >
        <Text className="text-white font-bold">Join Auction</Text>
      </TouchableOpacity>
    </View>
  );
}