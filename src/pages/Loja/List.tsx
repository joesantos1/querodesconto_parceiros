import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ButtonBack } from '../../components/ButtonBack';
import { createLojasListStyles } from '../../styles/LojasListStyles';
import { getMyStores, deleteStore } from '../../services/stores';
import { getCities } from '../../services/city';
import { Loja, Cidade } from '../../types';
import { COLORS } from '../../constants';

interface LojaWithCity extends Loja {
  cidade_nome?: string;
}

export default function LojasList() {
  const navigation = useNavigation();
  const styles = createLojasListStyles();
  
  const [lojas, setLojas] = useState<LojaWithCity[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCities = async () => {
    try {
      const response = await getCities();
      setCidades(response);
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
    }
  };

  const loadLojas = async () => {
    try {
      const response = await getMyStores();
      
      // Enriquecer lojas com nome da cidade
      const lojasWithCity = response.map((loja: Loja) => {
        const cidade = cidades.find(c => c.id === loja.cidade_id);
        return {
          ...loja,
          cidade_nome: cidade?.cidade || 'Cidade não encontrada'
        };
      });
      
      setLojas(lojasWithCity);
    } catch (error) {
      console.error('Erro ao carregar lojas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as lojas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        await loadCities();
      };
      loadData();
    }, [])
  );

  useEffect(() => {
    if (cidades.length > 0) {
      loadLojas();
    }
  }, [cidades]);

  const onRefresh = () => {
    setRefreshing(true);
    loadLojas();
  };

  const handleEditLoja = (loja: LojaWithCity) => {
    (navigation as any).navigate('LojaCreateEdit', { lojaId: loja.id });
  };

  const handleDeleteLoja = (loja: LojaWithCity) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a loja "${loja.nome}"?\n\nEsta ação não pode ser desfeita.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStore(loja.id.toString());
              Alert.alert('Sucesso', 'Loja excluída com sucesso');
              loadLojas();
            } catch (error) {
              console.error('Erro ao excluir loja:', error);
              Alert.alert('Erro', 'Não foi possível excluir a loja');
            }
          },
        },
      ]
    );
  };

  const openLocation = (localizacao_link: string) => {
    if (localizacao_link) {
      Linking.openURL(localizacao_link).catch(() => {
        Alert.alert('Erro', 'Não foi possível abrir o link de localização');
      });
    }
  };

  const callPhone = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`).catch(() => {
        Alert.alert('Erro', 'Não foi possível fazer a ligação');
      });
    }
  };

  const sendEmail = (email: string) => {
    if (email) {
      Linking.openURL(`mailto:${email}`).catch(() => {
        Alert.alert('Erro', 'Não foi possível abrir o email');
      });
    }
  };

  const openWebsite = (site: string) => {
    if (site) {
      const url = site.startsWith('http') ? site : `https://${site}`;
      Linking.openURL(url).catch(() => {
        Alert.alert('Erro', 'Não foi possível abrir o site');
      });
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return COLORS.success;
      case 0:
        return COLORS.gray;
      case 2:
        return COLORS.warning;
      default:
        return COLORS.gray;
    }
  };

  const renderLojaCard = ({ item: loja }: { item: LojaWithCity }) => (
    <View style={styles.lojaCard}>
      <View style={styles.lojaHeader}>
        {loja.logo ? (
          <Image source={{ uri: loja.logo }} style={styles.lojaLogo} />
        ) : (
          <View style={[styles.lojaLogo, { justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons name="storefront-outline" size={32} color={COLORS.gray} />
          </View>
        )}
        
        <View style={styles.lojaInfo}>
          <Text style={styles.lojaNome} numberOfLines={2}>
            {loja.nome}
          </Text>
          {loja.endereco ? (
            <Text style={styles.lojaEndereco} numberOfLines={2}>
              {loja.endereco}
            </Text>
          ) : null}
          <Text style={styles.lojaCidade}>
            {loja.cidade_nome}
          </Text>
        </View>
      </View>

      {/* Informações de contato */}
      <View style={styles.contactInfo}>
        {loja.telefone1 && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => callPhone(loja.telefone1)}
          >
            <Ionicons name="call-outline" size={16} color={COLORS.primary} />
            <Text style={styles.contactText} numberOfLines={1}>
              {loja.telefone1}
            </Text>
          </TouchableOpacity>
        )}
        
        {loja.email && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => sendEmail(loja.email)}
          >
            <Ionicons name="mail-outline" size={16} color={COLORS.primary} />
            <Text style={styles.contactText} numberOfLines={1}>
              {loja.email}
            </Text>
          </TouchableOpacity>
        )}
        
        {loja.site && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => openWebsite(loja.site)}
          >
            <Ionicons name="globe-outline" size={16} color={COLORS.primary} />
            <Text style={styles.contactText} numberOfLines={1}>
              Site
            </Text>
          </TouchableOpacity>
        )}
        
        {loja.localizacao_link && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => loja.localizacao_link && openLocation(loja.localizacao_link)}
          >
            <Ionicons name="location-outline" size={16} color={COLORS.primary} />
            <Text style={styles.contactText}>
              Localização
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Descrição */}
      {loja.descricao ? (
        <Text style={styles.lojaDescricao} numberOfLines={3}>
          {loja.descricao}
        </Text>
      ) : null}

      {/* Status */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(loja.status) }]}>
          <Text style={styles.statusText}>
            {loja.status === 1 ? 'ATIVO' : loja.status === 0 ? 'INATIVO' : 'PENDENTE'}
          </Text>
        </View>
      </View>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Campanhas{'\n'}Ativas</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Cupons{'\n'}Válidos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Total{'\n'}Vendas</Text>
        </View>
      </View>

      {/* Ações */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditLoja(loja)}
        >
          <Ionicons name="pencil" size={16} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteLoja(loja)}
        >
          <Ionicons name="trash" size={16} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="storefront-outline" size={80} color={COLORS.gray} />
      <Text style={styles.emptyTitle}>Nenhuma loja cadastrada</Text>
      <Text style={styles.emptyDescription}>
        Você ainda não possui lojas cadastradas.{'\n'}
        Comece criando sua primeira loja!
      </Text>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton, styles.createButton]}
        onPress={() => (navigation as any).navigate('LojaCreateEdit')}
      >
        <Ionicons name="add" size={20} color={COLORS.white} />
        <Text style={styles.actionButtonText}>Criar Primeira Loja</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ButtonBack goTo="back" />
            <Text style={styles.headerTitle}>Minhas Lojas</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando lojas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ButtonBack goTo="back" />
          <Text style={styles.headerTitle}>Minhas Lojas</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => (navigation as any).navigate('LojaCreateEdit')}
        >
          <Ionicons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={lojas}
        renderItem={renderLojaCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={lojas.length === 0 ? { flex: 1 } : styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}