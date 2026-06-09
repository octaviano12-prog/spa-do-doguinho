import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import PetsScreen from "../screens/PetsScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import AppointmentsScreen from "../screens/AppointmentsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();

const icons = {
  Home: "🏠",
  Pets: "🐶",
  Schedule: "📅",
  Appointments: "🛁",
  Profile: "👤"
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.backgroundSoft,
          borderTopColor: colors.border,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>{icons[route.name]}</Text>,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "800" }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Início" }} />
      <Tab.Screen name="Pets" component={PetsScreen} options={{ title: "Pets" }} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} options={{ title: "Agendar" }} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} options={{ title: "Agenda" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
    </Tab.Navigator>
  );
}
