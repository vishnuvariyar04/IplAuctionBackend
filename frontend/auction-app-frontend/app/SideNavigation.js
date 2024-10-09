import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function SideNavigation({ onClose }) {
  const router = useRouter();

  return (
    <View className="absolute top-0 left-0 bottom-0 w-64 bg-gray-800 p-4">
      <TouchableOpacity onPress={onClose} className="absolute top-4 right-4">
        <Text className="text-white text-xl">✕</Text>
      </TouchableOpacity>
      <View className="mt-12">
        <TouchableOpacity className="py-2" onPress={() => router.push('/ManageAuctions')}>
          <Text className="text-white text-lg">Manage Auctions</Text>
        </TouchableOpacity>
        <TouchableOpacity className="py-2">
          <Text className="text-white text-lg">Manage Teams</Text>
        </TouchableOpacity>
        <TouchableOpacity className="py-2">
          <Text className="text-white text-lg">Player Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}