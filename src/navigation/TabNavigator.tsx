import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';

// Importar as páginas
import HomePage from '../pages/HomePage';
import ValidaCupom from '@/pages/Cupom/validaCupom';
import ProfilePage from '../pages/ProfilePage';
import Login from '../pages/Login';

// Importar tipos
import { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

type IconName = keyof typeof Ionicons.glyphMap;

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, loading } = useAuth();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="initialRoute"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: IconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'megaphone' : 'megaphone-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Login':
              iconName = focused ? 'log-in' : 'log-in-outline';
              break;
            case 'ValidaCupom':
              iconName = focused ? 'qr-code' : 'qr-code-outline';
              break;
            case 'Profile':
              iconName = focused ? 'storefront' : 'storefront-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false
      })}
    >
      {isAuthenticated && !loading ? (
        <>
          <Tab.Screen
            name="Home"
            component={HomePage}
            options={{
              tabBarLabel: 'Campanhas',
            }}
          />
          <Tab.Screen
            name="ValidaCupom"
            component={ValidaCupom}
            options={{
              tabBarLabel: 'Validar Cupom',
            }}
          />

          <Tab.Screen
            name="Profile"
            component={ProfilePage}
            options={{
              tabBarLabel: 'Lojista',
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="Login"
            component={Login}
            options={{
              tabBarLabel: 'Login',
            }}
          />
        </>
      )}

    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffffff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 5,
    height: 80,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});