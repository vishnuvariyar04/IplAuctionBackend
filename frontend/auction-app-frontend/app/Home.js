import React from 'react';
import { View, Text } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-white text-xl">Welcome to Premier Bid</Text>
      <Text className="text-gray-400 mt-2">Your dashboard is currently empty.</Text>
    </View>
  );
}