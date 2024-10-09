import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('https://iplauctionbackend-1.onrender.com/api/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add your authentication token here if required
          // 'Authorization': `Bearer ${your_auth_token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User data received:', data);
        // Adjust this part based on the actual structure of your API response
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-white text-2xl font-bold mb-4">User Profile</Text>
      {userData ? (
  <>
    <Text className="text-white text-lg mb-2">Username: {userData.username || 'N/A'}</Text>
    <Text className="text-white text-lg mb-2">Email: {userData.email || 'N/A'}</Text>
    <Text className="text-white text-lg mb-2">Phone: {userData.phone_num || 'N/A'}</Text>
  </>
) : (
  <Text className="text-white text-lg">Failed to load user data</Text>
)}
    </View>
  );
}