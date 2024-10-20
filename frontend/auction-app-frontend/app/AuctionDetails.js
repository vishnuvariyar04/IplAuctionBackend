import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuctionDetails() {
  const [auctionData, setAuctionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('players');
  const { id } = useLocalSearchParams();

  useEffect(() => {
    fetchAuctionDetails();
  }, []);

  const fetchAuctionDetails = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch(`https://iplauctionbackend-1.onrender.com/api/auctions/${id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAuctionData(data);
      } else {
        console.error('Failed to fetch auction details');
      }
    } catch (error) {
      console.error('Error fetching auction details:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPlayerItem = (player) => (
    <View key={player.id} className="bg-gray-800 p-4 rounded-lg mb-4">
      <Text className="text-green-400 text-lg font-bold">{player.name}</Text>
      <Text className="text-gray-300">Age: {player.age}</Text>
      <Text className="text-gray-300">Type: {player.type}</Text>
      <Text className="text-gray-300">Runs: {player.runs}</Text>
      <Text className="text-gray-300">Wickets: {player.wickets}</Text>
      <Text className="text-gray-300">Price: {player.price}</Text>
      <Text className="text-gray-300">Sold: {player.sold ? 'Yes' : 'No'}</Text>
    </View>
  );

  const renderTeamItem = (team) => (
    <View key={team.id} className="bg-gray-800 p-4 rounded-lg mb-4">
      <Text className="text-green-400 text-lg font-bold">{team.name}</Text>
      <Text className="text-gray-300">{team.description}</Text>
    </View>
  );

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
        <Text className="text-white text-xl font-bold">{auctionData?.name}</Text>
      </View>

      <View className="flex-row justify-around p-4 bg-gray-800">
        <TouchableOpacity onPress={() => setActiveTab('players')}>
          <Text className={`text-lg ${activeTab === 'players' ? 'text-green-400' : 'text-white'}`}>Players</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('teams')}>
          <Text className={`text-lg ${activeTab === 'teams' ? 'text-green-400' : 'text-white'}`}>Teams</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {activeTab === 'players' ? (
          auctionData?.players.map(renderPlayerItem)
        ) : (
          auctionData?.teams.map(renderTeamItem)
        )}
      </ScrollView>
    </View>
  );
}

