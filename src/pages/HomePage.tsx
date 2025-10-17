import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { createStyles } from '@/styles/HomeStyles';
import { getAllCampanhas } from '@/services/campanhas';
import { getCategories } from '@/services/stores';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList, CampanhasHome, Categorias } from '@/types';
import { urlToLojasLogo, formatNumber, checkDateToEnd } from '@/utils/utils';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, normaSizes } from '@/constants';
import TimeToEnd from '@/components/TimeToEnd';
import { useAuth } from '@/contexts/AuthContext';

const styles = createStyles();
const { width } = Dimensions.get('window');

export default function HomePage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [campanhas, setCampanhas] = useState<CampanhasHome[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [userNome, setUserNome] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Categorias[]>([]);
  const [categoriesSelected, setCategoriesSelected] = useState<Categorias | null>(null);
  const campanhasRef = useRef<CampanhasHome[]>([]);

  const fetchCampanhas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllCampanhas();
      campanhasRef.current = data.campaigns || [];
      setCampanhas(data.campaigns || []);
      setCategories(data.categorias || []);

      //console.log('Campanhas fetched:', data.campaigns);
      ///console.log('Fetched categories:', data.categorias);
    } catch (error) {
      console.error('Error fetching campanhas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {

    if (user && user.user?.nome) {
      const firstName = user.user.nome.split(' ')[0];
      setUserNome(firstName);
    }

    fetchCampanhas();
    //fetchCategories();
  }, [fetchCampanhas, user]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchCampanhas();
    } finally {
      setRefreshing(false);
    }
  }, [fetchCampanhas]);

  const handleCategoryFilter = (category: Categorias) => {
    setCategoriesSelected(category);
    let filteredCampanhas: CampanhasHome[] = [];

    filteredCampanhas = campanhasRef.current.filter(campanha =>
      campanha.loja.categorias.some(cat => cat.id === category.id)
    );

    // console.log(`Category '${category.nome}' Filtered Campanhas:`, filteredCampanhas);
    setCampanhas(filteredCampanhas);
  }

  const checkAuth = (page: keyof RootStackParamList, params?: any) => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate(page, params);
  };

  if (loading || refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
        <ActivityIndicator size="large" color={"white"} />
      </View>
    );
  }

  const renderCampanha = (campanha: CampanhasHome) => (
    <View key={campanha.id} style={styles.campanhaCard}>
      <View style={styles.campanhaImageContainer}>
        <Image
          source={urlToLojasLogo(campanha.loja.logo)}
          accessibilityLabel={`Logo do ${campanha.loja.nome}`}
          contentFit="cover"
          transition={500}
          cachePolicy="memory-disk"
          style={styles.campanhaLojaLogo} />
      </View>
      <View style={styles.campanhaInfo}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap', marginLeft: '30%' }}>
          <Text style={styles.campanhaLojaNome}><Ionicons name="storefront" size={16} color="black" /> {campanha.loja.nome} | </Text>
          <Text style={styles.campanhaDescription}>{campanha.cupons?.length} Cupons:</Text>
          <Text style={styles.campanhaTitle} numberOfLines={2}>📣{campanha.titulo}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ width: '100%' }}
          contentContainerStyle={{ alignItems: 'center', paddingVertical: 5 }}
        >
          {campanha.cupons?.map(cupom => (
            <TouchableOpacity
              onPress={() => checkAuth('CupomDetalhes', { cupomId: cupom.id })}
              key={cupom.id} style={[styles.cupomContainer, campanha.cupons?.length === 1 ? { width: width - 40 } : {}]}
            >
              <Text style={[styles.cupomText, cupom.tipo === 'R$' ? { fontSize: normaSizes(35) } : { fontSize: normaSizes(55) }]}>{cupom.tipo === 'R$' ? formatNumber(cupom.valor) : cupom.valor}</Text>
              <View style={[styles.cupomTipoBox, cupom.tipo === 'R$' ? { top: 2, left: 1 } : { top: 2, right: -1 }]}>
                <Text style={styles.cupomTipoText}>{cupom.tipo}</Text>
              </View>
              <View style={styles.cupomRestamBox}>
                <Text style={styles.cupomRestamText}>Restam: <Text style={{ fontWeight: 'bold' }}>{cupom.qtd - cupom.usados}</Text></Text>
              </View>
              <View style={[styles.cupomTituloBox, cupom.tipo === 'R$' ? { right: 10 } : { left: 10 }]}>
                <Text style={styles.cupomTituloBoxText}>Cupom:</Text>
              </View>
              <View style={[styles.cupomOffBox]}>
                <Text style={styles.cupomOffBoxText}>OFF</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.timeToEnd}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: normaSizes(16), color: '#830000ff' }}>Campanha expira em: </Text>
          <TimeToEnd
            endTimestamp={checkDateToEnd(String(campanha.data_inicio), String(campanha.data_fim))}
            FONTSTYLE={{ fontSize: 16, color: '#222' }}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => checkAuth('CampanhaCreateEdit', { campanhaId: campanha.id })}
      >
        <Text><Ionicons name="pencil" size={16} color="black" /> Editar</Text>
      </TouchableOpacity>

    </View >
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ width: '100%' }}
            contentContainerStyle={{ alignItems: 'center', paddingRight: SPACING.lg }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('TabNavigator', { screen: 'Search' })}
              style={[styles.categoryButton, { backgroundColor: COLORS.primary, borderWidth: 2, borderColor: COLORS.white }]}
            >
              <Text style={[styles.categoryButtonText, { color: 'white' }]}><Ionicons name="search" size={normaSizes(16)} color="white" /> Pesquisar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setCategoriesSelected(null); setCampanhas(campanhasRef.current); }}
              style={[styles.categoryButton, { backgroundColor: 'white' }]}
            >
              <Text style={[styles.categoryButtonText, { color: COLORS.primary }]}><Ionicons name="globe-outline" size={16} color={COLORS.primary} /> Todas Categorias</Text>
            </TouchableOpacity>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryFilter(category)}
                style={[styles.categoryButton, { backgroundColor: category.cor || COLORS.primary }, categoriesSelected?.id === category.id && { borderWidth: 3, borderColor: COLORS.white }]}
              >
                <Text style={styles.categoryButtonText} numberOfLines={3}>{category.nome?.length > 20 ? `${category.nome.slice(0, 20)}...` : category.nome}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View>
            <Text style={{ fontSize: FONT_SIZES.md, fontWeight: 'bold', color: COLORS.white }}>{userNome ? `Olá ${userNome}, confira suas Campanhas em Destaque:` : 'Confira suas Campanhas em Destaque:'}</Text>
          </View>
        </View>
        {campanhas.map(renderCampanha)}

      </ScrollView>
    </SafeAreaView>
  );
}