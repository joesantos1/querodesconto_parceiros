import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { editPassword } from '@/services/users';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { COLORS } from '@/constants';
import { ButtonBack } from '@/components/ButtonBack';

export default function AlterarSenha() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const { signOut } = useAuth();

  const handleAlterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    if (novaSenha.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      await editPassword({ oldPassword: senhaAtual, newPassword: novaSenha });
      Alert.alert('Sucesso', 'Senha alterada com sucesso! Faça login novamente.', [
        { text: 'OK', onPress: () => { signOut(); navigation.navigate('Login'); } }
      ]);
    } catch (e: any) {
      let msg = e?.response?.data?.message || 'Erro ao alterar senha.';
      if (e?.message === 'Network Error') {
        msg = 'Erro de conexão. Verifique sua internet.';
      }
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ButtonBack goTo={'back'} />
      <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
      <Text style={styles.title}>Alterar Senha</Text>
      <Text>Digite sua senha atual:</Text>
      <TextInput
        style={styles.input}
        placeholder="Senha atual"
        secureTextEntry
        value={senhaAtual}
        onChangeText={setSenhaAtual}
      />

      <Text>Digite sua nova senha:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nova senha"
        secureTextEntry
        value={novaSenha}
        onChangeText={setNovaSenha}
      />
      <Text>Confirme sua nova senha:</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirmar nova senha"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleAlterarSenha}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Salvar</Text>}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={handleBack}
        disabled={loading}
      >
        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Voltar</Text>
      </TouchableOpacity>
      
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#333',
  },
  button: {
    backgroundColor: COLORS.secondary,
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
