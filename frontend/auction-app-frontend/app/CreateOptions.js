import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function CreateOptions({ onClose }) {
  return (
    <View className="absolute bottom-20 right-6 bg-gray-800 rounded-lg p-4">
      <TouchableOpacity className="py-2">
        <Text className="text-white text-lg">Register as Player</Text>
      </TouchableOpacity>
      <TouchableOpacity className="py-2">
        <Text className="text-white text-lg">Create Auction</Text>
      </TouchableOpacity>
      <TouchableOpacity className="py-2">
        <Text className="text-white text-lg">Create Team</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose} className="absolute top-2 right-2">
        <Text className="text-white text-xl">✕</Text>
      </TouchableOpacity>
    </View>
  );
}