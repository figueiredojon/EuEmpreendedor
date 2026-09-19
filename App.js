import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from './pages/Login';
import { useFonts } from 'expo-font';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import Routes from './routes';

export default function App() {
  let [fontsLoaded] = useFonts({
    PlusJakartaSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Routes/>
  );
}
