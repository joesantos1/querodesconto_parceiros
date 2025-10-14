import React, { useEffect, useState } from 'react';
import {
  ScrollView, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserById, updateUser } from '@/services/users';
import { Ionicons } from '@expo/vector-icons';
import { maskPhone, validateCPF, formatarDataTimestamp } from '@/utils/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { COLORS } from '@/constants';
import { RootStackParamList } from '@/types';
import { ButtonBack } from '@/components/ButtonBack';

const initialState = {
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
  endereco: '',
  cidade: '',
  estado: '',
  foto: '',
  data_nascimento: ''
};

export default function EditarDados() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { signOut, isAuthenticated, loading: authLoading } = useAuth();


  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
    }

    loadDataUser();

  }, [isAuthenticated]);

  async function loadDataUser() {
    try {

      if (!isAuthenticated) {
        return;
      }
      setLoading(true);
      const data = await getUserById();
      setForm(data);

    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar seus dados.');
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (field: string, value: string) => {
    if (field === 'telefone') value = maskPhone(value);
    if (field === 'estado') value = value.toUpperCase().slice(0, 2);
    if (field === 'apelido') {
      // Permite apenas letras minúsculas e números, sem espaços ou caracteres especiais
      value = value.replace(/[^a-z0-9]/g, '');
    }
    setForm({ ...form, [field]: value });
  };

  const validate = () => {
    if (form.cpf && !validateCPF(form.cpf)) return 'CPF inválido';
    if (form.endereco && form.endereco.length > 100) return 'Endereço muito longo';
    if (form.cidade && form.cidade.length > 40) return 'Cidade muito longa';
    return null;
  };

  const handleSave = async () => {
    const error = validate();
    if (error) {
      Alert.alert('Erro', error);
      return;
    }
    setSaving(true);
    try {

      // Para dados do usuário, enviar como JSON
      const userData = {
        telefone: form.telefone,
        endereco: form.endereco,
        cidade: form.cidade,
        estado: form.estado,
        data_nascimento: form.data_nascimento
      };

      await updateUser(userData);
      Alert.alert('Sucesso', 'Dados atualizados!');

      //refresh na pagina
      navigation.navigate('UserDados');

    } catch (e: any) {
      console.error('Erro ao salvar dados:', e.response.data.error || e.response.data.message);

      let errorMessage = e?.response?.data?.message || 'Erro ao atualizar dados';
      if (e?.message === 'Network Error') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }

      Alert.alert('Erro', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (

      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 16, color: '#ffd4b6ff' }}>Carregando...</Text>
      </SafeAreaView>

    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* Botão de voltar */}
      <ButtonBack goTo={'back'} />
      <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
      </View>
      <ScrollView contentContainerStyle={{
        padding: 24,
        paddingBottom: 140 // Espaço extra para a tab bar
      }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.primary, alignSelf: 'center', marginBottom: 16 }}>
          Meus Dados
        </Text>


        {/* Formulário */}
        <Text style={{ fontWeight: 'bold', color: '#8B4513', marginBottom: 2 }}>Nome</Text>
        <TextInput
          style={styles.input}
          value={form.nome}
          editable={false}
          placeholder="Nome"
        />
        <Text style={{ fontWeight: 'bold', color: '#8B4513', marginBottom: 2 }}>CPF</Text>
        <TextInput
          style={styles.input}
          value={form.cpf}
          editable={!form.cpf}
          placeholder="CPF"
          keyboardType="numeric"
          maxLength={14}
        />
        <Text style={{ fontWeight: 'bold', color: '#8B4513', marginBottom: 2 }}><Ionicons name="logo-whatsapp" size={14} color="black" /> Telefone (Whatsapp)</Text>
        <TextInput
          style={styles.input}
          value={form.telefone}
          onChangeText={v => handleChange('telefone', v)}
          placeholder="Telefone"
          keyboardType="phone-pad"
          maxLength={15}
        />
        <Text style={{ fontWeight: 'bold', color: '#8B4513', marginBottom: 2 }}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          editable={false}
          placeholder="E-mail"
          keyboardType="email-address"
        />
        <Text style={{ fontWeight: 'bold', color: '#8B4513', marginBottom: 2 }}>Endereço</Text>
        <TextInput
          style={styles.input}
          value={form.endereco}
          onChangeText={v => handleChange('endereco', v)}
          placeholder="Endereço"
          maxLength={100}
        />
        <Text style={{ fontWeight: 'bold', color: '#8B4513', marginBottom: 2 }}>Cidade</Text>
        <TextInput
          style={styles.input}
          value={form.cidade}
          onChangeText={v => handleChange('cidade', v)}
          placeholder="Cidade"
          maxLength={40}
        />
        <Text style={{ fontWeight: 'bold', color: '#8B4513', marginBottom: 2 }}>Estado</Text>
        <TextInput
          style={styles.input}
          value={form.estado}
          onChangeText={v => handleChange('estado', v)}
          placeholder="Estado"
          maxLength={2}
          autoCapitalize="characters"
        />
        <Text style={{ fontWeight: 'bold', color: '#8B4513', marginBottom: 2 }}>Data de Nascimento</Text>
        <TextInput
          style={styles.input}
          value={formatarDataTimestamp(form.data_nascimento)}
          onChangeText={v => handleChange('data_nascimento', v)}
          placeholder="Data de Nascimento"
          maxLength={10}
        />

        <TouchableOpacity
          style={{
            backgroundColor: saving ? '#FFA94D' : COLORS.primary,
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 24,
          }}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Salvar</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>

  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#333',
  },
};