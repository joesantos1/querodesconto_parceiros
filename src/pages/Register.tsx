import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createUser, getIdUsuarioAfiliado } from '@/services/users';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { COLORS } from '@/constants';

export default function RegisterScreen() {
  const [form, setForm] = useState({
    email: '',
    pass: '',
    confirmaSenha: '',
    nome: '',
    telefone: '',
    //apelido: '',
    codigo: '',
  });
  const [loading, setLoading] = useState(false);
  const [IdUsuarioPai, setIdUsuarioPai] = useState('');
  const [NomeUsuarioPai, setNomeUsuarioPai] = useState('');
  const [showAfiliateInput, setShowAffiliateInput] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const auth = useAuth();
  //const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleChange = (field: string, value: string) => {
    if (field === 'apelido') {
      // Permite apenas letras minúsculas e números, sem espaços ou caracteres especiais
      value = value.replace(/[^a-z0-9]/g, '');
    }

    //Formatacao de mascara para telefone
    if (field === 'telefone') {
      value = value.replace(/\D/g, '');
      if (value.length > 10) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }

      //limita a 11 digitos numericos
      if (value.length > 15) {
        value = value.slice(0, 15);
      }
    }
    setForm({ ...form, [field]: value });
  };

  const handleAfiliateInput = () => {
    setShowAffiliateInput(!showAfiliateInput);
  }

  const validate = () => {
    if (!form.nome) return 'Nome é obrigatório';
    //if (!form.apelido) return 'Apelido é obrigatório';
    //if (!/^[a-zA-Z0-9]+$/.test(form.apelido)) return 'Apelido deve conter apenas letras e números';
    if (!form.email && !form.email.includes('@')) return 'E-mail inválido';
    if (!form.telefone && !form.email) return 'Telefone ou E-mail é obrigatório - informe pelo menos um deles para login.';
    if (!form.pass || form.pass.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
    if (form.pass !== form.confirmaSenha) return 'As senhas não coincidem';
    //if (!agreeToTerms) return 'Você deve aceitar os termos e condições';
    return null;
  };

  const handleRegister = async () => {
    const error = validate();
    if (error) {
      Alert.alert('Erro', error);
      return;
    }
    setLoading(true);
    try {
      //const normalizedApelido = form.apelido.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '');
      const userData = new FormData();
      const normalizedTelefone = form.telefone.replace(/\D/g, '');

      userData.append('email', form.email);
      userData.append('pass', form.pass);
      userData.append('telefone', normalizedTelefone);
      userData.append('nome', form.nome);
      //userData.append('apelido', normalizedApelido);
      userData.append('id_usuario_pai', IdUsuarioPai);

      await createUser(userData);
      //Alert.alert('Sucesso', 'Cadastro realizado! ');

      if (form.email || normalizedTelefone) {
        await auth.signIn(form.email, normalizedTelefone, form.pass);
      }
      //router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Erro', e?.response?.data?.message || e?.response?.data?.error ||  'Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleIdUsuarioPai = async (value: string) => {
    try {
      if (!value) {
        Alert.alert('Erro', 'Código de afiliado inválido');
        return;
      }
      setLoading(true);
      const r = await getIdUsuarioAfiliado(value);
      if (r) {
        setIdUsuarioPai(r.id);
        setNomeUsuarioPai(r.nome);
      }
    } catch (error) {
      setIdUsuarioPai('');
      setNomeUsuarioPai('');
      Alert.alert('Erro', 'Código de afiliado não encontrado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={24}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Ionicons name="person-add" size={40} color={COLORS.primary} />
            <Text style={styles.title}>Criar Conta (Lojista)</Text>
          </View>
          {/* Nome */}
          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            value={form.nome}
            onChangeText={v => handleChange('nome', v)}
            autoCapitalize="words"
          />
          {/* Email */}
          <Text style={styles.label}>Digite um E-mail:</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={v => handleChange('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {/* Telefone */}
          <Text style={styles.label}>Telefone (WhatsApp):</Text>
          <TextInput
            style={styles.input}
            value={form.telefone}
            onChangeText={v => handleChange('telefone', v)}
            keyboardType="phone-pad"
          />
          {/* Senha */}
          <Text style={styles.label}>Crie uma Senha:</Text>
          <TextInput
            style={styles.input}
            value={form.pass}
            onChangeText={v => handleChange('pass', v)}
            secureTextEntry
          />
          {/* Confirma Senha */}
          <Text style={styles.label}>Confirme a senha:</Text>
          <TextInput
            style={styles.input}
            value={form.confirmaSenha}
            onChangeText={v => handleChange('confirmaSenha', v)}
            secureTextEntry
          />

          <TouchableOpacity onPress={handleAfiliateInput}>
            <Text style={styles.affiliates}>
              <FontAwesome5 name="user-friends" size={16} color="brown" /> Informar código de Afiliados <Text style={{ fontWeight: 'bold' }}>(Opcional)</Text><Text style={{ fontStyle: 'italic' }}> - Não é obrigatório.</Text>
            </Text>
          </TouchableOpacity>

          {showAfiliateInput && (
            <View>
              <Text style={styles.affiliates}>
                Digite o código de afiliado (opcional):
              </Text>
              <TextInput
                style={styles.input}
                placeholder="xxxxx#00"
                placeholderTextColor="#B8865B"
                value={form.codigo}
                onChangeText={v => handleChange('codigo', v)}
              />
              {NomeUsuarioPai ? (
                <Text style={styles.affiliatesNome}>
                  Novo Afiliado de: <Text style={styles.affiliatesNomeSpan}> #{NomeUsuarioPai}</Text>
                </Text>
              ) : null}
              <TouchableOpacity
                style={styles.buttonBuscar}
                onPress={() => handleIdUsuarioPai(form.codigo)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Verificar indicação</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          {/*}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginVertical: 12 }}>
            <TouchableOpacity onPress={() => setAgreeToTerms(!agreeToTerms)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16 }}>
                {agreeToTerms ? '✅' : '⚪'} Aceito todos os
                <TouchableOpacity onPress={() => { Linking.openURL('https://gchamps.com/privacy'); }}>
                  <Text style={{ color: '#FF8C00', fontWeight: 'bold' }}> Termos e Condições</Text>
                </TouchableOpacity>
              </Text>
            </TouchableOpacity>
          </View>
*/}
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginLinkText}>Já tem conta? <Text style={{ color: COLORS.primary }}>Entrar</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 8,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#222',
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    elevation: 2,
  },
  buttonBuscar: {
    backgroundColor: 'brown',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 26,
    elevation: 2,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 17,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 8,
  },
  loginLinkText: {
    color: '#8B4513',
    fontSize: 15,
  },
  affiliates: {
    color: 'brown',
    fontSize: 15,
    marginBottom: 8,
    marginTop: 8,
  },
  affiliatesNome: {
    color: 'black',
    backgroundColor: '#FFF7E8',
    fontSize: 14,
    marginBottom: 8,
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'brown',
  },
  affiliatesNomeSpan: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
});
