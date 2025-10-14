import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { getNewPassword } from '@/services/users';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { COLORS } from '@/constants';

const NewPassScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleRequestNewPassword = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      await getNewPassword(email);
      setSuccess(true);
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível solicitar nova senha. Erro: ' + error?.response?.data?.message || error.message || 'Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitar Nova Senha</Text>
      <Text>Digite seu e-mail:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {!success && (
            <TouchableOpacity
        onPress={handleRequestNewPassword}
        disabled={loading || !email}
        style={{ marginTop: 16, backgroundColor: COLORS.primary, padding: 16, borderRadius: 6 }}
      >
        <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
          {loading ? 'Enviando...' : 'Solicitar Nova Senha'}
        </Text>
      </TouchableOpacity>
      )}
      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
      {success && (
        <Text style={styles.success}>
        Verifique seu email, você receberá uma nova senha provisória, use-a para acessar sua conta e altere-a imediatamente. Lembre de verificar a caixa de spam ou lixo eletrônico caso não veja o email na caixa de entrada.
        </Text>
      )}
      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary, { marginTop: 16 }]}
        onPress={handleBack}
        disabled={loading}
      >
        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 18,
    marginBottom: 16,
    fontSize: 16,
  },
  success: {
    color: 'green',
    marginTop: 24,
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonTextSecondary: {
    color: COLORS.primary,
  },
});

export default NewPassScreen;