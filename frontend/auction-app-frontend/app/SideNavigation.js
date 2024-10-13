import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

export default function SideNavigation({ onClose }) {
  const router = useRouter();
  const pathname = usePathname();

  const NavItem = ({ route, label }) => (
    <TouchableOpacity 
      className={`py-3 px-4 rounded-md mb-3 ${pathname === route ? 'bg-green-600' : 'bg-gray-700'}`}
      onPress={() => {
        router.push(route);
        onClose();
      }}
    >
      <Text className={`text-lg ${pathname === route ? 'text-white font-bold' : 'text-gray-300'}`}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="absolute top-0 left-0 bottom-0 w-64 bg-gray-800 p-4">
      <TouchableOpacity onPress={onClose} className="absolute top-4 right-4">
        <Text className="text-white text-xl">✕</Text>
      </TouchableOpacity>
      <View className="mt-12">
        <NavItem route="/Dashboard" label="Dashboard" />
        <NavItem route="/ManageAuctions" label="Manage Auctions" />
        <NavItem route="/ManageTeams" label="Manage Teams" />
        <NavItem route="/PlayerProfile" label="Player Profile" />
      </View>
    </View>
  );
}
