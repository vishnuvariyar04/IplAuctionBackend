import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  // const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const response = await fetch('http://192.168.43.143:3000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          // email,
          password,
        }),
      });

      if (response.ok) {
        Alert.alert('Registration Successful');
        router.push('/LoginScreen');
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
      {/* <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        className="border-b border-gray-400 text-white w-4/5 my-4"
        value={email}
        onChangeText={setEmail}
      /> */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#aaa"
        className="border-b border-gray-400 text-white w-4/5 my-4"
        value={password}
        onChangeText={setPassword}
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