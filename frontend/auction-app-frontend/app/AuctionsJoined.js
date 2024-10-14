import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AuctionsJoined() {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useLocalSearchParams();


  useEffect(() => {
    fetchTeamData();
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
        console.log('Team data:', data); // Add this line for debugging
        setTeamData(data);
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
          teamData.auctions.map((auction) => (
            <View key={auction.id} className="bg-gray-800 p-4 rounded-lg mb-4 shadow-md">
              <Text className="text-green-400 text-lg font-bold mb-2">{auction.name}</Text>
              <Text className="text-gray-300 mb-2">{auction.description}</Text>
              <Text className="text-gray-400">Start Time: {new Date(auction.start_time).toLocaleString()}</Text>
            </View>
          ))
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
