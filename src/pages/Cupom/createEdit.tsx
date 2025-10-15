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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { 
  createCupom, 
  updateCupom, 
  getCupomById 
} from '@/services/cupons';
import { getMyCampanhas } from '@/services/campanhas';
import { Cupom, CupomFormData, Campanha, CupomStatus } from '@/types';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { Button } from '@/components/Button';
import { ButtonBack } from '@/components/ButtonBack';
import { createCupomCreateEditStyles } from '@/styles/CupomCreateEditStyles';

type RouteParams = {
  CupomCreateEdit: {
    cupomId?: number;
    campanhaId?: number;
  };
};

type CreateEditRouteProp = RouteProp<RouteParams, 'CupomCreateEdit'>;

const styles = createCupomCreateEditStyles();

export default function CupomCreateEdit() {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<CreateEditRouteProp>();
  const { cupomId, campanhaId } = route.params || {};
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  
  const [formData, setFormData] = useState<CupomFormData>({
    valor: 0,
    tipo: 'valor',
    qtd: 1,
    codigo: '',
    validade: 30,
    regras: [],
    campanha_id: campanhaId || 0,
    status: CupomStatus.ATIVO,
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const isEditing = !!cupomId;

  useEffect(() => {
    loadCampanhas();
    if (isEditing) {
      loadCupom();
    } else if (!formData.codigo) {
      generateCupomCode();
    }
  }, [cupomId]);

  const loadCampanhas = async () => {
    try {
      const data = await getMyCampanhas();
      setCampanhas(data || []);
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as campanhas');
    }
  };

  const loadCupom = async () => {
    try {
      setLoading(true);
      const cupom = await getCupomById(cupomId!);
      setFormData({
        valor: cupom.valor || 0,
        tipo: cupom.tipo === 'percentual' ? 'percentual' : 'valor',
        qtd: cupom.qtd || 1,
        codigo: cupom.codigo || '',
        validade: cupom.validade || 30,
        regras: cupom.regras || [],
        campanha_id: cupom.campanha_id || 0,
        status: cupom.status || CupomStatus.ATIVO,
      });
    } catch (error) {
      console.error('Erro ao carregar cupom:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do cupom');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const generateCupomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, codigo: result }));
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'Código é obrigatório';
    } else if (formData.codigo.length < 4) {
      newErrors.codigo = 'Código deve ter pelo menos 4 caracteres';
    }

    if (formData.valor <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero';
    } else if (formData.tipo === 'percentual' && formData.valor > 100) {
      newErrors.valor = 'Percentual não pode ser maior que 100%';
    }

    if (formData.qtd <= 0) {
      newErrors.qtd = 'Quantidade deve ser maior que zero';
    }

    if (formData.validade <= 0) {
      newErrors.validade = 'Validade deve ser maior que zero';
    }

    if (formData.campanha_id <= 0) {
      newErrors.campanha_id = 'Selecione uma campanha';
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
      
      const cupomData = {
        ...formData,
        codigo: formData.codigo.toUpperCase(),
      };

      if (isEditing) {
        await updateCupom(cupomId!, cupomData);
        Alert.alert('Sucesso', 'Cupom atualizado com sucesso');
      } else {
        await createCupom(cupomData);
        Alert.alert('Sucesso', 'Cupom criado com sucesso');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar cupom:', error);
      Alert.alert(
        'Erro', 
        isEditing 
          ? 'Não foi possível atualizar o cupom' 
          : 'Não foi possível criar o cupom'
      );
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (field: keyof CupomFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const adjustQuantity = (increment: boolean) => {
    const newQtd = increment 
      ? formData.qtd + 1 
      : Math.max(1, formData.qtd - 1);
    updateFormData('qtd', newQtd);
  };

  const formatValueInput = (text: string) => {
    // Remove caracteres não numéricos exceto vírgula e ponto
    const cleanText = text.replace(/[^0-9.,]/g, '');
    const numericValue = parseFloat(cleanText.replace(',', '.')) || 0;
    updateFormData('valor', numericValue);
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
          {isEditing ? 'Editar Cupom' : 'Novo Cupom'}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          
          {/* Informações Básicas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Básicas</Text>
            
            {/* Código */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Código do Cupom *</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <TextInput
                    style={[styles.input, errors.codigo && styles.inputError]}
                    value={formData.codigo}
                    onChangeText={(text) => updateFormData('codigo', text.toUpperCase())}
                    placeholder="DESCONTO2024"
                    maxLength={20}
                    autoCapitalize="characters"
                  />
                  {errors.codigo && <Text style={styles.errorText}>{errors.codigo}</Text>}
                </View>
                <TouchableOpacity
                  style={{ 
                    backgroundColor: COLORS.primary, 
                    padding: SPACING.sm, 
                    borderRadius: 8,
                    flex: 0,
                    paddingHorizontal: SPACING.md 
                  }}
                  onPress={generateCupomCode}
                >
                  <Ionicons name="refresh" size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              <Text style={styles.helpText}>
                Código único que os usuários utilizarão para resgatar o cupom
              </Text>
            </View>

            {/* Campanha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Campanha *</Text>
              <TouchableOpacity 
                style={[styles.input, errors.campanha_id && styles.inputError, { 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }]}
                onPress={() => {
                  // Aqui você pode implementar um modal ou navegação para seleção
                  const buttons = campanhas.map(campanha => ({
                    text: campanha.titulo,
                    onPress: () => updateFormData('campanha_id', campanha.id)
                  }));
                  buttons.push({ text: 'Cancelar', onPress: () => {} });
                  
                  Alert.alert(
                    'Selecionar Campanha',
                    'Selecione uma campanha',
                    buttons
                  );
                }}
              >
                <Text style={{ 
                  color: formData.campanha_id > 0 ? COLORS.dark : COLORS.gray,
                  fontSize: FONT_SIZES.md 
                }}>
                  {formData.campanha_id > 0 
                    ? campanhas.find(c => c.id === formData.campanha_id)?.titulo || 'Campanha não encontrada'
                    : 'Selecione uma campanha'
                  }
                </Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
              </TouchableOpacity>
              {errors.campanha_id && <Text style={styles.errorText}>{errors.campanha_id}</Text>}
            </View>
          </View>

          {/* Valor e Tipo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Desconto</Text>
            
            {/* Tipo do Cupom */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo do Desconto *</Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    formData.tipo === 'valor' && styles.typeButtonActive
                  ]}
                  onPress={() => updateFormData('tipo', 'valor')}
                >
                  <Text style={[
                    styles.typeButtonText,
                    formData.tipo === 'valor' && styles.typeButtonTextActive
                  ]}>
                    Valor (R$)
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    formData.tipo === 'percentual' && styles.typeButtonActive
                  ]}
                  onPress={() => updateFormData('tipo', 'percentual')}
                >
                  <Text style={[
                    styles.typeButtonText,
                    formData.tipo === 'percentual' && styles.typeButtonTextActive
                  ]}>
                    Percentual (%)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Valor */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {formData.tipo === 'valor' ? 'Valor do Desconto (R$) *' : 'Percentual de Desconto (%) *'}
              </Text>
              <View style={[styles.valueContainer, errors.valor && styles.inputError]}>
                {formData.tipo === 'valor' && (
                  <Text style={styles.currencySymbol}>R$</Text>
                )}
                <TextInput
                  style={styles.valueInput}
                  value={formData.valor.toString()}
                  onChangeText={formatValueInput}
                  placeholder={formData.tipo === 'valor' ? '10,00' : '15'}
                  keyboardType="numeric"
                />
                {formData.tipo === 'percentual' && (
                  <Text style={styles.percentSymbol}>%</Text>
                )}
              </View>
              {errors.valor && <Text style={styles.errorText}>{errors.valor}</Text>}
              <Text style={styles.helpText}>
                {formData.tipo === 'valor' 
                  ? 'Valor fixo em reais que será descontado'
                  : 'Percentual que será descontado do valor total'
                }
              </Text>
            </View>
          </View>

          {/* Quantidade e Validade */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disponibilidade</Text>
            
            {/* Quantidade */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantidade Disponível *</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    formData.qtd <= 1 && styles.quantityButtonDisabled
                  ]}
                  onPress={() => adjustQuantity(false)}
                  disabled={formData.qtd <= 1}
                >
                  <Ionicons 
                    name="remove" 
                    size={20} 
                    color={formData.qtd <= 1 ? COLORS.gray : COLORS.white} 
                  />
                </TouchableOpacity>
                
                <TextInput
                  style={[styles.input, styles.quantityInput]}
                  value={formData.qtd.toString()}
                  onChangeText={(text) => {
                    const qty = parseInt(text) || 1;
                    updateFormData('qtd', Math.max(1, qty));
                  }}
                  keyboardType="numeric"
                />
                
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => adjustQuantity(true)}
                >
                  <Ionicons name="add" size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              <Text style={styles.helpText}>
                Quantas vezes este cupom pode ser utilizado
              </Text>
            </View>

            {/* Validade */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Validade (dias) *</Text>
              <View style={styles.validadeContainer}>
                <TextInput
                  style={[styles.input, styles.validadeInput, errors.validade && styles.inputError]}
                  value={formData.validade.toString()}
                  onChangeText={(text) => {
                    const days = parseInt(text) || 1;
                    updateFormData('validade', Math.max(1, days));
                  }}
                  placeholder="30"
                  keyboardType="numeric"
                />
                <Text style={styles.validadeLabel}>dias</Text>
              </View>
              {errors.validade && <Text style={styles.errorText}>{errors.validade}</Text>}
              <Text style={styles.helpText}>
                Quantos dias o cupom será válido após ser resgatado
              </Text>
            </View>

            {/* Status */}
            <View style={styles.inputGroup}>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Cupom Ativo</Text>
                <Switch
                  value={formData.status === CupomStatus.ATIVO}
                  onValueChange={(value) => updateFormData('status', value ? CupomStatus.ATIVO : CupomStatus.INATIVO)}
                  thumbColor={formData.status === CupomStatus.ATIVO ? COLORS.primary : COLORS.gray}
                  trackColor={{
                    false: COLORS.grayLight,
                    true: COLORS.primary + '30',
                  }}
                />
              </View>
              <Text style={styles.switchDescription}>
                {formData.status === CupomStatus.ATIVO 
                  ? 'O cupom estará disponível para resgate' 
                  : 'O cupom não estará disponível para resgate'
                }
              </Text>
            </View>
          </View>

          {/* Preview */}
          {formData.codigo && formData.valor > 0 && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>Preview do Cupom</Text>
              <View style={styles.previewCard}>
                <Text style={styles.previewValue}>
                  {formData.tipo === 'valor' 
                    ? `R$ ${formData.valor.toFixed(2).replace('.', ',')}` 
                    : `${formData.valor}%`
                  }
                </Text>
                <Text style={styles.previewCode}>{formData.codigo}</Text>
              </View>
            </View>
          )}

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
              style={saving ? styles.saveButtonDisabled : styles.saveButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
