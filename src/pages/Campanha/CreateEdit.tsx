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
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { formatarDataTimeStampToPtBr } from '@/utils/utils';
import {
  createCampanha,
  updateCampanha,
  getCampanhaById
} from '@/services/campanhas';
import { getMyStores } from '@/services/stores';
import { Campanha, CampanhaFormData, CampanhaStatus, Loja } from '@/types';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { Button } from '@/components/Button';
import { ButtonBack } from '@/components/ButtonBack';
import { createCampanhaCreateEditStyles } from '@/styles/CampanhaCreateEditStyles';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const [stores, setStores] = useState<Loja[]>([]);
  const { campanhaId } = route.params || {};
  const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
  const [showTimePickerInicio, setShowTimePickerInicio] = useState(false);
  const [showDatePickerFim, setShowDatePickerFim] = useState(false);
  const [showTimePickerFim, setShowTimePickerFim] = useState(false);
  const [storeModalVisible, setStoreModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<CampanhaFormData>({
    loja_id: 0,
    titulo: '',
    descricao: '',
    data_inicio: String(new Date()),
    data_fim: String(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 dias a partir de hoje
    status: CampanhaStatus.ATIVA,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditing = !!campanhaId;

  useEffect(() => {
    fetchStores();
    if (isEditing) {
      loadCampanha();
    }
  }, [campanhaId]);

  const fetchStores = async () => {
    try {
      const data = await getMyStores();
      setStores(data);

    } catch (error) {
      console.error('Erro ao carregar lojas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as lojas');
    }
  };

  const loadCampanha = async () => {
    try {
      setLoading(true);
      const campanha = await getCampanhaById(campanhaId!);
      setFormData({
        loja_id: campanha.loja_id || '',
        titulo: campanha.titulo || '',
        descricao: campanha.descricao || '',
        data_inicio: campanha.data_inicio,
        data_fim: campanha.data_fim,
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
    const newErrors: { [key: string]: string } = {};

    if (!formData.loja_id) {
      newErrors.loja_id = 'Loja é obrigatória';
    }

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (formData.data_fim <= formData.data_inicio) {
      newErrors.data_fim = 'Data de fim deve ser posterior à data de início';
    }

    if (new Date(formData.data_inicio) < new Date(new Date().setHours(0, 0, 0, 0))) {
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
        loja_id: formData.loja_id,
        descricao: formData.descricao.trim(),
        data_inicio: formData.data_inicio,
        data_fim: formData.data_fim,
        status: formData.status,
      };

      if (isEditing) {
        await updateCampanha(campanhaId!, campanhaData);
        Alert.alert('Sucesso', 'Campanha atualizada com sucesso');
      } else {
        console.log('Dados da campanha a serem salvos:', campanhaData);
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

  const handleDateChange = (field: 'data_inicio' | 'data_fim', dateString: string) => {
    if (dateString) {
      const date = new Date(dateString);
      updateFormData(field, date);
    }
  };

  const formatDateToDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTimeToDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleDateSelection = (field: 'data_inicio' | 'data_fim', selectedDate: Date) => {
    const currentDate = formData[field] ? new Date(formData[field]) : new Date();

    // Manter o horário existente, mas atualizar a data
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      currentDate.getHours(),
      currentDate.getMinutes()
    );

    const yyyy = newDate.getFullYear();
    const mm = String(newDate.getMonth() + 1).padStart(2, '0');
    const dd = String(newDate.getDate()).padStart(2, '0');
    const hh = String(newDate.getHours()).padStart(2, '0');
    const min = String(newDate.getMinutes()).padStart(2, '0');

    updateFormData(field, `${yyyy}-${mm}-${dd} ${hh}:${min}`);
  };

  const handleTimeSelection = (field: 'data_inicio' | 'data_fim', selectedTime: Date) => {
    const currentDate = formData[field] ? new Date(formData[field]) : new Date();

    // Manter a data existente, mas atualizar o horário
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );

    const yyyy = newDate.getFullYear();
    const mm = String(newDate.getMonth() + 1).padStart(2, '0');
    const dd = String(newDate.getDate()).padStart(2, '0');
    const hh = String(newDate.getHours()).padStart(2, '0');
    const min = String(newDate.getMinutes()).padStart(2, '0');

    updateFormData(field, `${yyyy}-${mm}-${dd} ${hh}:${min}`);
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
        <ButtonBack goTo="back" type={2} />
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Campanha' : 'Nova Campanha'}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Seleciona Loja */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Loja *</Text>
            <View style={[styles.pickerContainer, errors.loja_id && styles.inputError]}>
              <Picker
                selectedValue={formData.loja_id}
                onValueChange={(itemValue) => updateFormData('loja_id', itemValue)}
                style={styles.picker}
              >
                <Picker.Item key={0} label={'Selecione uma loja'} value={null} />
                {stores.map((store) => (
                  <Picker.Item key={store.id} label={store.nome} value={store.id} />
                ))}
              </Picker>
            </View>
          </View>

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

            <View style={styles.dateTimeContainer}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePickerInicio(true)}
              >
                <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                <Text style={styles.dateTimeButtonText}>
                  {formatDateToDisplay(formData.data_inicio) || 'Selecionar Data'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePickerInicio(true)}
              >
                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                <Text style={styles.dateTimeButtonText}>
                  {formatTimeToDisplay(formData.data_inicio) || 'Selecionar Hora'}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePickerInicio && (
              <DateTimePicker
                value={formData.data_inicio ? new Date(formData.data_inicio) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, selectedDate) => {
                  setShowDatePickerInicio(false);
                  if (selectedDate) {
                    handleDateSelection('data_inicio', selectedDate);
                  }
                }}
                minimumDate={new Date()}
              />
            )}

            {showTimePickerInicio && (
              <DateTimePicker
                value={formData.data_inicio ? new Date(formData.data_inicio) : new Date()}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, selectedTime) => {
                  setShowTimePickerInicio(false);
                  if (selectedTime) {
                    handleTimeSelection('data_inicio', selectedTime);
                  }
                }}
              />
            )}

            {errors.data_inicio && <Text style={styles.errorText}>{errors.data_inicio}</Text>}
          </View>

          {/* Data de Fim */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Fim *</Text>

            <View style={styles.dateTimeContainer}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePickerFim(true)}
              >
                <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                <Text style={styles.dateTimeButtonText}>
                  {formatDateToDisplay(formData.data_fim) || 'Selecionar Data'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePickerFim(true)}
              >
                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                <Text style={styles.dateTimeButtonText}>
                  {formatTimeToDisplay(formData.data_fim) || 'Selecionar Hora'}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePickerFim && (
              <DateTimePicker
                value={formData.data_fim ? new Date(formData.data_fim) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, selectedDate) => {
                  setShowDatePickerFim(false);
                  if (selectedDate) {
                    handleDateSelection('data_fim', selectedDate);
                  }
                }}
                minimumDate={new Date()}
              />
            )}

            {showTimePickerFim && (
              <DateTimePicker
                value={formData.data_fim ? new Date(formData.data_fim) : new Date()}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, selectedTime) => {
                  setShowTimePickerFim(false);
                  if (selectedTime) {
                    handleTimeSelection('data_fim', selectedTime);
                  }
                }}
              />
            )}

            {errors.data_fim && <Text style={styles.errorText}>{errors.data_fim}</Text>}
          </View>

          {/* Status -- */}
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
