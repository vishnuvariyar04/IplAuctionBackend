import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone_num, setPhone_num] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const response = await fetch('https://iplauctionbackend-1.onrender.com/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          email,
          phone_num
        }),
      });

      if (response.ok) {
        Alert.alert('Registration Successful');
        router.push('/Dashboard');
      } else {
        const errorData = await response.json();
        Alert.alert('Registration Failed', errorData.message || 'An error occurred');
      }
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'An error occurred');
      console.log(error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Text className="text-5xl text-yellow-400 font-bold">Register</Text>

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

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        className="border-b border-gray-400 text-white w-4/5 my-4"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="phoneNumber"
        placeholderTextColor="#aaa"
        className="border-b border-gray-400 text-white w-4/5 my-4"
        value={phone_num}
        onChangeText={setPhone_num}
      />

      <Button title="Register" onPress={handleRegister} />

      <Text className="text-white mt-4">
        Already have an account?{' '}
        <Text className="text-green-400" onPress={() => router.push('/LoginScreen')}>
          Login
        </Text>
      </Text>
    </View>
  );
}