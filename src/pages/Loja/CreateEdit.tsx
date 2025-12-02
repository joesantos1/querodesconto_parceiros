import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { ButtonBack } from '../../components/ButtonBack';
import { createLojaCreateEditStyles } from '../../styles/LojaCreateEditStyles';
import { getStoreToEditById, createNewStore, updateStore, getCategories, getStoreCategories, updateLogoStore } from '../../services/stores';
import { getCities } from '../../services/city';
import { LojaFormData, LojaFormErrors, Cidade, Categorias, Loja } from '../../types';
import { COLORS } from '../../constants';
import { validarEmail, isValidCNPJ, urlToLojasLogo } from '../../utils/utils';
import { normaSizes, SPACING } from '../../constants';

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
  const [categorias, setCategorias] = useState<Categorias[]>([]);
  const [formData, setFormData] = useState<LojaFormData>({
    nome: '',
    endereco: '',
    cidade_id: 0,
    telefone1: '',
    telefone2: 0,
    email: '',
    site: '',
    status: 1,
    descricao: '',
    cnpj: '',
    localizacao_link: '',
    categoria_ids: [],
  });
  const [errors, setErrors] = useState<LojaFormErrors>({});
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [categoryView, setCategoryView] = useState(false);
  const [foto, setFoto] = useState<string>('');
  const [fotoFile, setFotoFile] = useState<{ uri: string; name: string; type: string } | null>(null);

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
    loadCategories();

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

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategorias(response);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      Alert.alert('Erro', 'Não foi possível carregar as categorias');
    }
  };

  const loadLoja = async () => {
    if (!lojaId) return;

    setLoading(true);
    try {
      const loja = await getStoreToEditById(lojaId.toString()) as Loja;
      const lojaCategoriasIds = await getStoreCategories(lojaId.toString());
      setFormData({
        nome: loja.nome || '',
        endereco: loja.endereco || '',
        cidade_id: loja.cidade_id || 0,
        telefone1: loja.telefone1 || '',
        telefone2: loja.telefone2 || 0,
        email: loja.email || '',
        site: loja.site || '',
        status: loja.status || 1,
        descricao: loja.descricao || '',
        cnpj: loja.cnpj || '',
        localizacao_link: loja.localizacao_link || '',
        categoria_ids: lojaCategoriasIds || [],
      });
      setFoto(loja.logo || '');
    } catch (error) {
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

    if (formData.email && !validarEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.cnpj && !isValidCNPJ(formData.cnpj)) {
      newErrors.cnpj = 'CNPJ inválido';
    }

    if (!formData.categoria_ids || formData.categoria_ids.length === 0) {
      newErrors.categoria_ids = 'Selecione ao menos uma categoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    Keyboard.dismiss();

    if (!validateForm()) {
      Alert.alert('Erro', 'Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);
    try {
      //formata cnpj, telefone1 e telefone2 removendo caracteres especiais - deixa apenas os numeros
      const cnpj = formData.cnpj.replace(/\D/g, '');
      const telefone1 = formData.telefone1.replace(/\D/g, '');
      const telefone2 = formData.telefone2.toString().replace(/\D/g, '');
      const dataToSave = {
        ...formData,
        cnpj,
        telefone1,
        telefone2
      };

      if (lojaId) {
        await updateStore(lojaId.toString(), dataToSave);
        if (fotoFile) {
          const form = new FormData();
          form.append('logo', fotoFile as any);
          await updateLogoStore(lojaId.toString(), form);
        }
        Alert.alert('Sucesso', 'Loja atualizada com sucesso!');
      } else {
        const result = await createNewStore(dataToSave);
        if (fotoFile) {
          const form = new FormData();
          form.append('logo', fotoFile as any);
          await updateLogoStore(result.id.toString(), form);
        }
        Alert.alert('Sucesso', 'Loja criada com sucesso!');
      }

      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error.response.data?.message || 'Falha ao salvar loja.');
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
        { text: 'Galeria', onPress: handlePickImage },
        { text: 'Câmera', onPress: handleTakePhoto },
      ]
    );
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'É necessário permitir acesso à galeria.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.5,
        aspect: [1, 1],
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];

        // Corrigir URI para Android
        let uri = asset.uri;
        if (Platform.OS === 'android' && !uri.startsWith('file://')) {
          uri = 'file://' + uri;
        }

        // Garantir nome e type válidos
        const name = asset.fileName || `foto_${Date.now()}.jpg`;

        // Corrigir o type para sempre ser um MIME type válido
        let mimeType = asset.type === 'image' || !asset.type
          ? (name.endsWith('.png') ? 'image/png'
            : (name.endsWith('.jpg') || name.endsWith('.jpeg')) ? 'image/jpeg'
              : 'image/jpeg')
          : asset.type;

        setFoto(uri);
        setFotoFile({
          uri,
          name,
          type: mimeType,
        });
      }
    } catch (error) {
      //console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'É necessário permitir acesso à câmera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.5,
        aspect: [1, 1],
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];

        // Corrigir URI para Android
        let uri = asset.uri;
        if (Platform.OS === 'android' && !uri.startsWith('file://')) {
          uri = 'file://' + uri;
        }

        const name = asset.fileName || `camera_${Date.now()}.jpg`;

        // Corrigir o type para sempre ser um MIME type válido
        let mimeType = asset.type === 'image' || !asset.type
          ? (name.endsWith('.png') ? 'image/png'
            : (name.endsWith('.jpg') || name.endsWith('.jpeg')) ? 'image/jpeg'
              : 'image/jpeg')
          : asset.type;

        setFoto(uri);
        setFotoFile({
          uri,
          name,
          type: mimeType,
        });
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  };

  const selectCity = () => {
    const cityOptions = cidades.map(cidade => ({
      text: `${cidade.cidade} - ${cidade.estado}`,
      onPress: () => setFormData({ ...formData, cidade_id: cidade.id }),
    }));

    cityOptions.push({ text: 'Cancelar', onPress: () => { } });

    Alert.alert('Selecionar Cidade', 'Escolha uma cidade:', cityOptions);
  };

  const handleChange = (field: string, value: string) => {

    //Formatacao de mascara para telefone
    if (field === 'telefone1' || field === 'telefone2') {
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

    if (field === 'cnpj') {
      //Remove tudo que não é dígito
      value = value.replace(/\D/g, '');

      //Aplica a formatação 00.000.000/0000-00
      if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      }
      if (value.length > 6) {
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      }
      if (value.length > 10) {
        value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
      }
      if (value.length > 14) {
        value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
      }

      //Limita a 14 dígitos (18 caracteres com formatação)
      if (value.replace(/\D/g, '').length > 14) {
        value = value.slice(0, 18);
      }
    }

    setFormData({ ...formData, [field]: value });
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

  const toggleCategory = (categoryId: number) => {
    const isSelected = formData.categoria_ids?.includes(categoryId);
    let updatedCategories: number[] = [];

    if (isSelected) {
      updatedCategories = formData.categoria_ids?.filter(id => id !== categoryId) || [];
    } else {
      updatedCategories = [...(formData.categoria_ids || []), categoryId];
    }

    setFormData({
      ...formData,
      categoria_ids: updatedCategories
    });
    setCategoryView(false);
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
    <SafeAreaView style={styles.container}>
      <ButtonBack goTo="back" />
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
            {foto ? (
              <Image
                source={fotoFile ? { uri: fotoFile.uri } : urlToLojasLogo(foto)}
                style={styles.logoImage}
                contentFit="cover"
                transition={500}
              />
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
              {foto ? 'Alterar Logo' : 'Adicionar Logo'}
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
              Categorias *
            </Text>
            {categoryView && (
              categorias.map((categoria) =>
                <TouchableOpacity
                  key={categoria.id}
                  style={[
                    styles.categoryButton, { backgroundColor: categoria.cor || COLORS.primary }
                  ]}
                  onPress={() => toggleCategory(categoria.id)}
                >
                  <Text style={styles.categoryButtonText}><Ionicons name="add-circle-outline" size={16} /> {categoria.nome}</Text>
                </TouchableOpacity>
              )
            )}
            {formData.categoria_ids && formData.categoria_ids?.length > 0 && (
              <View style={styles.categoryContainer}>
                {categorias.map((categoria) => (
                  formData.categoria_ids?.includes(categoria.id) ? (
                    <TouchableOpacity
                      key={categoria.id}
                      style={[
                        styles.categoryButton, { backgroundColor: categoria.cor || COLORS.primary }
                      ]}
                      onPress={() => toggleCategory(categoria.id)}
                    >
                      <Text style={styles.categoryButtonText}><Ionicons name="remove-circle-outline" size={16} /> {categoria.nome}</Text>
                    </TouchableOpacity>
                  ) : null
                ))}
              </View>
            )}
            <TouchableOpacity
              style={[styles.selectButton, { marginTop: SPACING.sm }]}
              onPress={() => setCategoryView(!categoryView)}
            >
              <Text style={[
                styles.selectButtonText,
                !formData.categoria_ids?.length && styles.selectPlaceholder
              ]}>
                Selecione as Categorias
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
            </TouchableOpacity>

            {errors.categoria_ids && <Text style={styles.errorText}>{errors.categoria_ids}</Text>}
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
                onChangeText={v => handleChange('telefone1', v)}
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
                value={formData.telefone2?.toString() || ''}
                onChangeText={(text) => handleChange('telefone2', text)}
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
              onChangeText={(text) => handleChange('cnpj', text)}
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
                {foto || fotoFile ? (
                  <Image source={fotoFile ? { uri: fotoFile.uri } : urlToLojasLogo(foto)} contentFit='cover' style={styles.previewLogo} />
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
    </SafeAreaView>
  );
}