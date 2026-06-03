import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { AreasScreen } from '../screens/AreasScreen';
import { AlertsScreen } from '../screens/AlertsScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { useThemeMode } from '../hooks/useThemeMode';
import { BottomTabParamList } from './navigationTypes';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const icons: Record<keyof BottomTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'grid',
  Areas: 'map',
  Alerts: 'warning',
  Reports: 'bar-chart',
  Favorites: 'star',
};

export function BottomTabs() {
  const { colors } = useThemeMode();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          height: 76,
          paddingBottom: 14,
          paddingTop: 8,
          paddingHorizontal: 6,
        },
        tabBarItemStyle: {
          minWidth: 68,
          paddingHorizontal: 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          lineHeight: 14,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icons[route.name]} size={Math.min(size, 24)} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Areas" component={AreasScreen} options={{ title: 'Areas' }} />
      <Tab.Screen name="Alerts" component={AlertsScreen} options={{ title: 'Alertas' }} />
      <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: 'Relatorios' }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoritos' }} />
    </Tab.Navigator>
  );
}
