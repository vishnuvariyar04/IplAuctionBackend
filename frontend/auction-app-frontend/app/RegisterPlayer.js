import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterPlayer() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [nationality, setNationality] = useState('');
  const [type, setType] = useState('');
  const [runs, setRuns] = useState('');
  const [wickets, setWickets] = useState('');
  const [price, setPrice] = useState('');

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch('https://iplauctionbackend-1.onrender.com/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          age: parseInt(age),
          nationality,
          type,
          runs: parseInt(runs),
          wickets: parseInt(wickets),
          price: parseInt(price),
          userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Success', 'Player registered successfully');
        router.push('/PlayerProfile');
      } else {
        Alert.alert('Error', 'Failed to register player');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while registering the player');
    }
  };

  return (
    <ScrollView className="flex-1 bg-black p-4">
      <Text className="text-white text-2xl font-bold mb-4">Register as Player</Text>
      <TextInput
        className="bg-gray-800 text-white p-2 rounded mb-2"
        placeholder="Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="bg-gray-800 text-white p-2 rounded mb-2"
        placeholder="Age"
        placeholderTextColor="#999"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        className="bg-gray-800 text-white p-2 rounded mb-2"
        placeholder="Nationality"
        placeholderTextColor="#999"
        value={nationality}
        onChangeText={setNationality}
      />
      <TextInput
        className="bg-gray-800 text-white p-2 rounded mb-2"
        placeholder="Type (e.g., Batsman, Bowler)"
        placeholderTextColor="#999"
        value={type}
        onChangeText={setType}
      />
      <TextInput
        className="bg-gray-800 text-white p-2 rounded mb-2"
        placeholder="Runs"
        placeholderTextColor="#999"
        value={runs}
        onChangeText={setRuns}
        keyboardType="numeric"
      />
      <TextInput
        className="bg-gray-800 text-white p-2 rounded mb-2"
        placeholder="Wickets"
        placeholderTextColor="#999"
        value={wickets}
        onChangeText={setWickets}
        keyboardType="numeric"
      />
      <TextInput
        className="bg-gray-800 text-white p-2 rounded mb-2"
        placeholder="Price"
        placeholderTextColor="#999"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity
        className="bg-green-500 p-3 rounded mt-4"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-bold">Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}