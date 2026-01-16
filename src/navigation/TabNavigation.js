import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';

// Screens
import Home from '../Screens/Home';
import Doctor from '../Screens/Doctor';
import Appointment from '../Screens/Appointment';
import Profile from '../Screens/Profile';

const BottomTab = createBottomTabNavigator();

const TabNavigation = () => {
  const route = useRoute();

  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FF3D00',
          height: 75,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#555',
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      }}
    >
      
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Doctor"
        component={Doctor}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="stethoscope" color={color} size={size} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Appointment"
        component={Appointment}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-check" color={color} size={size} />
          ),
        }}
      />

      {/* Profile Tab With Passed Data */}
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        initialParams={{
          userData: route.params?.userData,   // form ka data
          photo: route.params?.photo,         // profile image
        }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />

    </BottomTab.Navigator>
  );
};

export default TabNavigation;
