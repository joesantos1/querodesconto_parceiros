import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Linking, Alert, RefreshControl, Modal, Button, TextInput, FlatList } from 'react-native';
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from 'react-native-safe-area-context';
import { validarCupom, updateStatusCupomUsuario, getUltimosCuponsValidados } from '@/services/cupons';
import { COLORS, normaSizes } from '@/constants';
import { createCupomCreateEditStyles as createStyles } from '@/styles/CupomCreateEditStyles';
import { Image } from 'expo-image';
import { urlToLojasLogo, formatarDataTimeStampToPtBr2 } from '@/utils/utils';
import { Ionicons } from '@expo/vector-icons';

const styles = createStyles();

export default function ValidaCupom() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const cameraRef = useRef<CameraView>(null);
    const qrCodeLock = useRef(false);
    const [showModalValidaViaQrCode, setShowModalValidaViaQrCode] = useState(true);
    const [showModalDetalhes, setShowModalDetalhes] = useState(false);
    const [codigoCupom, setCodigoCupom] = useState('');
    const [codigoCupomInput, setCodigoCupomInput] = useState(false);
    const [confirmaResgateButton, setConfirmaResgateButton] = useState(false);
    const [cupomDetalhes, setCupomDetalhes] = useState<any>(null);
    const [processandoUso, setProcessandoUso] = useState(false);
    const [lastCupons, setLastCupons] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLastCupons = async () => {
        try {
            const response = await getUltimosCuponsValidados();
            setLastCupons(response);
        } catch (error) {
            console.error('Error fetching last validated cupons:', error);
        }
    };

    useEffect(() => {
        fetchLastCupons();
    }, [fetchLastCupons]);

    const handleValidarViaQrCode = async () => {
        if (!permission) {
            // Aguarda a permissão ser carregada
            return;
        }

        if (!permission.granted) {
            const p = await requestPermission();

            if (!p.granted) {
                Alert.alert(
                    'Permissão necessária',
                    'É necessário permitir o acesso à câmera para escanear QR codes.',
                    [
                        { text: 'Cancelar', style: 'cancel' },
                        { text: 'Configurações', onPress: () => Linking.openSettings() }
                    ]
                );
                return;
            }
        }

        setShowModalDetalhes(false);
        setCodigoCupom('');
        setCodigoCupomInput(false);
        setConfirmaResgateButton(false);
        qrCodeLock.current = false;

        setShowModalValidaViaQrCode(true);
    };

    const handleValidarCodigo = async (codigo: string) => {
        if (!codigo.trim()) {
            Alert.alert('Erro', 'Código inválido. Por favor, tente novamente.');
            return;
        }

        setShowModalValidaViaQrCode(false);
        qrCodeLock.current = false;

        try {
            const response = await validarCupom(codigo.trim());
            setCupomDetalhes(response);
            setShowModalDetalhes(true);
        } catch (error) {
            console.error('Erro ao validar código:', error);
            Alert.alert('Erro', 'Não foi possível validar o cupom. Verifique o código e tente novamente.');
        }
    };

    const handleConfirmarUso = async () => {
        if (!cupomDetalhes?.cupom?.id) {
            Alert.alert('Erro', 'Dados do cupom não encontrados.');
            return;
        }

        Alert.alert(
            'Confirmar Uso',
            `Tem certeza que deseja confirmar o uso deste cupom?\n\nEsta ação não pode ser desfeita.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setProcessandoUso(true);
                            await updateStatusCupomUsuario(
                                cupomDetalhes.codigo,
                                cupomDetalhes.usuario.email
                            );

                            Alert.alert('Sucesso!', 'Cupom utilizado com sucesso!', [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        setCupomDetalhes(null);
                                        setShowModalDetalhes(false);
                                    }
                                }
                            ]);
                            resetStates();
                            fetchLastCupons();
                        } catch (error: any) {
                            Alert.alert('Erro', 'Não foi possível confirmar o uso do cupom. Tente novamente.');
                        } finally {
                            setProcessandoUso(false);
                        }
                    }
                }
            ]
        );
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchLastCupons();
        setRefreshing(false);
    };

    const resetStates = () => {
        setCupomDetalhes(null);
        setShowModalDetalhes(false);
        setShowModalValidaViaQrCode(false);
        setCodigoCupom('');
        setCodigoCupomInput(false);
        qrCodeLock.current = false;
    };

    // Verificação se as permissões estão sendo carregadas
    if (permission === null) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text>Carregando permissões...</Text>
            </SafeAreaView>
        );
    }

    if (refreshing) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text>Atualizando...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#e2e2e2ff' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 20 }}><Ionicons name="qr-code" size={24} color={COLORS.black} /> Validação de Cupom</Text>
            <TouchableOpacity
                onPress={handleValidarViaQrCode}
                style={{
                    backgroundColor: COLORS.primary,
                    padding: 15,
                    borderRadius: 8,
                    alignItems: 'center'
                }}
            >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Escanear QR Code</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 20 }}><Ionicons name="pricetag" size={24} color={COLORS.black} /> Últimos Cupons validados:</Text>

            <FlatList
                data={lastCupons}
                keyExtractor={(item) => item.codigo.toString()}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                renderItem={({ item }) => (
                    <View style={styles.lastCuponsItem}>
                        <Text style={[styles.lastCuponStats, { fontWeight: 'bold' }]}>Codigo: {item.codigo}</Text>
                        <Text style={[styles.lastCuponStats, { fontSize: 20 }]}><Ionicons name="person" size={20} color={"black"} /> {item.usuario.nome}</Text>
                        <Text style={styles.lastCuponStats}>{item.tipo === '%' ? item.valor + '%' : 'R$ ' + item.valor.toFixed(2)}</Text>
                        <Text style={styles.lastCuponStats}><Ionicons name="storefront" size={20} color={"black"} /> {item.loja.nome}</Text>
                        <Text style={styles.lastCuponStats}>{formatarDataTimeStampToPtBr2(item.updated_at)}</Text>
                    </View>
                )}
            />

            <Modal
                animationType="slide"
                transparent={false}
                visible={showModalValidaViaQrCode}
                onRequestClose={() => setShowModalValidaViaQrCode(false)}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
                    <Text style={[styles.title, { marginTop: 50, textAlign: 'center' }]}>
                        Validar Cupom via QR Code
                    </Text>

                    {!codigoCupomInput && permission?.granted && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                            <View style={{
                                width: '100%',
                                height: 400,
                                borderRadius: 10,
                                overflow: 'hidden',
                                marginBottom: 20
                            }}>
                                <CameraView
                                    style={{ flex: 1 }}
                                    facing="back"
                                    barcodeScannerSettings={{
                                        barcodeTypes: ["qr", "pdf417", "ean13", "ean8", "code128"],
                                    }}
                                    onBarcodeScanned={({ data }) => {
                                        if (data && !qrCodeLock.current) {
                                            qrCodeLock.current = true;
                                            setTimeout(() => {
                                                handleValidarCodigo(data);
                                            }, 500);
                                        }
                                    }}
                                />
                            </View>

                            <Text style={{ textAlign: 'center', marginBottom: 20, color: COLORS.gray }}>
                                Posicione o QR code dentro da área de scan
                            </Text>

                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity
                                    onPress={() => setCodigoCupomInput(true)}
                                    style={{
                                        backgroundColor: COLORS.secondary,
                                        padding: 10,
                                        borderRadius: 5,
                                        flex: 1
                                    }}
                                >
                                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>Digitar Código</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setShowModalValidaViaQrCode(false)}
                                    style={{
                                        backgroundColor: COLORS.danger,
                                        padding: 10,
                                        borderRadius: 5,
                                        flex: 1
                                    }}
                                >
                                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>Fechar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {!permission?.granted && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                            <Text style={{ textAlign: 'center', marginBottom: 20 }}>
                                Permissão de câmera necessária para escanear QR codes
                            </Text>
                            <TouchableOpacity
                                onPress={requestPermission}
                                style={{
                                    backgroundColor: COLORS.primary,
                                    padding: 15,
                                    borderRadius: 8
                                }}
                            >
                                <Text style={{ color: 'white' }}>Solicitar Permissão</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {codigoCupomInput && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                            <Text style={[styles.title, { marginBottom: 20 }]}>Código do CUPOM</Text>
                            <TextInput
                                style={{
                                    padding: 15,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 5,
                                    width: '100%',
                                    marginBottom: 20,
                                    fontSize: 18,
                                    textAlign: 'center'
                                }}
                                value={codigoCupom}
                                placeholder="Digite o código do cupom"
                                onChangeText={setCodigoCupom}
                                autoCapitalize="characters"
                            />

                            <View style={{ width: '100%', gap: 10 }}>
                                <TouchableOpacity
                                    onPress={() => handleValidarCodigo(codigoCupom)}
                                    disabled={!codigoCupom.trim()}
                                    style={{
                                        backgroundColor: codigoCupom.trim() ? COLORS.primary : COLORS.gray,
                                        padding: 15,
                                        borderRadius: 5
                                    }}
                                >
                                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: normaSizes(20) }}>
                                        Confirmar
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setCodigoCupomInput(false)}
                                    style={{
                                        backgroundColor: COLORS.secondary,
                                        padding: 15,
                                        borderRadius: 5
                                    }}
                                >
                                    <Text style={{ color: 'white', textAlign: 'center', fontSize: normaSizes(20) }}>
                                        Ler QRCode (Câmera)
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setShowModalValidaViaQrCode(false)}
                                    style={{
                                        backgroundColor: COLORS.danger,
                                        padding: 15,
                                        borderRadius: 5
                                    }}
                                >
                                    <Text style={{ color: 'white', textAlign: 'center', fontSize: normaSizes(20) }}>
                                        Cancelar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </SafeAreaView>
            </Modal>

            {/* Modal de Detalhes do Cupom */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={showModalDetalhes}
                onRequestClose={() => setShowModalDetalhes(false)}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
                    <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }}>
                        {cupomDetalhes && (
                            <>
                                {/* Header */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.primary }}>
                                        Detalhes do Cupom
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setShowModalDetalhes(false)}
                                        style={{ padding: 8 }}
                                    >
                                        <Text style={{ fontSize: 18, color: COLORS.danger }}>✕</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Loja */}
                                <View style={{
                                    backgroundColor: COLORS.light,
                                    padding: 15,
                                    borderRadius: 10,
                                    marginBottom: 20,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    {cupomDetalhes.loja?.logo && (
                                        <Image
                                            source={urlToLojasLogo(cupomDetalhes.loja.logo)}
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 30,
                                                marginRight: 15
                                            }}
                                        />
                                    )}
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.dark }}>
                                            {cupomDetalhes.loja?.nome}
                                        </Text>
                                        <Text style={{ fontSize: 14, color: COLORS.gray, marginTop: 5 }}>
                                            Estabelecimento
                                        </Text>
                                    </View>
                                </View>

                                {/* Campanha */}
                                <View style={{
                                    backgroundColor: COLORS.primary + '10',
                                    padding: 15,
                                    borderRadius: 10,
                                    marginBottom: 20,
                                    borderLeftWidth: 4,
                                    borderLeftColor: COLORS.primary
                                }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginBottom: 5 }}>
                                        Campanha
                                    </Text>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.dark }}>
                                        {cupomDetalhes.campanha?.titulo}
                                    </Text>
                                </View>

                                {/* Valor do Cupom */}
                                <View style={{
                                    backgroundColor: COLORS.success + '10',
                                    padding: 20,
                                    borderRadius: 10,
                                    marginBottom: 20,
                                    alignItems: 'center',
                                    borderWidth: 2,
                                    borderColor: COLORS.success,
                                    borderStyle: 'dashed'
                                }}>
                                    <Text style={{ fontSize: 16, color: COLORS.success, marginBottom: 5 }}>
                                        Valor do Desconto
                                    </Text>
                                    <Text style={{ fontSize: normaSizes(42), fontWeight: 'bold', color: COLORS.success }}>
                                        R$ {cupomDetalhes.cupom?.valor?.toFixed(2) || '0,00'}
                                    </Text>
                                    <Text style={{ fontSize: normaSizes(20), color: COLORS.gray, marginTop: 5 }}>
                                        Validade: {cupomDetalhes.cupom?.validade} dia(s)
                                    </Text>
                                </View>

                                {/* Usuario */}
                                <View style={{
                                    backgroundColor: COLORS.light,
                                    padding: 15,
                                    borderRadius: 10,
                                    marginBottom: 20
                                }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 }}>
                                        Cliente
                                    </Text>
                                    <Text style={{ fontSize: normaSizes(20), fontWeight: 'bold', color: COLORS.dark }}>
                                        {cupomDetalhes.usuario?.nome}
                                    </Text>
                                    <Text style={{ fontSize: normaSizes(14), color: COLORS.gray, marginTop: 2 }}>
                                        {cupomDetalhes.usuario?.email}
                                    </Text>
                                    {cupomDetalhes.usuario?.telefone && (
                                        <Text style={{ fontSize: normaSizes(16), color: COLORS.gray, marginTop: 2 }}>
                                            {cupomDetalhes.usuario.telefone}
                                        </Text>
                                    )}
                                </View>

                                {/* Regras */}
                                {cupomDetalhes.cupom?.regras && Object.keys(cupomDetalhes.cupom.regras).length > 0 && (
                                    <View style={{
                                        backgroundColor: COLORS.warning + '10',
                                        padding: 15,
                                        borderRadius: 10,
                                        marginBottom: 30,
                                        borderLeftWidth: 4,
                                        borderLeftColor: COLORS.warning
                                    }}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.warning, marginBottom: 10 }}>
                                            Regras e Condições
                                        </Text>
                                        {Object.entries(cupomDetalhes.cupom.regras).map(([key, value]) => (
                                            <Text key={key} style={{
                                                fontSize: 14,
                                                color: COLORS.dark,
                                                marginBottom: 5,
                                                lineHeight: 20
                                            }}>
                                                • {String(value)}
                                            </Text>
                                        ))}
                                    </View>
                                )}

                                {/* Botão de Confirmar Uso */}
                                <TouchableOpacity
                                    onPress={handleConfirmarUso}
                                    disabled={processandoUso}
                                    style={{
                                        backgroundColor: processandoUso ? COLORS.gray : COLORS.success,
                                        padding: 20,
                                        borderRadius: 15,
                                        alignItems: 'center',
                                        marginBottom: 20,
                                        elevation: 3,
                                        shadowColor: COLORS.black,
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                    }}
                                >
                                    {processandoUso ? (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
                                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                                                Processando...
                                            </Text>
                                        </View>
                                    ) : (
                                        <>
                                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>
                                                ✓ CONFIRMAR USO DO CUPOM
                                            </Text>
                                            <Text style={{ color: 'white', fontSize: 14, opacity: 0.9 }}>
                                                Esta ação não pode ser desfeita
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>

                                {/* Botão Cancelar */}
                                <TouchableOpacity
                                    onPress={() => setShowModalDetalhes(false)}
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderWidth: 2,
                                        borderColor: COLORS.gray,
                                        padding: 15,
                                        borderRadius: 10,
                                        alignItems: 'center',
                                        marginBottom: 20
                                    }}
                                >
                                    <Text style={{ color: COLORS.gray, fontSize: 16, fontWeight: 'bold' }}>
                                        Cancelar
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}