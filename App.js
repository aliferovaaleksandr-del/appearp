import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import HomeScreen      from './src/screens/HomeScreen';
import MoodInputScreen from './src/screens/MoodInputScreen';
import ResultsScreen   from './src/screens/ResultsScreen';
import ConciergeScreen from './src/screens/ConciergeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="Home"      component={HomeScreen} />
          <Stack.Screen name="Input"     component={MoodInputScreen} />
          <Stack.Screen name="Results"   component={ResultsScreen} />
          <Stack.Screen name="Concierge" component={ConciergeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
