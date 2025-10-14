import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { getCupomById, setCupomParaUsuario } from '@/services/cupons';
import { Cupom, CupomDetalhes } from '@/types';
import { formatNumber, formatarDataTimeStampToPtBr, formatarDataRelativa, urlToLojasLogo } from '@/utils/utils';
import { Image } from 'expo-image';
import { COLORS, FONT_SIZES, normaSizes } from '@/constants';
import { ButtonBack } from '@/components/ButtonBack';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { createStyles } from '@/styles/CupomDetalhesStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const styles = createStyles();
export default function CupomPage() {
    const route = useRoute<RouteProp<RootStackParamList, 'CupomDetalhes'>>();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const id = route.params?.cupomId;
    const [cupom, setCupom] = useState<CupomDetalhes | null>(null);
    const [jaTenho, setJaTenho] = useState(false);
    const { isAuthenticated } = useAuth();
    const scrollViewRef = useRef<ScrollView>(null);
    const [refreshing, setRefreshing] = useState(false);

     const handleRefresh = async () => {
        setRefreshing(true);
        await fetchCupom();
        setRefreshing(false);
    };

    useEffect(() => {
        if (id) {
            fetchCupom();
        }
    }, [id]);

    const fetchCupom = async () => {
        const cupomData = await getCupomById(id);
        setCupom(cupomData);
        setJaTenho(cupomData.jaTenho);
        //console.log('Cupom data:', cupomData);
    };

    const handlePegaCupom = async () => {
        if (cupom) {
            try {
                await setCupomParaUsuario(cupom.id);
                setJaTenho(true);
                alert('Cupom resgatado com sucesso! Veja seus cupons na aba MEUS CUPONS.');
                navigation.navigate('TabNavigator', { screen: 'MeusCupons' });
            } catch (error) {
                console.error('Error resgatar cupom:', error);
                alert('Erro ao resgatar cupom. Tente novamente mais tarde.');
            }
        }
    };

    const checkAuth = (page: keyof RootStackParamList, params?: any) => {
        if (!isAuthenticated) {
            navigation.navigate('Login');
            return;
        }
        navigation.navigate(page, params);
    };

    if (!cupom || refreshing) {
        return (
            <View style={styles.container}>
                <ButtonBack goTo="back" />
                <Text style={styles.title}>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ButtonBack goTo="back" />
            <ScrollView
                style={{ flexGrow: 1, width: '100%', paddingTop: 40 }}
                contentContainerStyle={{ alignItems: 'center', paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
                ref={scrollViewRef}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                <View style={styles.headerLojaInfo}>
                    <View style={styles.header}>
                        {cupom.loja?.logo && (
                            <View style={styles.logoContainer}>
                                <Image
                                    source={urlToLojasLogo(cupom.loja.logo)}
                                    style={styles.logo}
                                    contentFit='cover'
                                    cachePolicy={"memory-disk"}
                                />
                            </View>
                        )}
                        <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', width: '70%' }}>
                            <Text style={styles.lojaNome}><Ionicons name="storefront" size={normaSizes(16)} color={COLORS.white} /> {cupom.loja?.nome}</Text>
                            <Text style={styles.lojaSubtitulos}><Ionicons name="call-outline" size={normaSizes(16)} color={COLORS.grayLight} /> {cupom.loja?.telefone1}</Text>
                            <Text style={styles.lojaSubtitulos}><Ionicons name="mail-outline" size={normaSizes(16)} color={COLORS.grayLight} /> {cupom.loja?.email}</Text>
                            <Text style={styles.lojaSubtitulos}><Ionicons name="location-outline" size={normaSizes(16)} color={COLORS.grayLight} /> {cupom.loja?.endereco}</Text>
                        </View>
                    </View>

                    <Text style={styles.lojaCampanhaTitulo}>📣{cupom.campanha?.titulo}</Text>
                    <Text style={styles.subtitle}>{cupom.campanha?.descricao}</Text>
                    <Text style={[styles.subtitle, { color: COLORS.danger }]}>Campanha encerra em: {formatarDataTimeStampToPtBr(cupom.campanha?.data_fim || 0)}</Text>
                </View>
                <View style={styles.CupomInfo}>
                    <Text style={styles.title}>Cupom: {cupom.tipo === 'R$' ? 'R$ ' + formatNumber(cupom.valor) : cupom.valor + '% de Desconto'}</Text>
                    <View style={styles.tableContainer}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableLabel}>Tipo:</Text>
                            <Text style={styles.tableValue}>{cupom.tipo === 'R$' ? 'Desconto em Reais' : 'Desconto em Porcentagem'}</Text>
                        </View>

                        <View style={styles.tableRow}>
                            <Text style={styles.tableLabel}>Valor:</Text>
                            <Text style={styles.tableValue}>{cupom.tipo === 'R$' ? 'R$ ' + formatNumber(cupom.valor) : cupom.valor + '% de Desconto'}</Text>
                        </View>

                        <View style={styles.tableRow}>
                            <Text style={styles.tableLabel}>Validade:</Text>
                            <Text style={[styles.tableValue, { color: 'red', fontWeight: 'bold' }]}>{cupom.validade === 1 ? '24 horas' : cupom.validade + ' dias'} <FontAwesome name="question-circle-o" size={14} color="black" /> <Text style={{ fontSize: 14, fontStyle: 'italic', color: 'grey' }}>Este cupom precisa ser usado dentro do prazo estabelecido de validade.</Text></Text>
                        </View>

                        <View style={styles.tableRow}>
                            <Text style={styles.tableLabel}>Usados:</Text>
                            <Text style={[styles.tableValue, { fontWeight: 'bold' }]}> {cupom.usados ? cupom.usados : 0} de {cupom.qtd}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableLabel, { width: '100%', textAlign: 'center' }]}>Regras e condições de uso (⚠️Leia com atenção!):</Text>
                        </View>
                        {cupom.regras && typeof cupom.regras === 'object'
                            && Object.entries(cupom.regras).map(([key, value]) => (
                                <View style={styles.tableRow} key={key}>
                                    <Text style={styles.tableLabel}>#{key}</Text>
                                    <Text style={styles.tableValue}>{String(value)}</Text>
                                </View>
                            ))
                        }
                    </View>
                    <View style={{ marginTop: 20, width: '100%', alignItems: 'center' }}>
                        {!jaTenho ? (
                            <TouchableOpacity onPress={handlePegaCupom} style={styles.pegaCupomButton}>
                                <Text style={styles.pegaCupomButtonText}><Ionicons name="pricetag-outline" size={normaSizes(24)} color={COLORS.white} /> Pegar 01 Cupom</Text>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.subtitle}>Você já possui este cupom!</Text>
                        )}
                    </View>
                </View>
                {cupom.outrosCupons && cupom.outrosCupons.length > 0 && (
                    <View style={styles.CupomInfo}>
                        <Text style={[styles.subtitle, { marginBottom: 10 }]}>Confira outros Cupons desta Loja:</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ width: '100%', paddingHorizontal: 10 }}
                        >
                            {cupom.outrosCupons?.map(cupom => (
                                <TouchableOpacity
                                    onPress={() => {
                                        //Sobe a barra de navegação para o topo
                                        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                                        checkAuth('CupomDetalhes', { cupomId: cupom.id })
                                    }}
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
                    </View>
                )}
                <View style={styles.CupomInfo}>
                    <Text style={[styles.subtitle, { marginBottom: 10 }]}>Últimos usuários que pegaram este cupom:</Text>
                    {cupom.ultimosUsuarios && cupom.ultimosUsuarios.length > 0 ? (
                        cupom.ultimosUsuarios.map((usuario, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={{ fontSize: normaSizes(16) }}><Ionicons name="person-outline" size={normaSizes(14)} color={'black'} /> {usuario.nome.split(' ')[0] + '...'} pegou 01 cupom há {formatarDataRelativa(usuario.pegoEm)}!</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.tableValue}>Nenhum usuário ainda pegou este cupom.</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}