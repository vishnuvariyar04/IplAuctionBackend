import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function ManageAuctions() {
  const [auctions, setAuctions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await fetch('https://iplauctionbackend-1.onrender.com/api/auctions', {
        headers: {
          // Add authentication header if required
          // 'Authorization': `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAuctions(data);
      } else {
        Alert.alert('Error', 'Failed to fetch auctions');
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const renderAuctionCard = ({ item }) => (
    <TouchableOpacity
      className="bg-gray-800 p-4 rounded mb-4"
      onPress={() => router.push(`/AuctionDetails/${item.id}`)}
    >
      <Text className="text-white text-lg font-bold">{item.name}</Text>
      <Text className="text-gray-400">{item.description}</Text>
      <Text className="text-gray-400">Start Time: {new Date(item.start_time).toLocaleString()}</Text>
      <Text className="text-gray-400">Max Teams: {item.max_teams}</Text>
      <Text className="text-gray-400">Players per Team: {item.players_per_team}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-black p-4">
      <Text className="text-white text-2xl font-bold mb-4">Manage Auctions</Text>
      <FlatList
        data={auctions}
        renderItem={renderAuctionCard}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}