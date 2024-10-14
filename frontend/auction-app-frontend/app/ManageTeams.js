import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import SideNavigation from './SideNavigation';

export default function ManageTeams() {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSideNav, setShowSideNav] = useState(false);
  const router = useRouter();

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
        setTeamData(data.teams || []);
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

  const toggleSideNav = () => {
    setShowSideNav(!showSideNav);
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
      <View className="flex-row justify-between items-center p-4 bg-gray-800">
        <TouchableOpacity onPress={toggleSideNav}>
          <Text className="text-white text-2xl">☰</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Manage Teams</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView className="flex-1 p-4">
        {teamData && teamData.length > 0 ? (
          teamData.map((team) => (
            <TouchableOpacity
              key={team.id}
              className="bg-gray-800 p-4 rounded-lg mb-4 shadow-md"
              onPress={() => router.push({pathname: '/AuctionsJoined', params: { id: team.id }})}
            >
              <Text className="text-green-400 text-lg font-bold mb-2">{team.name}</Text>
              <Text className="text-gray-300">{team.description}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View className="bg-gray-800 p-4 rounded-lg">
            <Text className="text-white text-lg text-center">You haven't created any teams yet.</Text>
          </View>
        )}
      </ScrollView>

      {showSideNav && (
        <View className="absolute top-0 left-0 bottom-0 right-0 bg-black bg-opacity-50">
          <SideNavigation onClose={toggleSideNav} />
        </View>
      )}
    </View>
  );
}
