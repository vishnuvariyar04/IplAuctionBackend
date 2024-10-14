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
      const response = await fetch('https://iplauctionbackend-1.onrender.com/api/users/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const team = data.teams.find(team => team.id === id);
        setTeamData(team);
      } else {
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
        <Text className="text-white text-lg mb-4">Auctions joined by this team will be displayed here.</Text>
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
