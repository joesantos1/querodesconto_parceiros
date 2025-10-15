import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { 
  createCampanha, 
  updateCampanha, 
  getCampanhaById 
} from '@/services/campanhas';
import { Campanha, CampanhaFormData, CampanhaStatus } from '@/types';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { Button } from '@/components/Button';
import { ButtonBack } from '@/components/ButtonBack';
import { createCampanhaCreateEditStyles } from '@/styles/CampanhaCreateEditStyles';

type RouteParams = {
  CampanhaCreateEdit: {
    campanhaId?: number;
  };
};

type CreateEditRouteProp = RouteProp<RouteParams, 'CampanhaCreateEdit'>;

const styles = createCampanhaCreateEditStyles();

export default function CampanhaCreateEdit() {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<CreateEditRouteProp>();
  const { campanhaId } = route.params || {};
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<CampanhaFormData>({
    titulo: '',
    descricao: '',
    data_inicio: new Date(),
    data_fim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias a partir de hoje
    status: CampanhaStatus.ATIVA,
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const isEditing = !!campanhaId;

  useEffect(() => {
    if (isEditing) {
      loadCampanha();
    }
  }, [campanhaId]);

  const loadCampanha = async () => {
    try {
      setLoading(true);
      const campanha = await getCampanhaById(campanhaId!);
      setFormData({
        titulo: campanha.titulo || '',
        descricao: campanha.descricao || '',
        data_inicio: new Date(campanha.data_inicio),
        data_fim: new Date(campanha.data_fim),
        status: campanha.status || 1,
      });
    } catch (error) {
      console.error('Erro ao carregar campanha:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da campanha');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (formData.data_fim <= formData.data_inicio) {
      newErrors.data_fim = 'Data de fim deve ser posterior à data de início';
    }

    if (formData.data_inicio < new Date(new Date().setHours(0, 0, 0, 0))) {
      newErrors.data_inicio = 'Data de início não pode ser anterior a hoje';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      const campanhaData = {
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        data_inicio: formData.data_inicio.toISOString(),
        data_fim: formData.data_fim.toISOString(),
        status: formData.status,
      };

      if (isEditing) {
        await updateCampanha(campanhaId!, campanhaData);
        Alert.alert('Sucesso', 'Campanha atualizada com sucesso');
      } else {
        await createCampanha(campanhaData);
        Alert.alert('Sucesso', 'Campanha criada com sucesso');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar campanha:', error);
      Alert.alert(
        'Erro', 
        isEditing 
          ? 'Não foi possível atualizar a campanha' 
          : 'Não foi possível criar a campanha'
      );
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (field: keyof CampanhaFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (field: 'data_inicio' | 'data_fim', dateString: string) => {
    if (dateString) {
      const date = new Date(dateString);
      updateFormData(field, date);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ButtonBack goTo="back" />
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Campanha' : 'Nova Campanha'}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Título */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={[styles.input, errors.titulo && styles.inputError]}
              value={formData.titulo}
              onChangeText={(text) => updateFormData('titulo', text)}
              placeholder="Digite o título da campanha"
              maxLength={100}
            />
            {errors.titulo && <Text style={styles.errorText}>{errors.titulo}</Text>}
          </View>

          {/* Descrição */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição *</Text>
            <TextInput
              style={[styles.textArea, errors.descricao && styles.inputError]}
              value={formData.descricao}
              onChangeText={(text) => updateFormData('descricao', text)}
              placeholder="Digite a descrição da campanha"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            {errors.descricao && <Text style={styles.errorText}>{errors.descricao}</Text>}
            <Text style={styles.characterCount}>
              {formData.descricao.length}/500
            </Text>
          </View>

          {/* Data de Início */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Início *</Text>
            <TextInput
              style={[styles.input, errors.data_inicio && styles.inputError]}
              value={formatDateForInput(formData.data_inicio)}
              onChangeText={(text) => handleDateChange('data_inicio', text)}
              placeholder="YYYY-MM-DD"
            />
            {errors.data_inicio && <Text style={styles.errorText}>{errors.data_inicio}</Text>}
          </View>

          {/* Data de Fim */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Fim *</Text>
            <TextInput
              style={[styles.input, errors.data_fim && styles.inputError]}
              value={formatDateForInput(formData.data_fim)}
              onChangeText={(text) => handleDateChange('data_fim', text)}
              placeholder="YYYY-MM-DD"
            />
            {errors.data_fim && <Text style={styles.errorText}>{errors.data_fim}</Text>}
          </View>

          {/* Status */}
          <View style={styles.inputGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Campanha Ativa</Text>
              <Switch
                value={formData.status === CampanhaStatus.ATIVA}
                onValueChange={(value) => updateFormData('status', value ? CampanhaStatus.ATIVA : CampanhaStatus.INATIVA)}
                thumbColor={formData.status === CampanhaStatus.ATIVA ? COLORS.primary : COLORS.gray}
                trackColor={{
                  false: COLORS.grayLight,
                  true: COLORS.primary + '30',
                }}
              />
            </View>
            <Text style={styles.switchDescription}>
              {formData.status === CampanhaStatus.ATIVA ? 'A campanha estará visível para os usuários' : 'A campanha não estará visível para os usuários'}
            </Text>
          </View>

          {/* Botões */}
          <View style={styles.buttonContainer}>
            <Button
              title="Cancelar"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title={saving ? 'Salvando...' : 'Salvar'}
              onPress={handleSave}
              disabled={saving}
              style={styles.saveButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
