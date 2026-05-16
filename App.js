// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import HomeScreen       from './src/screens/HomeScreen';
import MoodInputScreen  from './src/screens/MoodInputScreen';
import MoodLoadingScreen from './src/screens/MoodLoadingScreen';
import MoodResultsScreen from './src/screens/MoodResultsScreen';
import HotelDetailScreen from './src/screens/HotelDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="Home"         component={HomeScreen} />
          <Stack.Screen name="MoodInput"    component={MoodInputScreen} />
          <Stack.Screen name="MoodLoading"  component={MoodLoadingScreen} options={{ animation: 'fade' }} />
          <Stack.Screen name="MoodResults"  component={MoodResultsScreen} />
          <Stack.Screen name="HotelDetail"  component={HotelDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
