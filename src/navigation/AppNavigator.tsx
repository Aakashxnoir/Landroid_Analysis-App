import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';
import { DESIGN_SYSTEM } from '../styles/designSystem';
import { Ionicons } from '@expo/vector-icons';

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import OTPScreen from '../screens/Auth/OTPScreen';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';

// App Screens
import HomeScreen from '../screens/App/HomeScreen';
import AnalysisScreen from '../screens/App/AnalysisScreen';
import ListingsScreen from '../screens/App/ListingsScreen';
import ProfileScreen from '../screens/App/ProfileScreen';

// Common UI
import { LoadingOverlay } from '../components/common/LoadingOverlay';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Analysis') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Listings') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: DESIGN_SYSTEM.COLORS.PRIMARY,
        tabBarInactiveTintColor: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: DESIGN_SYSTEM.COLORS.BORDER,
          backgroundColor: 'white',
          ...DESIGN_SYSTEM.SHADOWS.SMALL,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Analysis" component={AnalysisScreen} />
      <Tab.Screen name="Listings" component={ListingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, onboardingRequired, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {isAuthenticated ? (
          onboardingRequired ? (
            // User is logged in but hasn't completed onboarding
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : (
            // User is fully authenticated and onboarded
            <Stack.Screen name="Main" component={TabNavigator} />
          )
        ) : (
          // Use is not logged in: Auth Flow
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
