import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch('https://iplauctionbackend-1.onrender.com/api/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData({
          username: data.username || data.user?.username,
          email: data.email || data.user?.email,
          phone_num: data.phone_num || data.user?.phone_num
        });
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const ProfileItem = ({ label, value }) => (
    <View className="flex-row justify-between items-center mb-4">
      <Text className="text-gray-400 text-lg">{label}:</Text>
      <Text className="text-white text-lg font-semibold">{value || 'N/A'}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-900 p-4">
      {loading ? (
        <ActivityIndicator size="large" color="#4ade80" />
      ) : userData ? (
        <View className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <ProfileItem label="Username" value={userData.username} />
          <ProfileItem label="Email" value={userData.email} />
          <ProfileItem label="Phone" value={userData.phone_num} />
        </View>
      ) : (
        <View className="bg-gray-800 p-4 rounded-lg">
          <Text className="text-white text-lg text-center">Failed to load user data</Text>
        </View>
      )}
    </View>
  );
}
