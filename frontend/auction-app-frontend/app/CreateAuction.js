import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authToken } from './LoginScreen';

export default function CreateAuction() {
  const router = useRouter();
  

  const [auctionForm, setAuctionForm] = useState({
    name: '',
    description: '',
    startDate: new Date(),
    startTime: new Date(),
    bidDuration: '',
    rulesFile: null,
    maxTeams: '',
    playersPerTeam: '',
    bidIncrement: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatDate = (date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    const year = date.getFullYear();
    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;
    return `${year}-${month}-${day}`;
  };

  const formatTime = (time) => {
    let hrs = time.getHours();
    let mins = time.getMinutes();
    hrs = hrs < 10 ? `0${hrs}` : `${hrs}`;
    mins = mins < 10 ? `0${mins}` : `${mins}`;
    return `${hrs}:${mins}`;
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'text/csv', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const rulesFile = {
          name: file.name.split(".")[0],
          extension: file.name.split(".")[1],
          uri: file.uri,
          size: file.size,
          type: file.mimeType,
        };

        const validExtensions = ['jpg', 'jpeg', 'csv', 'doc', 'docx', 'pdf', 'ppt', 'pptx'];
        if (validExtensions.includes(rulesFile.extension)) {
          setAuctionForm({ ...auctionForm, rulesFile });
        } else {
          Alert.alert("Invalid File", "Please select a file with .jpeg, .csv, .doc, .docx, .pdf, .ppt, .pptx extension.");
        }
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled file picker');
      } else {
        console.log('Error while selecting a file: ', error);
      }
    }
  };

  const handleCreateAuction = async () => {
    if (auctionForm.name === '' || auctionForm.description === '' || auctionForm.maxTeams === '' || auctionForm.playersPerTeam === '' || auctionForm.bidIncrement === '' || auctionForm.bidDuration === '') {
      Alert.alert('Error', 'All fields marked with * are required');
      return;
    }

    try {
      const startDateTime = new Date(
        auctionForm.startDate.getFullYear(),
        auctionForm.startDate.getMonth(),
        auctionForm.startDate.getDate(),
        auctionForm.startTime.getHours(),
        auctionForm.startTime.getMinutes()
      );

      const auctionData = {
        name: auctionForm.name,
        description: auctionForm.description,
        rules_file: "https://example.com/ipl2024_auction_rules.pdf", // Default URL for rules
        start_time: startDateTime.toISOString(),
        bid_duration: parseInt(auctionForm.bidDuration),
        max_teams: parseInt(auctionForm.maxTeams),
        players_per_team: parseInt(auctionForm.playersPerTeam),
        bid_increment: parseInt(auctionForm.bidIncrement),
        auctioneerId: "cuid1234567890" // Replace with actual auctioneer ID if available
      };

      console.log('Sending auction data:', JSON.stringify(auctionData));

      const response = await fetch('https://iplauctionbackend-1.onrender.com/api/auctions', {
        method: 'POST',
        body: JSON.stringify(auctionData),
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${authToken}`, // Uncomment if you have authentication
        },
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (response.ok) {
        Alert.alert('Success', 'Auction created successfully');
        router.push('/ManageAuctions');
      } else {
        const errorMessage = responseData.error || responseData.message || 'Failed to create auction';
        console.error('Server error:', errorMessage);
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Error creating auction:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please check the console for more details.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-black p-4">
      <Text className="text-white text-2xl font-bold mb-4">Create Auction</Text>
      
      <TextInput
        className="bg-gray-800 text-white p-2 rounded mb-4"
        placeholder="Auction Name*"
        placeholderTextColor="#999"
        value={auctionForm.name}
        onChangeText={(name) => setAuctionForm({...auctionForm, name})}
      />
      
      <TextInput
        className="bg-gray-800 text-white p-2 rounded mb-4"
        placeholder="Description*"
        placeholderTextColor="#999"
        multiline
        numberOfLines={4}
        value={auctionForm.description}
        onChangeText={(description) => setAuctionForm({...auctionForm, description})}
      />
      
      <Pressable onPress={() => setShowDatePicker(true)}>
        <TextInput
          className="bg-gray-800 text-white p-2 rounded mb-4"
          placeholder="Start Date*"
          placeholderTextColor="#999"
          value={formatDate(auctionForm.startDate)}
          editable={false}
        />
      </Pressable>
      
      {showDatePicker && (
        <DateTimePicker
          value={auctionForm.startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (selectedDate) setAuctionForm({...auctionForm, startDate: selectedDate});
          }}
          minimumDate={new Date()}
        />
      )}
      
      <Pressable onPress={() => setShowTimePicker(true)}>
        <TextInput
          className="bg-gray-800 text-white p-2 rounded mb-4"
          placeholder="Start Time*"
          placeholderTextColor="#999"
          value={formatTime(auctionForm.startTime)}
          editable={false}
        />
      </Pressable>
      
      {showTimePicker && (
        <DateTimePicker
          value={auctionForm.startTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(Platform.OS === 'ios');
            if (selectedTime) setAuctionForm({...auctionForm, startTime: selectedTime});
          }}
        />
      )}
      
      <TextInput
        className="bg-gray-800 text-white p-2 rounded mb-4"
        placeholder="Bid Duration (minutes)*"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={auctionForm.bidDuration}
        onChangeText={(bidDuration) => setAuctionForm({...auctionForm, bidDuration})}
      />
      
      <TextInput
        className="bg-gray-800 text-white p-2 rounded mb-4"
        placeholder="Max Teams*"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={auctionForm.maxTeams}
        onChangeText={(maxTeams) => setAuctionForm({...auctionForm, maxTeams})}
      />
      
      <TextInput
        className="bg-gray-800 text-white p-2 rounded mb-4"
        placeholder="Players per Team*"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={auctionForm.playersPerTeam}
        onChangeText={(playersPerTeam) => setAuctionForm({...auctionForm, playersPerTeam})}
      />
      
      <TextInput
        className="bg-gray-800 text-white p-2 rounded mb-4"
        placeholder="Bid Increment*"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={auctionForm.bidIncrement}
        onChangeText={(bidIncrement) => setAuctionForm({...auctionForm, bidIncrement})}
      />
      
      <TouchableOpacity
        className="bg-gray-800 p-2 rounded mb-4"
        onPress={pickDocument}
      >
        <Text className="text-white">
          {auctionForm.rulesFile ? 'File selected' : 'Select Rules File'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        className="bg-green-500 p-3 rounded"
        onPress={handleCreateAuction}
      >
        <Text className="text-white text-center font-bold">Create Auction</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}