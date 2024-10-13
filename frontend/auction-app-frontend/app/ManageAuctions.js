import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideNavigation from './SideNavigation';

export default function ManageAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [showSideNav, setShowSideNav] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch('https://iplauctionbackend-1.onrender.com/api/users/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setAuctions(data.auctions || []);
      } else {
        Alert.alert('Error', 'Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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

  const toggleSideNav = () => {
    setShowSideNav(!showSideNav);
  };

  return (
    <View className="flex-1 bg-black">
      <View className={`flex-1 ${showSideNav ? 'ml-64' : ''}`}>
        <TouchableOpacity onPress={toggleSideNav} className="absolute top-4 left-4 z-10">
          <Text className="text-white text-2xl">☰</Text>
        </TouchableOpacity>
        
        <View className="flex-1 p-4 mt-12">
          <Text className="text-white text-2xl font-bold mb-4">Manage Auctions</Text>
          {auctions.length > 0 ? (
            <FlatList
              data={auctions}
              renderItem={renderAuctionCard}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <Text className="text-white text-lg">You haven't created any auctions yet.</Text>
          )}
        </View>
      </View>
      
      {showSideNav && (
        <View className="absolute top-0 left-0 bottom-0">
          <SideNavigation onClose={toggleSideNav} />
        </View>
      )}
    </View>
  );
}
