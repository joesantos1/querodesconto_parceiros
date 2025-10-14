import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Dimensions, Modal, ScrollView, Alert, Linking, Platform } from 'react-native';
import { CupomUsuario } from '@/types';
import { COLORS, FONTFAMILY, normaSizes } from '@/constants';
import { getCuponsUsuario } from '@/services/cupons';
import { useAuth } from '@/contexts/AuthContext';
import { Image } from 'expo-image';
import { urlToLojasLogo, formatNumber, checkDateToEnd, cupomStatus, formatarDataTimeStampToPtBr, formatarTelefone } from '@/utils/utils';
import { Ionicons } from '@expo/vector-icons';
import TimeToEnd from '@/components/TimeToEnd';
import { createStyles } from '@/styles/MeusCuponsStyles';
import QRCode from 'react-native-qrcode-svg';
import { FontAwesome5 } from '@expo/vector-icons';

const styles = createStyles();

export default function MeusCuponsPage() {
    const [cupons, setCupons] = useState<CupomUsuario[]>([]);
    const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCupom, setSelectedCupom] = useState<CupomUsuario | null>(null);

    const fetchCupons = async () => {
        try {
            setRefreshing(true);
            const data = await getCuponsUsuario();
            setCupons(data);
        } catch (error) {
            console.error('Error fetching cupons:', error);
            Alert.alert('Erro', 'Não foi possível carregar os cupons. Tente novamente mais tarde.');
        }
        setRefreshing(false);
        //console.log('Meus cupons:', data);
    };

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await fetchCupons();
        } catch (error) {
            console.error('Error refreshing cupons:', error);
            Alert.alert('Erro', 'Não foi possível atualizar os cupons. Tente novamente mais tarde.');
        }
        setRefreshing(false);
    }

    useEffect(() => {
        fetchCupons();
    }, []);

    const handleAbreLink = async (link: string, code: string) => {
        try {

            if (!link || typeof link !== 'string') {
                Alert.alert('Erro', 'Link de resgate inválido ou não fornecido');
                return;
            }

            const fullUrl = link + encodeURIComponent('QueroDesconto - Quero usar meu Cupom - código: ' + code);

            // Para WhatsApp, tente abrir diretamente sem verificar canOpenURL
            if (link.includes('wa.me') || link.includes('whatsapp')) {
                try {
                    await Linking.openURL(fullUrl);
                } catch (error) {
                    // Se falhar, tente abrir no navegador
                    const webUrl = fullUrl.replace('wa.me', 'web.whatsapp.com/send');
                    await Linking.openURL(webUrl);
                }
            } else {
                // Para outros links, faça a verificação normal
                const canOpen = await Linking.canOpenURL(link);

                if (canOpen) {
                    await Linking.openURL(link);
                } else {
                    Alert.alert(
                        'Erro',
                        `Não foi possível abrir o link de resgate.\nURL: ${link}\nVerifique se o aplicativo necessário está instalado.`
                    );
                }
            }
        } catch (error) {
            console.error('Erro ao abrir link de resgate:', error);
            Alert.alert(
                'Erro',
                `Erro ao abrir link de resgate: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            );
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={cupons}
                keyExtractor={(item) => item.id.toString() || Math.random().toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
                ListHeaderComponent={() => (
                    <View>
                        <Text style={styles.title}>Meus Cupons</Text>
                        <Text style={styles.subtitle}>{cupons.length === 1 ? '1 cupom encontrado.' : `${cupons.length} cupons encontrados.`}</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.cupomContainer}
                        onPress={() => {
                            setSelectedCupom(item);
                            setModalVisible(true);
                        }}
                    >
                        <View style={styles.cupomCodigoContainer}>
                            <Text style={{ color: COLORS.white, fontSize: normaSizes(12), fontWeight: 'bold' }} selectable>CUPOM: #{item.codigo.slice(0, 4) + '-' + item.codigo.slice(4)}</Text>
                        </View>
                        <View style={styles.cupomLojaLogoContainer}>
                            <Image
                                source={urlToLojasLogo(String(item.loja?.logo))}
                                style={styles.lojaLogo}
                            />
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', width: '100%'}}>
                            <Text style={styles.cupomLojaNome}><Ionicons name="storefront" color={COLORS.primary} size={14} /> {item.loja.nome}</Text>
                            <Text style={styles.cupomValue}>{item.tipo === 'R$' ? 'R$ ' + formatNumber(item.valor) : item.valor + '%'}</Text>
                        </View>
                        <View style={styles.rodapeCupom}>
                            <View style={[styles.itemRodape]}>
                                <Text style={[styles.rodapeTexto, { color: cupomStatus(item.status).color }]}>{cupomStatus(item.status).label}</Text>
                            </View>
                            <View style={[styles.itemRodape]}>
                                <TimeToEnd
                                    endTimestamp={checkDateToEnd(String(item.criado_em), String(item.validade))}
                                    FONTSTYLE={{ fontSize: 14, color: '#222' }}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                    />
                }
            />

            {/* Modal de detalhes do cupom */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                    setSelectedCupom(null);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <TouchableOpacity
                        onPress={() => {
                            setModalVisible(false);
                            setSelectedCupom(null);
                        }}
                        style={{ position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, right: 20, zIndex: 10, backgroundColor: '#fff', padding: 6, borderRadius: 8, borderWidth: 1, borderColor: COLORS.primary, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: normaSizes(16), fontWeight: 'bold' }}> [x]Fechar</Text>
                    </TouchableOpacity>
                    <ScrollView
                        style={{ flex: 1, width: '95%', backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 20, paddingTop: 40, maxHeight: '90%' }}
                        contentContainerStyle={{ alignItems: 'center', paddingBottom: 50 }}>
                        {selectedCupom && (
                            <View style={{ alignItems: 'center', paddingBottom: 30 }}>
                                {selectedCupom.status === 1 && (
                                    <View style={{ flexDirection: 'column', width: '100%', gap: 20, alignItems: 'center', marginTop: 20, marginBottom: 40 }}>
                                        <Text style={{ fontSize: normaSizes(16), color: COLORS.grayDark }}><Ionicons name="storefront" color={COLORS.primary} size={normaSizes(16)} /> {selectedCupom.loja.nome} | Cupom: {selectedCupom.codigo}</Text>
                                        <Text style={{ fontSize: normaSizes(16), textAlign: 'center' }}>Apresente o QrCode abaixo na loja:</Text>
                                        <QRCode
                                            value={selectedCupom.codigo}
                                            size={150}
                                        />
                                        <Text style={{ fontSize: normaSizes(16), textAlign: 'center' }}>ou informe o código abaixo ou COPIE:</Text>
                                        <Text style={{ fontSize: normaSizes(20), fontWeight: 'bold', backgroundColor: '#f0f0f0', padding: 10 }} selectable>{selectedCupom.codigo.slice(0, 4) + '-' + selectedCupom.codigo.slice(4)}</Text>
                                    </View>
                                )}
                                <View style={{ flexDirection: 'column', width: '100%', gap: 5, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Prazo LIMITE (Dias, horas restantes) para usar este cupom:</Text>
                                    <View style={{ backgroundColor: '#fffb00ff', padding: 10, borderRadius: 8, marginTop: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <TimeToEnd
                                            endTimestamp={checkDateToEnd(String(selectedCupom.criado_em), String(selectedCupom.validade))}
                                            FONTSTYLE={{ fontSize: normaSizes(24), color: '#222' }}
                                        />
                                    </View>
                                </View>
                                <View style={styles.CupomInfo}>
                                    <Text style={styles.title}>Cupom: {selectedCupom.tipo === 'R$' ? 'R$ ' + formatNumber(selectedCupom.valor) : selectedCupom.valor + '% de Desconto'}</Text>
                                    <View style={styles.tableContainer}>
                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableLabel}>Loja:</Text>
                                            <Text style={styles.tableValue}><Ionicons name="storefront" color={COLORS.primary} size={normaSizes(20)} /> {selectedCupom.loja.nome}</Text>
                                        </View>

                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableLabel}>Telefone:</Text>
                                            <Text style={styles.tableValue} selectable><Ionicons name="call" color={COLORS.primary} size={normaSizes(20)} /> {formatarTelefone(selectedCupom.loja.telefone1)}</Text>
                                        </View>

                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableLabel}>WhatsApp:</Text>
                                            <TouchableOpacity onPress={() => handleAbreLink(`https://wa.me/55${selectedCupom.loja.telefone1}?text=`, selectedCupom.codigo)} style={[styles.tableValue, { alignItems: 'center', flexDirection: 'row', gap: 10, justifyContent: 'center', backgroundColor: '#25D366', padding: 8, borderRadius: 5 }]}>
                                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: normaSizes(18) }}>
                                                    <FontAwesome5 name="whatsapp-square" size={normaSizes(18)} color="black" /> Falar com a Loja
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableLabel}>Email:</Text>
                                            <Text style={styles.tableValue} selectable><Ionicons name="mail" color={COLORS.primary} size={normaSizes(20)} /> {selectedCupom.loja.email}</Text>
                                        </View>

                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableLabel}>Endereço:</Text>
                                            <Text style={styles.tableValue} selectable><Ionicons name="location" color={COLORS.primary} size={normaSizes(20)} /> {selectedCupom.loja.endereco}</Text>
                                        </View>
                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableLabel}>Cidade:</Text>
                                            <Text style={styles.tableValue} selectable>{selectedCupom.loja.cidade?.cidade + ' - ' + selectedCupom.loja.cidade?.estado}</Text>
                                        </View>
                                        {selectedCupom.loja.localizacao_link && (
                                            <View style={styles.tableRow}>
                                                <Text style={styles.tableLabel}><Ionicons name="location" color={'white'} size={normaSizes(16)} /> Como chegar:</Text>
                                                <TouchableOpacity onPress={() => handleAbreLink(selectedCupom.loja.localizacao_link || '', selectedCupom.codigo)} style={[styles.tableValue, { alignItems: 'center', flexDirection: 'row', gap: 10, justifyContent: 'center', backgroundColor: '#0044baff', padding: 8, borderRadius: 5 }]}>
                                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: normaSizes(18) }}>
                                                        <FontAwesome5 name="map-marked-alt" size={18} color="white" /> Ver no Mapa
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}

                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableLabel}>Adquirido em:</Text>
                                            <Text style={styles.tableValue}>{formatarDataTimeStampToPtBr(selectedCupom.criado_em)}</Text>
                                        </View>
                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableLabel}>Tipo:</Text>
                                            <Text style={styles.tableValue}>{selectedCupom.tipo === 'R$' ? 'Desconto em Reais' : 'Desconto em Porcentagem'}</Text>
                                        </View>

                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableLabel}>Valor:</Text>
                                            <Text style={styles.tableValue}>{selectedCupom.tipo === 'R$' ? 'R$ ' + formatNumber(selectedCupom.valor) : selectedCupom.valor + '% de Desconto'}</Text>
                                        </View>

                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableLabel}>Validade:</Text>
                                            <Text style={[styles.tableValue, { color: 'red', fontWeight: 'bold' }]}>{formatarDataTimeStampToPtBr(selectedCupom.validade)}</Text>
                                        </View>
                                        <View style={styles.tableRow}>
                                            <Text style={[styles.tableLabel, { width: '100%', textAlign: 'center' }]}>Regras e condições de uso (⚠️Leia com atenção!):</Text>
                                        </View>
                                        {selectedCupom.regras && typeof selectedCupom.regras === 'object'
                                            && Object.entries(selectedCupom.regras).map(([key, value]) => (
                                                <View style={styles.tableRow} key={key}>
                                                    <Text style={styles.tableLabel}>#{key}</Text>
                                                    <Text style={styles.tableValue}>{String(value)}</Text>
                                                </View>
                                            ))
                                        }
                                    </View>
                                </View>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </Modal >
        </View >
    );
}