import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login/LoginScreen';
import SplashScreen from '../screens/Splash/SplashScreen';
import TestScreen from '../screens/Test/TestScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import AboutScreen from '../screens/About/AboutScreen';
import AgeScreen from '../screens/Age/AgeScreen';
import HeightScreen from '../screens/Height/HeightScreen';
import WeightScreen from '../screens/Weight/WeightScreen';

export type RootStackParamList = {
  Test: undefined;
  Login: undefined;
  Splash: undefined;
  Register: undefined;
  Profile: undefined;
  About: undefined;
  Age: undefined;
  Height: undefined;
  Weight: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type AppNavigatorProps = {
  initialRouteName: keyof RootStackParamList;
};

export default function AppNavigator({ initialRouteName }: AppNavigatorProps) {
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Age"
        component={AgeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Height"
        component={HeightScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Weight"
        component={WeightScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Test"
        component={TestScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
