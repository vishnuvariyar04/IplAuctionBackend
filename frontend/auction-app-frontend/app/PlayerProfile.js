import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideNavigation from './SideNavigation';

export default function PlayerProfile() {
  const [playerData, setPlayerData] = useState(null);
  const [showSideNav, setShowSideNav] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayerData();
  }, []);

  const fetchPlayerData = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      
      // if (!authToken) {
      //   console.error('Auth token is missing');
      //   setLoading(false);
      //   Alert.alert('Error', 'Please log in again to view your profile.');
      //   return;
      // }

      console.log('Fetching user data');
      
      const response = await fetch('https://iplauctionbackend-1.onrender.com/api/users/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('User data received:', data);
        if (data.player) {
          setPlayerData(data.player);
        } else {
          Alert.alert('Info', 'No player profile found. Please register as a player.');
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch user data. Status:', response.status, 'Error:', errorText);
        Alert.alert('Error', 'Failed to fetch user data. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'An unexpected error occurred while fetching user data.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSideNav = () => {
    setShowSideNav(!showSideNav);
  };

  const content = (
    <View className="flex-1">
      <TouchableOpacity onPress={toggleSideNav} className="absolute top-4 left-4 z-10">
        <Text className="text-white text-2xl">☰</Text>
      </TouchableOpacity>

      {showSideNav && <SideNavigation onClose={toggleSideNav} />}

      <ScrollView className={`flex-1 p-4 ${showSideNav ? 'ml-64' : ''}`}>
        <Text className="text-white text-2xl font-bold mb-4">Player Profile</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4ade80" />
        ) : playerData ? (
          <>
            <Text className="text-white text-lg">Name: {playerData.name}</Text>
            <Text className="text-white text-lg">Age: {playerData.age}</Text>
            <Text className="text-white text-lg">Nationality: {playerData.nationality}</Text>
            <Text className="text-white text-lg">Type: {playerData.type}</Text>
            <Text className="text-white text-lg">Runs: {playerData.runs}</Text>
            <Text className="text-white text-lg">Wickets: {playerData.wickets}</Text>
            <Text className="text-white text-lg">Price: {playerData.price}</Text>
            <Text className="text-white text-lg">Sold: {playerData.sold ? 'Yes' : 'No'}</Text>
          </>
        ) : (
          <Text className="text-white text-lg">No player data available. Please register as a player.</Text>
        )}
      </ScrollView>
    </View>
  );

  return content;
}
