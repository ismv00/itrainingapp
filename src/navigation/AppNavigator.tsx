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
import WorkoutScreen from '../screens/Workout/WorkoutScreen';
import NewWorkoutScreen from '../screens/Workout/NewWorkoutScreen';
import NewWorkoutHeaderScreen from '../screens/Workout/NewWorkoutHeaderScreen';
import ExerciseDetailModal from '../components/ExerciseDetailModal';

export type RootStackParamList = {
  Test: undefined;
  Login: undefined;
  Splash: undefined;
  Register: undefined;
  Profile: undefined;
  About: undefined;
  Age: { gender: string };
  Height: { gender: string; age: string };
  Weight: { gender: string; age: string; height: string };
  Workout: undefined;
  NewWorkoutHeader: undefined;
  NewWorkout: {
    name: string;
    description: string;
    days: string[];
  };

  ExerciseDetailModal: {
    exerciseName: string;
    onSave: (details: {
      sets: number;
      reps: string;
      initialWeight: number;
      finalWeight: number;
    }) => void;
  };
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
        name="Workout"
        component={WorkoutScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="NewWorkoutHeader"
        component={NewWorkoutHeaderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewWorkout"
        component={NewWorkoutScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ExerciseDetailModal"
        component={ExerciseDetailModal}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
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
