import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideNavigation from './SideNavigation';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function PlayerProfile() {
  const [playerData, setPlayerData] = useState(null);
  const [showSideNav, setShowSideNav] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const router = useRouter();

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

  return (
    <View className="flex-1 bg-gray-900">
      <View className="flex-row justify-between items-center p-4 bg-gray-800">
        <TouchableOpacity onPress={toggleSideNav}>
          <Text className="text-white text-2xl">☰</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Player Profile</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView className="flex-1 p-4">
        {loading ? (
          <ActivityIndicator size="large" color="#4ade80" />
        ) : playerData ? (
          <View className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <ProfileItem label="Name" value={playerData.name} />
            <ProfileItem label="Age" value={playerData.age} />
            <ProfileItem label="Nationality" value={playerData.nationality} />
            <ProfileItem label="Type" value={playerData.type} />
            <ProfileItem label="Runs" value={playerData.runs} />
            <ProfileItem label="Wickets" value={playerData.wickets} />
            <ProfileItem label="Price" value={playerData.price} />
            <ProfileItem label="Sold" value={playerData.sold ? 'Yes' : 'No'} />
          </View>
        ) : (
          <View className="bg-gray-800 p-4 rounded-lg">
            <Text className="text-white text-lg text-center">No player data available. Please register as a player.</Text>
          </View>
        )}
      </ScrollView>

      {playerData && (
        <TouchableOpacity 
          className="absolute bottom-6 right-6 bg-blue-500 p-4 rounded-full"
          onPress={() => router.push('/Auctions')}
        >
          <Text className="text-white font-bold">Join Auction</Text>
        </TouchableOpacity>
      )}

      {showSideNav && (
        <View className="absolute top-0 left-0 bottom-0 right-0 bg-black bg-opacity-50">
          <SideNavigation onClose={toggleSideNav} />
        </View>
      )}
    </View>
  );
}

const ProfileItem = ({ label, value }) => (
  <View className="flex-row justify-between items-center mb-4">
    <Text className="text-gray-400 text-lg">{label}:</Text>
    <Text className="text-white text-lg font-semibold">{value}</Text>
  </View>
);
