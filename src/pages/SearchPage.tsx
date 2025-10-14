import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { createSearchStyles } from '@/styles/SearchStyles';
import { getAllCampanhas } from '@/services/campanhas';
import { RootStackParamList, CampanhasHome, Categorias } from '@/types';
import { urlToLojasLogo, formatNumber, checkDateToEnd } from '@/utils/utils';
import { COLORS, FONT_SIZES, SPACING, normaSizes } from '@/constants';
import TimeToEnd from '@/components/TimeToEnd';
import { useAuth } from '@/contexts/AuthContext';

const styles = createSearchStyles();

export default function SearchPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [campanhas, setCampanhas] = useState<CampanhasHome[]>([]);
  const [filteredCampanhas, setFilteredCampanhas] = useState<CampanhasHome[]>([]);
  const [categories, setCategories] = useState<Categorias[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { isAuthenticated } = useAuth();
  const campanhasRef = useRef<CampanhasHome[]>([]);

  const fetchCampanhas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllCampanhas();
      campanhasRef.current = data.campaigns || [];
      setCampanhas(data.campaigns || []);
      setCategories(data.categorias || []);
    } catch (error) {
      console.error('Error fetching campanhas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampanhas();
  }, [fetchCampanhas]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchCampanhas();
    } finally {
      setRefreshing(false);
    }
  }, [fetchCampanhas]);

  const searchCampanhas = useCallback((query: string) => {
    if (!query.trim()) {
      setFilteredCampanhas([]);
      return;
    }

    //Verifica se o query começa com "Categoria: " para filtrar por categoria
    if (query.startsWith('Categoria: ')) {
      return;
    }

    const filtered = campanhas.filter(campanha => {
      // Search by store name
      const storeNameMatch = campanha.loja.nome.toLowerCase().includes(query.toLowerCase());

      // Search by campaign title
      const campaignTitleMatch = campanha.titulo.toLowerCase().includes(query.toLowerCase());

      // Search by coupon values
      const couponValueMatch = campanha.cupons?.some(cupom =>
        cupom.valor.toString().includes(query) ||
        formatNumber(cupom.valor).includes(query)
      );

      return storeNameMatch || campaignTitleMatch || couponValueMatch;
    });

    setFilteredCampanhas(filtered);
  }, [campanhas]);

  useEffect(() => {
    searchCampanhas(searchQuery);
  }, [searchQuery, searchCampanhas]);

  const handleCategoryPress = (category: Categorias) => {
    const filtered = campanhas.filter(campanha =>
      campanha.loja.categorias.some(cat => cat.id === category.id)
    );
    setFilteredCampanhas(filtered);
    setSearchQuery(`Categoria: ${category.nome}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredCampanhas([]);
  };

  const checkAuth = (page: keyof RootStackParamList, params?: any) => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate(page, params);
  };

  const renderCampanha = (campanha: CampanhasHome) => (
    <View key={campanha.id} style={styles.campanhaCard}>
      <View style={styles.campanhaInfo}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          <Text style={styles.campanhaLojaNome}><Ionicons name="storefront" size={16} color="black" /> {campanha.loja.nome} | </Text>
          <Text style={styles.campanhaDescription}>{campanha.cupons?.length} Cupons:</Text>
          <Text style={styles.campanhaTitle}>📣{campanha.titulo}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ width: '100%' }}
          contentContainerStyle={{ alignItems: 'center', paddingVertical: 5 }}
        >
          <View style={styles.campanhaImageContainer}>
            <Image
              source={urlToLojasLogo(campanha.loja.logo)}
              accessibilityLabel={`Logo do ${campanha.loja.nome}`}
              contentFit="cover"
              transition={500}
              cachePolicy="memory-disk"
              style={styles.campanhaImage} />
          </View>
          {campanha.cupons?.map(cupom => (
            <TouchableOpacity
              onPress={() => checkAuth('CupomDetalhes', { cupomId: cupom.id })}
              key={cupom.id} style={styles.cupomContainer}
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
      </View >
      <View style={styles.timeToEnd}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: normaSizes(16), color: '#830000ff' }}>Campanha expira em: </Text>
          <TimeToEnd
            endTimestamp={checkDateToEnd(String(campanha.data_inicio), String(campanha.data_fim))}
            FONTSTYLE={{ fontSize: 16, color: '#222' }}
          />
        </View>
      </View>
    </View >
  );

  const renderCategoryGrid = () => (
    <View style={styles.categoriesGrid}>
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryCard}
          onPress={() => handleCategoryPress(category)}
        >
          <View style={[styles.categoryIcon, { backgroundColor: category.cor || COLORS.primary }]}>
            <Ionicons name="apps" size={20} color="white" />
          </View>
          <Text style={styles.categoryName}>
            {category.nome}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.noResultsText}>Carregando campanhas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por loja, campanha ou desconto..."
            placeholderTextColor={COLORS.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {searchQuery.trim() === '' ? (
          <>
            <Text style={styles.sectionTitle}>
              <Ionicons name="grid" size={20} color="white" /> Pesquisar por Categoria
            </Text>
            {renderCategoryGrid()}
          </>
        ) : (
          <View style={styles.campaignsContainer}>
            <Text style={styles.sectionTitle}>
              Resultados para "{searchQuery}" ({filteredCampanhas.length})
            </Text>
            {filteredCampanhas.length > 0 ? (
              filteredCampanhas.map(renderCampanha)
            ) : (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search" size={60} color="white" />
                <Text style={styles.noResultsText}>
                  Nenhuma campanha encontrada para "{searchQuery}"
                </Text>
                <Text style={[styles.noResultsText, { fontSize: normaSizes(14), marginTop: SPACING.sm }]}>
                  Tente pesquisar por nome da loja, título da campanha ou valor do desconto
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}