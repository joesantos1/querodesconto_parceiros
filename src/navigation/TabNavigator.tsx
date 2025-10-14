import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';

// Importar as páginas
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import MeusCuponsPage from '../pages/MeusCuponsPage';
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
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: IconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'storefront' : 'storefront-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Login':
              iconName = focused ? 'log-in' : 'log-in-outline';
              break;
            case 'MeusCupons':
              iconName = focused ? 'qr-code' : 'qr-code-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: styles.tabBar, height: Platform.OS === 'ios' ? 70 + insets.bottom : insets.bottom + 60,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarLabel: 'Início',
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchPage}
        options={{
          tabBarLabel: 'Buscar',
        }}
      />

      {isAuthenticated ? (
        <>
          <Tab.Screen
            name="MeusCupons"
            component={MeusCuponsPage}
            options={{
              tabBarLabel: 'Meus Cupons',
            }}
          />

          <Tab.Screen
            name="Profile"
            component={ProfilePage}
            options={{
              tabBarLabel: 'Perfil',
            }}
          />
        </>
      ) : (
        <Tab.Screen
          name="Login"
          component={Login}
          options={{
            tabBarLabel: 'Login',
          }}
        />
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});