import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/styles/colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const myTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={myTheme}>
        <AppNavigator initialRouteName="Splash" />
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
