import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ButtonBack } from '../../components/ButtonBack';
import { 
  getLojistasByStoreId, 
  setLojistaStore, 
  removeLojistaFromStore 
} from '../../services/stores';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';
import { createLojasListStyles } from '../../styles/LojasListStyles';
import { formatarTelefone } from '@/utils/utils';

interface RouteParams {
  lojaId: number;
  lojaNome?: string;
}

interface Lojista {
  id: number;
  nome: string;
  email: string;
  telefone: string;
}

export default function ColabTeam() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lojaId, lojaNome } = (route.params as RouteParams) || {};
  const styles = createLojasListStyles();

  const [lojistas, setLojistas] = useState<Lojista[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingLojista, setAddingLojista] = useState(false);
  
  // Estados para formulário de adicionar lojista
  const [novoLojista, setNovoLojista] = useState({ email: '' });

  const loadLojistas = async () => {
    if (!lojaId) {
      Alert.alert('Erro', 'ID da loja não fornecido');
      navigation.goBack();
      return;
    }

    try {
      const response = await getLojistasByStoreId(lojaId.toString());
      setLojistas(response);
    } catch (error) {
      console.error('Erro ao carregar lojistas:', error);
      Alert.alert('Erro', 'Não foi possível carregar a equipe da loja');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLojistas();
    }, [lojaId])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadLojistas();
  };

  const handleAddLojista = async () => {
    const { email } = novoLojista;

    // Validação básica
    if (!email.trim()) {
      Alert.alert('Erro', 'Email é obrigatório');
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }

    try {
      setAddingLojista(true);
      
      const lojistaData = {
        email: email.trim().toLowerCase()
      };

      await setLojistaStore(lojaId.toString(), lojistaData);
      
      Alert.alert('Sucesso', 'Lojista adicionado à equipe com sucesso!');
      
      // Limpar formulário e fechar modal
      setNovoLojista({ email: '' });
      setShowAddModal(false);
      
      // Recarregar lista
      loadLojistas();
    } catch (error: any) {
      console.error('Erro ao adicionar lojista ====: ', error.response.data.error);
      
      let errorMessage = 'Não foi possível adicionar o lojista à equipe';
      
      Alert.alert('Erro', errorMessage.length > 0 ? errorMessage : 'Não foi possível adicionar o lojista à equipe');
    } finally {
      setAddingLojista(false);
    }
  };

  const handleRemoveLojista = (lojista: Lojista) => {
    Alert.alert(
      'Remover da Equipe',
      `Tem certeza que deseja remover "${lojista.nome}" da equipe desta loja?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeLojistaFromStore(lojaId.toString(), lojista.id.toString());
              Alert.alert('Sucesso', 'Lojista removido da equipe');
              loadLojistas();
            } catch (error) {
              console.error('Erro ao remover lojista:', error);
              Alert.alert('Erro', 'Não foi possível remover o lojista da equipe');
            }
          }
        }
      ]
    );
  };

  const renderLojistaCard = ({ item: lojista }: { item: Lojista }) => (
    <View style={[styles.lojaCard, { marginBottom: SPACING.md }]}>
      <View style={styles.lojaHeader}>
        <View style={[styles.lojaLogo, { 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: COLORS.primary + '20'
        }]}>
          <Ionicons name="person" size={32} color={COLORS.primary} />
        </View>
        
        <View style={styles.lojaInfo}>
          <Text style={styles.lojaNome} numberOfLines={2}>
            {lojista.nome}
          </Text>
          <Text style={styles.lojaEndereco} numberOfLines={1}>
            {lojista.email}
          </Text>
          {lojista.telefone && (
            <Text style={styles.lojaCidade} selectable>
              {formatarTelefone(lojista.telefone)}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.danger, flex: 1 }]}
          onPress={() => handleRemoveLojista(lojista)}
        >
          <Ionicons name="person-remove" size={16} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Remover da Equipe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={80} color={COLORS.gray} />
      <Text style={styles.emptyTitle}>Nenhum colaborador na equipe</Text>
      <Text style={styles.emptyDescription}>
        Adicione lojistas à equipe desta loja para que eles possam gerenciar campanhas e cupons.
      </Text>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton, styles.createButton]}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="person-add" size={20} color={COLORS.white} />
        <Text style={styles.actionButtonText}>Adicionar Primeiro Colaborador</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <ButtonBack goTo="back" type={2} />
          <Text style={styles.headerTitle}>Equipe da Loja</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando equipe...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ButtonBack goTo="back" type={2} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Equipe da Loja</Text>
          {lojaNome && (
            <Text style={[styles.loadingText, { fontSize: 12, marginTop: 2 }]}>
              {lojaNome}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="person-add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={lojistas}
        renderItem={renderLojistaCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={lojistas.length === 0 ? { flex: 1 } : styles.listContainer}
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

      {/* Modal para adicionar lojista */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: SPACING.lg
          }}>
            <View style={{
              backgroundColor: COLORS.white,
              borderRadius: 15,
              padding: SPACING.lg,
              width: '100%',
              maxWidth: 400
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: SPACING.lg
              }}>
                <Text style={{
                  fontSize: FONT_SIZES.lg,
                  fontWeight: 'bold',
                  color: COLORS.dark
                }}>
                  Adicionar Colaborador
                </Text>
                <TouchableOpacity 
                  onPress={() => setShowAddModal(false)}
                  style={{ padding: SPACING.xs }}
                >
                  <Ionicons name="close" size={24} color={COLORS.gray} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{ marginBottom: SPACING.md }}>
                  <Text style={{
                    fontSize: FONT_SIZES.md,
                    fontWeight: 'bold',
                    color: COLORS.dark,
                    marginBottom: SPACING.xs
                  }}>
                    Email *
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: COLORS.grayLight,
                      borderRadius: 8,
                      paddingHorizontal: SPACING.md,
                      paddingVertical: SPACING.sm,
                      fontSize: FONT_SIZES.md,
                      color: COLORS.dark
                    }}
                    value={novoLojista.email}
                    onChangeText={(text) => setNovoLojista({ ...novoLojista, email: text })}
                    placeholder="Digite o email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={{
                  flexDirection: 'row',
                  gap: SPACING.sm
                }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: COLORS.gray,
                      padding: SPACING.md,
                      borderRadius: 8,
                      alignItems: 'center'
                    }}
                    onPress={() => {
                      setNovoLojista({ email: '' });
                      setShowAddModal(false);
                    }}
                  >
                    <Text style={{
                      color: COLORS.white,
                      fontSize: FONT_SIZES.md,
                      fontWeight: 'bold'
                    }}>
                      Cancelar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: addingLojista ? COLORS.gray : COLORS.primary,
                      padding: SPACING.md,
                      borderRadius: 8,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center'
                    }}
                    onPress={handleAddLojista}
                    disabled={addingLojista}
                  >
                    {addingLojista ? (
                      <>
                        <ActivityIndicator size="small" color="white" style={{ marginRight: SPACING.xs }} />
                        <Text style={{
                          color: COLORS.white,
                          fontSize: FONT_SIZES.md,
                          fontWeight: 'bold'
                        }}>
                          Adicionando...
                        </Text>
                      </>
                    ) : (
                      <Text style={{
                        color: COLORS.white,
                        fontSize: FONT_SIZES.md,
                        fontWeight: 'bold'
                      }}>
                        Adicionar
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}