import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Import the local image
import image1 from '../assets/images/image1.png';

export default function LandingScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 justify-center items-center bg-black">
      {/* Image */}
      <View className="w-full h-1/3">
        <Image
          source={image1} // Use the imported image here
          style={{ width: '100%', height: '140%' }}
          resizeMode="cover" // Adjusts how the image fits in the space
        />
      </View>

      {/* Title */}
      <View className="flex-1 justify-center items-center">
        <Text className="text-6xl text-white font-bold">
          Premier
        </Text>
        <Text className=" text-6xl text-green-400">Bid</Text>
      </View>

      {/* Buttons */}
      <View className="absolute top-6 right-5 flex-row">
        <TouchableOpacity onPress={() => router.push('/RegisterScreen')} className="mr-4">
          <Text className="text-black text-lg bg-white ">Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/LoginScreen')}>
          <Text className="text-black text-lg bg-white">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}