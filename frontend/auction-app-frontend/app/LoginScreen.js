import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://iplauctionbackend-1.onrender.com/api/users/login', { // Replace with your machine's IP address
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the token in AsyncStorage
        // await AsyncStorage.setItem('authToken', data.token);
        Alert.alert('Login Successful');
        router.push('/Dashboard'); // Replace with the screen you want to navigate to after login
      } else {
        const errorData = await response.json();
        Alert.alert('Login Failed', errorData.message || 'An error occurred');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'An error occurred');
      console.log(error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Text className="text-5xl text-yellow-400 font-bold">Login</Text>

      <TextInput
        placeholder="Username"
        placeholderTextColor="#aaa"
        className="border-b border-gray-400 text-white w-4/5 my-4"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#aaa"
        className="border-b border-gray-400 text-white w-4/5 my-4"
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} />
      
      <Text className="text-white mt-4">
        Don't have an account?{' '}
        <Text className="text-green-400" onPress={() => router.push('/RegisterScreen')}>
          Sign up
        </Text>
      </Text>
    </View>
  );
}