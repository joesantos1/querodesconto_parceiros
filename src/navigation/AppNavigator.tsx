import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NewPass from '../pages/NewPass';
import CupomDetalhes from '../pages/Cupom/Detalhes';
import UserDados from '../pages/User/UserDados';
import UserTrocaSenha from '../pages/User/UserTrocaSenha';
import UserFaq from '../pages/User/UserFaq';
import CampanhasList from '../pages/Campanha/List';
import CampanhaCreateEdit from '../pages/Campanha/CreateEdit';
import CuponsList from '../pages/Cupom/List';
import CupomCreateEdit from '../pages/Cupom/createEdit';
import LojasList from '../pages/Loja/List';
import LojaCreateEdit from '../pages/Loja/CreateEdit';
import ColabTeam from '../pages/Loja/ColabTeam';
import { RootStackParamList } from '../types';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Stack para usuários não autenticados (Login / Register / NewPass)
  if (!isAuthenticated) {
    return (
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="NewPass" component={NewPass} />
      </Stack.Navigator>
    );
  }

  // Stack para usuários autenticados (aplicação)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="TabNavigator">
      <Stack.Screen name="CupomDetalhes" component={CupomDetalhes} />
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="UserDados" component={UserDados} />
      <Stack.Screen name="UserTrocaSenha" component={UserTrocaSenha} />
      <Stack.Screen name="UserFaq" component={UserFaq} />
      <Stack.Screen name="CampanhasList" component={CampanhasList} />
      <Stack.Screen name="CampanhaCreateEdit" component={CampanhaCreateEdit} />
      <Stack.Screen name="CuponsList" component={CuponsList} />
      <Stack.Screen name="CupomCreateEdit" component={CupomCreateEdit} />
      <Stack.Screen name="LojasList" component={LojasList} />
      <Stack.Screen name="LojaCreateEdit" component={LojaCreateEdit} />
      <Stack.Screen name="ColabTeam" component={ColabTeam} />
    </Stack.Navigator>
  );
}