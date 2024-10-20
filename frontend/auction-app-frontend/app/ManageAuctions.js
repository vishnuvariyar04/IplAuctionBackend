import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
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
    <View className="flex-1 bg-gray-900">
      <View className="flex-row justify-between items-center p-4 bg-gray-800">
        <TouchableOpacity onPress={toggleSideNav}>
          <Text className="text-white text-2xl">☰</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Manage Auctions</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView className="flex-1 p-4">
        {auctions.length > 0 ? (
          auctions.map((auction) => (
            <TouchableOpacity
              key={auction.id}
              className="bg-gray-800 p-4 rounded-lg mb-4 shadow-md"
              onPress={() => router.push({pathname: '/AuctionDetails', params: { id: auction.id }})}
            >
              <Text className="text-green-400 text-lg font-bold mb-2">{auction.name}</Text>
              <Text className="text-gray-300 mb-2">{auction.description}</Text>
              <Text className="text-gray-400">Start Time: {new Date(auction.start_time).toLocaleString()}</Text>
              <Text className="text-gray-400">Max Teams: {auction.max_teams}</Text>
              <Text className="text-gray-400">Players per Team: {auction.players_per_team}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View className="bg-gray-800 p-4 rounded-lg">
            <Text className="text-white text-lg text-center">You haven't created any auctions yet.</Text>
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
