import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';

import { getMyCupons, deleteCupom } from '@/services/cupons';
import { Cupom, CupomStatus } from '@/types';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { Button } from '@/components/Button';
import { ButtonBack } from '@/components/ButtonBack';
import { createCuponsListStyles } from '@/styles/CuponsListStyles';

const { width } = Dimensions.get('window');
const styles = createCuponsListStyles();

export default function CuponsList() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [filteredCupons, setFilteredCupons] = useState<Cupom[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'todos' | 'ativos' | 'inativos' | 'esgotados'>('todos');

  const fetchCupons = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyCupons();
      setCupons(data || []);
      setFilteredCupons(data || []);
    } catch (error) {
      console.error('Erro ao buscar cupons:', error);
      Alert.alert('Erro', 'Não foi possível carregar os cupons');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCupons();
    }, [fetchCupons])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCupons();
    setRefreshing(false);
  }, [fetchCupons]);

  const handleDeleteCupom = async (id: number) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este cupom?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCupom(id);
              setCupons(prev => prev.filter(c => c.id !== id));
              setFilteredCupons(prev => prev.filter(c => c.id !== id));
              Alert.alert('Sucesso', 'Cupom excluído com sucesso');
            } catch (error) {
              console.error('Erro ao excluir cupom:', error);
              Alert.alert('Erro', 'Não foi possível excluir o cupom');
            }
          },
        },
      ]
    );
  };

  const handleEditCupom = (cupomId: number) => {
    navigation.navigate('CupomCreateEdit', { cupomId });
  };

  const handleCreateCupom = () => {
    navigation.navigate('CupomCreateEdit');
  };

  const getStatusColor = (status: number, qtd: number, usados: number) => {
    if (qtd <= usados) {
      return COLORS.danger; // Esgotado
    }
    
    switch (status) {
      case CupomStatus.ATIVO:
        return COLORS.success;
      case CupomStatus.INATIVO:
        return COLORS.warning;
      case CupomStatus.ESGOTADO:
        return COLORS.danger;
      case CupomStatus.EXPIRADO:
        return COLORS.gray;
      default:
        return COLORS.grayDark;
    }
  };

  const getStatusText = (status: number, qtd: number, usados: number) => {
    if (qtd <= usados) {
      return 'Esgotado';
    }

    switch (status) {
      case CupomStatus.ATIVO:
        return 'Ativo';
      case CupomStatus.INATIVO:
        return 'Inativo';
      case CupomStatus.ESGOTADO:
        return 'Esgotado';
      case CupomStatus.EXPIRADO:
        return 'Expirado';
      default:
        return 'Desconhecido';
    }
  };

  const getQuantityColor = (qtd: number, usados: number) => {
    const restantes = qtd - usados;
    const percentual = (restantes / qtd) * 100;
    
    if (percentual <= 0) return COLORS.danger;
    if (percentual <= 20) return COLORS.warning;
    return COLORS.success;
  };

  const formatCupomValue = (valor: number, tipo: string) => {
    if (tipo === 'percentual') {
      return `${valor}%`;
    }
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };

  const filterCupons = useCallback((filter: typeof selectedFilter) => {
    let filtered = cupons;
    
    switch (filter) {
      case 'ativos':
        filtered = cupons.filter(cupom => 
          cupom.status === CupomStatus.ATIVO && cupom.qtd > cupom.usados
        );
        break;
      case 'inativos':
        filtered = cupons.filter(cupom => cupom.status === CupomStatus.INATIVO);
        break;
      case 'esgotados':
        filtered = cupons.filter(cupom => 
          cupom.qtd <= cupom.usados || cupom.status === CupomStatus.ESGOTADO
        );
        break;
      default:
        filtered = cupons;
    }
    
    setFilteredCupons(filtered);
    setSelectedFilter(filter);
  }, [cupons]);

  useEffect(() => {
    filterCupons(selectedFilter);
  }, [cupons, filterCupons, selectedFilter]);

  const renderFilterButton = (filter: typeof selectedFilter, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => filterCupons(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderCupomItem = ({ item }: { item: Cupom }) => {
    const isExpired = new Date() > new Date(Date.now() + item.validade * 24 * 60 * 60 * 1000);
    
    return (
      <View style={[styles.cupomCard, isExpired && styles.cupomCardExpired]}>
        <View style={styles.cupomHeader}>
          <View style={styles.cupomValueContainer}>
            <Text style={styles.cupomValue}>
              {formatCupomValue(item.valor, item.tipo)}
            </Text>
            <Text style={styles.cupomType}>{item.tipo}</Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: getStatusColor(item.status, item.qtd, item.usados) }
            ]}>
              <Text style={styles.statusText}>
                {getStatusText(item.status, item.qtd, item.usados)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cupomInfo}>
          <Text style={styles.cupomCodigo}>{item.codigo}</Text>
          
          <View style={styles.cupomQuantity}>
            <Ionicons 
              name="layers-outline" 
              size={16} 
              color={getQuantityColor(item.qtd, item.usados)} 
            />
            <Text style={[
              styles.quantityText,
              { color: getQuantityColor(item.qtd, item.usados) }
            ]}>
              {item.qtd - item.usados} de {item.qtd} disponíveis
            </Text>
          </View>

          <Text style={styles.cupomValidade}>
            Válido por {item.validade} dias após uso
          </Text>
        </View>

        {item.campanha && (
          <View style={styles.campanhaInfo}>
            <Text style={styles.campanhaTitle}>{item.campanha.titulo}</Text>
            {item.loja && <Text style={styles.lojaName}>{item.loja.nome}</Text>}
          </View>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditCupom(item.id)}
          >
            <Ionicons name="pencil" size={16} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteCupom(item.id)}
          >
            <Ionicons name="trash" size={16} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando cupons...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ButtonBack goTo="back" />
        <Text style={styles.headerTitle}>Meus Cupons</Text>
        <TouchableOpacity onPress={handleCreateCupom} style={styles.addButton}>
          <Ionicons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {renderFilterButton('todos', 'Todos')}
        {renderFilterButton('ativos', 'Ativos')}
        {renderFilterButton('inativos', 'Inativos')}
        {renderFilterButton('esgotados', 'Esgotados')}
      </View>

      <FlatList
        data={filteredCupons}
        renderItem={renderCupomItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="ticket-outline" size={64} color={COLORS.gray} />
            <Text style={styles.emptyTitle}>
              {selectedFilter === 'todos' 
                ? 'Nenhum cupom encontrado' 
                : `Nenhum cupom ${selectedFilter}`
              }
            </Text>
            <Text style={styles.emptyDescription}>
              {selectedFilter === 'todos'
                ? 'Crie seu primeiro cupom para começar'
                : `Você não possui cupons ${selectedFilter} no momento`
              }
            </Text>
            {selectedFilter === 'todos' && (
              <Button
                title="Criar Cupom"
                onPress={handleCreateCupom}
                style={styles.createButton}
              />
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}
