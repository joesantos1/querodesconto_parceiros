import React, { useEffect, useState } from 'react';
import {
  ScrollView, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLojistaById, updateLojista } from '@/services/users';
import { Ionicons } from '@expo/vector-icons';
import { maskPhone, validateCPF, formatarDataTimestamp } from '@/utils/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { COLORS } from '@/constants';
import { RootStackParamList } from '@/types';
import { Shopkeeper } from '@/types/lojista';
import { ButtonBack } from '@/components/ButtonBack';

export default function EditarDados() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [form, setForm] = useState<Shopkeeper>({
    nome: '',
    email: '',
    telefone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();


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
      const data = await getLojistaById();
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
    setForm({ ...form, [field]: value });
  };

  const validate = () => {
    if (!form.nome || form.nome.trim().length < 3) {
      return 'O nome deve ter pelo menos 3 caracteres.';
    }
    if (!form.telefone || form.telefone.trim().length < 10) {
      return 'O telefone deve ter pelo menos 10 caracteres.';
    }
  };

  const handleSave = async () => {
    setSaving(true);

    //Validação de nome e telefone
    const error = validate();
    if (error) {
      Alert.alert('Erro', error);
      return;
    }

    try {

      // Para dados do usuário, enviar como JSON
      //formata telefone para remover caracteres especiais

      const telefoneFormatado = form.telefone.replace(/\D/g, '');
      const userData = {
        telefone: telefoneFormatado,
        nome: form.nome
      };

      await updateLojista(userData);
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
          onChangeText={v => handleChange('nome', v)}
          placeholder="Nome"
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