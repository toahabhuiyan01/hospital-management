import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';

import HospitalListScreen from './src/screens/main/HospitalListScreen';
import HospitalDetailScreen from './src/screens/main/HospitalDetailScreen';
import BookingScreen from './src/screens/main/BookingScreen';
import BookingsListScreen from './src/screens/main/BookingsListScreen';

import { AuthProvider, useAuth } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Hospitals') {
          iconName = focused ? 'medical' : 'medical-outline';
        } else if (route.name === 'Bookings') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Hospitals" component={HospitalStackNavigator} />
    <Tab.Screen name="Bookings" component={BookingsListScreen} />
  </Tab.Navigator>
);

const HospitalStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HospitalList" component={HospitalListScreen} options={{ title: 'Hospitals' }} />
    <Stack.Screen name="HospitalDetail" component={HospitalDetailScreen} options={{ title: 'Hospital Details' }} />
    <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Book Appointment' }} />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { userToken } = useAuth();

  return (
    <NavigationContainer>
      {userToken ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <RootNavigator />
      </PaperProvider>
    </AuthProvider>
  );
}