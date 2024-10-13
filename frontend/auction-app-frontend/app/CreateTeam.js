import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateTeam() {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleCreateTeam = async () => {
    if (!teamName || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch('https://iplauctionbackend-1.onrender.com/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: teamName,
          description: description,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Team created successfully');
        router.push('/ManageTeams');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to create team');
      }
    } catch (error) {
      console.error('Error creating team:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900 p-4">
      <Text className="text-green-400 text-3xl font-bold mb-6">Create Team</Text>
      
      <TextInput
        className="bg-gray-800 text-white p-3 rounded mb-4"
        placeholder="Team Name"
        placeholderTextColor="#999"
        value={teamName}
        onChangeText={setTeamName}
      />
      
      <TextInput
        className="bg-gray-800 text-white p-3 rounded mb-4"
        placeholder="Description"
        placeholderTextColor="#999"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />
      
      <TouchableOpacity
        className="bg-green-500 p-3 rounded mb-6"
        onPress={handleCreateTeam}
      >
        <Text className="text-white text-center font-bold">Create Team</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
