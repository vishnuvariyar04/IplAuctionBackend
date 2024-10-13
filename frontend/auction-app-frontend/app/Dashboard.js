import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Home from './Home';
import Profile from './Profile';
import SideNavigation from './SideNavigation';
import CreateOptions from './CreateOptions';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Home');
  const [showSideNav, setShowSideNav] = useState(false);
  const [showCreateOptions, setShowCreateOptions] = useState(false);

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 bg-gray-800">
        <TouchableOpacity onPress={() => setShowSideNav(!showSideNav)}>
          <Text className="text-white text-2xl">☰</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Premier Bid</Text>
        <View style={{width: 24}} />
      </View>

      {/* Main Content */}
      <View className="flex-1">
        {activeTab === 'Home' ? <Home /> : <Profile />}
      </View>

      {/* Footer Tabs */}
      <View className="flex-row justify-around p-4 bg-gray-800">
        <TouchableOpacity onPress={() => setActiveTab('Home')}>
          <Text className={`text-lg ${activeTab === 'Home' ? 'text-green-400' : 'text-white'}`}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Profile')}>
          <Text className={`text-lg ${activeTab === 'Profile' ? 'text-green-400' : 'text-white'}`}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Side Navigation */}
      {showSideNav && (
        <View className="absolute top-0 left-0 bottom-0 right-0 bg-black bg-opacity-50">
          <SideNavigation onClose={() => setShowSideNav(false)} />
        </View>
      )}

      {/* Create Options */}
      {showCreateOptions && <CreateOptions onClose={() => setShowCreateOptions(false)} />}

      {/* Add Button */}
      <TouchableOpacity 
        className="absolute bottom-20 right-6 bg-green-400 rounded-full w-14 h-14 justify-center items-center"
        onPress={() => setShowCreateOptions(true)}
      >
        <Text className="text-white text-3xl">+</Text>
      </TouchableOpacity>
    </View>
  );
}
