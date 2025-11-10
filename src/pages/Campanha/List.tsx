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
import { Image } from 'expo-image';

import { getMyCampanhas, deleteCampanha } from '@/services/campanhas';
import { CampanhaCompleta, CampanhaStatus } from '@/types';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { Button } from '@/components/Button';
import { ButtonBack } from '@/components/ButtonBack';
import { urlToLojasLogo, formatarDataTimeStampToPtBr2 } from '@/utils/utils';
import { createCampanhasListStyles } from '@/styles/CampanhasListStyles';

const { width } = Dimensions.get('window');
const styles = createCampanhasListStyles();

export default function CampanhasList() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [campanhas, setCampanhas] = useState<CampanhaCompleta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCampanhas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyCampanhas();
      setCampanhas(data.campaigns || []);
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as campanhas');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCampanhas();
    }, [fetchCampanhas])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCampanhas();
    setRefreshing(false);
  }, [fetchCampanhas]);

  const handleDeleteCampanha = async (id: number) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta campanha?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCampanha(id);
              setCampanhas(prev => prev.filter(c => c.id !== id));
              Alert.alert('Sucesso', 'Campanha excluída com sucesso');
            } catch (error) {
              console.error('Erro ao excluir campanha:', error);
              Alert.alert('Erro', 'Não foi possível excluir a campanha');
            }
          },
        },
      ]
    );
  };

  const handleEditCampanha = (campanhaId: number) => {
    navigation.navigate('CampanhaCreateEdit', { campanhaId });
  };

  const handleCreateCampanha = () => {
    navigation.navigate('CampanhaCreateEdit');
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case CampanhaStatus.ATIVA:
        return COLORS.success;
      case CampanhaStatus.INATIVA:
        return COLORS.warning;
      case CampanhaStatus.SUSPENSA:
        return COLORS.danger;
      case CampanhaStatus.FINALIZADA:
        return COLORS.gray;
      default:
        return COLORS.grayDark;
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case CampanhaStatus.ATIVA:
        return 'Ativa';
      case CampanhaStatus.INATIVA:
        return 'Inativa';
      case CampanhaStatus.SUSPENSA:
        return 'Suspensa';
      case CampanhaStatus.FINALIZADA:
        return 'Finalizada';
      default:
        return 'Desconhecido';
    }
  };

  const renderCampanhaItem = ({ item }: { item: CampanhaCompleta }) => (
    <View style={styles.campanhaCard}>
      {item.loja?.logo && (
        <Image
          source={urlToLojasLogo(item.loja.logo)}
          style={styles.lojaLogo}
          contentFit="cover"
        />
      )}

      <View style={styles.campanhaContent}>
        <Text style={styles.campanhaTitle}><Ionicons name="megaphone" size={16} color={COLORS.primary} /> {item.titulo}</Text>
        <Text style={styles.campanhaDescription} numberOfLines={2}>
          {item.descricao}
        </Text>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            Início: {formatarDataTimeStampToPtBr2(item.data_inicio)}
          </Text>
          <Text style={styles.dateText}>
            Fim: {formatarDataTimeStampToPtBr2(item.data_fim)}
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditCampanha(item.id)}
          >
            <Ionicons name="pencil" size={16} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.secondary }]}
            onPress={() => navigation.navigate('CupomCreateEdit', { campanhaId: item.id })}
          >
            <Ionicons name="ticket" size={16} color={COLORS.white} />
            <Text style={styles.actionButtonText}>+ Cupom</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteCampanha(item.id)}
          >
            <Ionicons name="trash" size={16} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Excluir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORS.black }]}
            onPress={() => navigation.navigate('CuponsList', { campanhaId: item.id })}
          >
            <Ionicons name="list" size={16} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Ver Cupons</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando campanhas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ButtonBack goToScreen={['TabNavigator', 'Profile']} type={2} />
        <Text style={styles.headerTitle}>Minhas Campanhas</Text>
        <TouchableOpacity onPress={handleCreateCampanha} style={styles.addButton}>
          <Ionicons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={campanhas}
        renderItem={renderCampanhaItem}
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
            <Ionicons name="megaphone-outline" size={64} color={COLORS.gray} />
            <Text style={styles.emptyTitle}>Nenhuma campanha encontrada</Text>
            <Text style={styles.emptyDescription}>
              Crie sua primeira campanha para começar
            </Text>
            <Button
              title="Criar Campanha"
              onPress={handleCreateCampanha}
              style={styles.createButton}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}
