import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ButtonBack } from '../../components/ButtonBack';
import { createLojaCreateEditStyles } from '../../styles/LojaCreateEditStyles';
import { getStoreById, createNewStore, updateStore } from '../../services/stores';
import { getCities } from '../../services/city';
import { LojaFormData, LojaFormErrors, Cidade } from '../../types';
import { COLORS } from '../../constants';

interface RouteParams {
  lojaId?: number;
}

export default function LojaCreateEdit() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lojaId } = (route.params as RouteParams) || {};
  const styles = createLojaCreateEditStyles();
  
  const [loading, setLoading] = useState(false);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [formData, setFormData] = useState<LojaFormData>({
    nome: '',
    endereco: '',
    cidade_id: 0,
    telefone1: '',
    telefone2: '',
    email: '',
    site: '',
    status: 1,
    logo: '',
    descricao: '',
    cnpj: '',
    localizacao_link: '',
  });
  const [errors, setErrors] = useState<LojaFormErrors>({});
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Refs para inputs
  const enderecoRef = useRef<TextInput>(null);
  const telefone1Ref = useRef<TextInput>(null);
  const telefone2Ref = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const siteRef = useRef<TextInput>(null);
  const cnpjRef = useRef<TextInput>(null);
  const descricaoRef = useRef<TextInput>(null);
  const localizacaoRef = useRef<TextInput>(null);

  useEffect(() => {
    loadCities();
    if (lojaId) {
      loadLoja();
    }
  }, [lojaId]);

  const loadCities = async () => {
    try {
      const response = await getCities();
      setCidades(response);
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
      Alert.alert('Erro', 'Não foi possível carregar as cidades');
    }
  };

  const loadLoja = async () => {
    if (!lojaId) return;
    
    setLoading(true);
    try {
      const loja = await getStoreById(lojaId.toString());
      setFormData({
        nome: loja.nome || '',
        endereco: loja.endereco || '',
        cidade_id: loja.cidade_id || 0,
        telefone1: loja.telefone1 || '',
        telefone2: loja.telefone2 || '',
        email: loja.email || '',
        site: loja.site || '',
        status: loja.status || 1,
        logo: loja.logo || '',
        descricao: loja.descricao || '',
        cnpj: loja.cnpj || '',
        localizacao_link: loja.localizacao_link || '',
      });
      setSelectedImage(loja.logo || '');
    } catch (error) {
      console.error('Erro ao carregar loja:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da loja');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: LojaFormErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório';
    }

    if (!formData.cidade_id || formData.cidade_id === 0) {
      newErrors.cidade_id = 'Cidade é obrigatória';
    }

    if (!formData.telefone1.trim()) {
      newErrors.telefone1 = 'Pelo menos um telefone é obrigatório';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.cnpj && !isValidCNPJ(formData.cnpj)) {
      newErrors.cnpj = 'CNPJ inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidCNPJ = (cnpj: string): boolean => {
    // Remove caracteres não numéricos
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
    return cleanCNPJ.length === 14;
  };

  const handleSave = async () => {
    Keyboard.dismiss();
    
    if (!validateForm()) {
      Alert.alert('Erro', 'Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        logo: selectedImage || formData.logo,
      };

      if (lojaId) {
        await updateStore(lojaId.toString(), dataToSave);
        Alert.alert('Sucesso', 'Loja atualizada com sucesso!');
      } else {
        await createNewStore(dataToSave);
        Alert.alert('Sucesso', 'Loja criada com sucesso!');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar loja:', error);
      Alert.alert('Erro', 'Não foi possível salvar a loja');
    } finally {
      setLoading(false);
    }
  };

  const selectImage = () => {
    Alert.alert(
      'Selecionar Logo',
      'Escolha uma opção:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Galeria', onPress: openImageLibrary },
        { text: 'Câmera', onPress: openCamera },
      ]
    );
  };

  const openImageLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Erro', 'Permissão para acessar a galeria é necessária');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Erro', 'Permissão para usar a câmera é necessária');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const selectCity = () => {
    const cityOptions = cidades.map(cidade => ({
      text: `${cidade.cidade} - ${cidade.estado}`,
      onPress: () => setFormData({ ...formData, cidade_id: cidade.id }),
    }));
    
    cityOptions.push({ text: 'Cancelar', onPress: () => {} });
    
    Alert.alert('Selecionar Cidade', 'Escolha uma cidade:', cityOptions);
  };

  const getSelectedCityName = () => {
    const cidade = cidades.find(c => c.id === formData.cidade_id);
    return cidade ? `${cidade.cidade} - ${cidade.estado}` : '';
  };

  const toggleStatus = () => {
    setFormData({ 
      ...formData, 
      status: formData.status === 1 ? 0 : 1 
    });
  };

  const getStatusColor = () => {
    return formData.status === 1 ? COLORS.success : COLORS.gray;
  };

  const getStatusText = () => {
    return formData.status === 1 ? 'ATIVO' : 'INATIVO';
  };

  if (loading && lojaId) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ButtonBack goTo="back" />
            <Text style={styles.headerTitle}>
              {lojaId ? 'Editar Loja' : 'Nova Loja'}
            </Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ButtonBack goTo="back" />
          <Text style={styles.headerTitle}>
            {lojaId ? 'Editar Loja' : 'Nova Loja'}
          </Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark" size={20} color={COLORS.white} />
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <Text style={styles.sectionTitle}>Logo da Loja</Text>
          <View style={styles.logoContainer}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.logoImage} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Ionicons name="image-outline" size={40} color={COLORS.gray} />
                <Text style={styles.logoPlaceholderText}>Logo</Text>
              </View>
            )}
            <TouchableOpacity style={styles.editLogoButton} onPress={selectImage}>
              <Ionicons name="camera" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
            <Ionicons name="cloud-upload-outline" size={20} color={COLORS.primary} />
            <Text style={styles.uploadButtonText}>
              {selectedImage ? 'Alterar Logo' : 'Adicionar Logo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dados Básicos */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Dados Básicos</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, styles.requiredLabel]}>
              Nome da Loja *
            </Text>
            <TextInput
              style={[styles.input, errors.nome && styles.inputError]}
              value={formData.nome}
              onChangeText={(text) => setFormData({ ...formData, nome: text })}
              placeholder="Digite o nome da loja"
              returnKeyType="next"
              onSubmitEditing={() => enderecoRef.current?.focus()}
            />
            {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, styles.requiredLabel]}>
              Endereço *
            </Text>
            <TextInput
              ref={enderecoRef}
              style={[styles.input, errors.endereco && styles.inputError]}
              value={formData.endereco}
              onChangeText={(text) => setFormData({ ...formData, endereco: text })}
              placeholder="Digite o endereço completo"
              returnKeyType="next"
              onSubmitEditing={() => telefone1Ref.current?.focus()}
            />
            {errors.endereco && <Text style={styles.errorText}>{errors.endereco}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, styles.requiredLabel]}>
              Cidade *
            </Text>
            <TouchableOpacity
              style={[styles.selectButton, errors.cidade_id && styles.selectButtonError]}
              onPress={selectCity}
            >
              <Text style={[
                styles.selectButtonText,
                !formData.cidade_id && styles.selectPlaceholder
              ]}>
                {getSelectedCityName() || 'Selecione uma cidade'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
            </TouchableOpacity>
            {errors.cidade_id && <Text style={styles.errorText}>{errors.cidade_id}</Text>}
          </View>
        </View>

        {/* Contato */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Contato</Text>
          
          <View style={styles.phoneContainer}>
            <View style={[styles.inputGroup, styles.phoneInput]}>
              <Text style={[styles.label, styles.requiredLabel]}>
                Telefone Principal *
              </Text>
              <TextInput
                ref={telefone1Ref}
                style={[styles.input, errors.telefone1 && styles.inputError]}
                value={formData.telefone1}
                onChangeText={(text) => setFormData({ ...formData, telefone1: text })}
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => telefone2Ref.current?.focus()}
              />
              {errors.telefone1 && <Text style={styles.errorText}>{errors.telefone1}</Text>}
            </View>

            <View style={[styles.inputGroup, styles.phoneInput]}>
              <Text style={styles.label}>Telefone Secundário</Text>
              <TextInput
                ref={telefone2Ref}
                style={styles.input}
                value={formData.telefone2}
                onChangeText={(text) => setFormData({ ...formData, telefone2: text })}
                placeholder="(11) 3333-3333"
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              ref={emailRef}
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="contato@loja.com"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => siteRef.current?.focus()}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Site</Text>
            <TextInput
              ref={siteRef}
              style={styles.input}
              value={formData.site}
              onChangeText={(text) => setFormData({ ...formData, site: text })}
              placeholder="www.loja.com"
              keyboardType="url"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => cnpjRef.current?.focus()}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CNPJ</Text>
            <TextInput
              ref={cnpjRef}
              style={[styles.input, errors.cnpj && styles.inputError]}
              value={formData.cnpj}
              onChangeText={(text) => setFormData({ ...formData, cnpj: text })}
              placeholder="00.000.000/0000-00"
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => localizacaoRef.current?.focus()}
            />
            {errors.cnpj && <Text style={styles.errorText}>{errors.cnpj}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Link de Localização</Text>
            <TextInput
              ref={localizacaoRef}
              style={styles.input}
              value={formData.localizacao_link}
              onChangeText={(text) => setFormData({ ...formData, localizacao_link: text })}
              placeholder="https://maps.google.com/..."
              keyboardType="url"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => descricaoRef.current?.focus()}
            />
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sobre a Loja</Text>
            <TextInput
              ref={descricaoRef}
              style={[styles.input, styles.textArea]}
              value={formData.descricao}
              onChangeText={(text) => setFormData({ ...formData, descricao: text })}
              placeholder="Descreva sua loja, produtos e serviços..."
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Status */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Status</Text>
          
          <TouchableOpacity style={styles.statusSection} onPress={toggleStatus}>
            <Text style={styles.statusLabel}>Status da Loja</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Preview */}
        {formData.nome && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Preview</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                {selectedImage ? (
                  <Image source={{ uri: selectedImage }} style={styles.previewLogo} />
                ) : (
                  <View style={[styles.previewLogo, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Ionicons name="storefront-outline" size={24} color={COLORS.gray} />
                  </View>
                )}
                
                <View style={styles.previewInfo}>
                  <Text style={styles.previewNome}>{formData.nome}</Text>
                  {formData.endereco && (
                    <Text style={styles.previewEndereco}>{formData.endereco}</Text>
                  )}
                  <Text style={styles.previewCidade}>{getSelectedCityName()}</Text>
                </View>
              </View>

              <View style={styles.previewContacts}>
                {formData.telefone1 && (
                  <Text style={styles.previewContact}>📞 {formData.telefone1}</Text>
                )}
                {formData.email && (
                  <Text style={styles.previewContact}>✉️ {formData.email}</Text>
                )}
              </View>

              {formData.descricao && (
                <Text style={styles.previewDescricao} numberOfLines={3}>
                  {formData.descricao}
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Salvando...</Text>
        </View>
      )}
    </View>
  );
}