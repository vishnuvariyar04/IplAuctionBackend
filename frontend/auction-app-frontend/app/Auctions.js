import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Auctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerId, setPlayerId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchAuctions();
    fetchPlayerId();
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await fetch('https://iplauctionbackend-1.onrender.com/api/auctions');
      if (response.ok) {
        const data = await response.json();
        setAuctions(data);
      } else {
        Alert.alert('Error', 'Failed to fetch auctions');
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayerId = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch('https://iplauctionbackend-1.onrender.com/api/users/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPlayerId(data.player?.id);
      } else {
        Alert.alert('Error', 'Failed to fetch player data');
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const joinAuction = async (auctionId) => {
    if (!playerId) {
      Alert.alert('Error', 'Player ID not found');
      return;
    }

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch(`https://iplauctionbackend-1.onrender.com/api/players/${playerId}/join-auction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ auctionId }),
      });

      if (response.ok) {
        Alert.alert('Success', 'You have joined the auction');
        // Optionally, you can update the UI or refetch the auctions here
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to join auction');
      }
    } catch (error) {
      console.error('Error joining auction:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
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
        <Text className="text-white text-xl font-bold">Available Auctions</Text>
      </View>
      <ScrollView className="flex-1 p-4">
        {auctions.map((auction) => (
          <View key={auction.id} className="bg-gray-800 p-4 rounded-lg mb-4 shadow-md">
            <Text className="text-green-400 text-lg font-bold mb-2">{auction.name}</Text>
            <Text className="text-gray-300 mb-2">{auction.description}</Text>
            <Text className="text-gray-400">Start Time: {new Date(auction.start_time).toLocaleString()}</Text>
            <TouchableOpacity
              className="bg-blue-500 p-2 rounded mt-2"
              onPress={() => joinAuction(auction.id)}
            >
              <Text className="text-white text-center font-bold">Join</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
