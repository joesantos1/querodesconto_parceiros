import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { validarEmail, validarSenha, validarTelefone } from '@/utils/utils';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { COLORS } from '@/constants';

export default function Login() {
    const auth = useAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginType, setLoginType] = useState<'email' | 'telefone'>('email');
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    // Redireciona se já estiver logado
    /*
    useEffect(() => {
        if (auth.isAuthenticated) {
            navigation.navigate('TabNavigator');
        }
    }, [auth.isAuthenticated]);
*/
    const handleLogin = async () => {
        if (loginType === 'email') {
            if (!validarEmail(email)) {
                setSenha('');
                Alert.alert('Erro', 'E-mail inválido');
                return;
            }
        } else {
            if (!validarTelefone(telefone)) {
                setSenha('');
                Alert.alert('Erro', 'Telefone inválido');
                return;
            }
        }

        if (!validarSenha(senha)) {
            setSenha(''); // Limpa a senha
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
            return;
        }

        try {
            setLoading(true);
            if (loginType === 'email') {
                await auth.signIn(email, '', senha);
            } else {
                const normalizedTelefone = telefone.replace(/\D/g, ''); // Remove caracteres não numéricos
                await auth.signIn('', normalizedTelefone, senha);
            }
        } catch (error: any) {
            setSenha(''); // Limpa a senha
            Alert.alert('Erro', error.response.data?.message || 'Falha no login. Verifique suas login e senha.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        if (field === 'telefone') {
            if (value.length > 15) {
                value = value.slice(0, 15);
            }
            if (value.length > 8) {
                const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                setTelefone(formatted);
            } else {
                setTelefone(value);
            }
        }
    }

    const handleBack = () => {
        navigation.navigate('TabNavigator', { screen: 'Home' });
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                <ExpoImage
                    source={'@/assets/images/qd_logo.png'}
                    style={{ width: 150, height: 150, alignSelf: 'center', marginBottom: 20, resizeMode: 'contain' }}
                    accessibilityLabel="Logo do GCamp"
                    contentFit="contain"
                    transition={1000}
                    cachePolicy="memory-disk"
                />
                <Text style={styles.title}>Login</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: loginType === 'email' ? COLORS.primary : '#FFF',
                            borderColor: COLORS.primary,
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 8,
                            marginRight: 8,
                        }}
                        onPress={() => setLoginType('email')}
                        disabled={loading}
                    >
                        <Text style={{ color: loginType === 'email' ? '#FFF' : COLORS.primary, fontWeight: 'bold' }}>Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            backgroundColor: loginType === 'telefone' ? COLORS.primary : '#FFF',
                            borderColor: COLORS.primary,
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 8,
                        }}
                        onPress={() => setLoginType('telefone')}
                        disabled={loading}
                    >
                        <Text style={{ color: loginType === 'telefone' ? '#FFF' : COLORS.primary, fontWeight: 'bold' }}>Telefone</Text>
                    </TouchableOpacity>
                </View>
                {loginType === 'email' ? (
                    <>
                        <Text style={{ fontStyle: 'italic', color: '#999' }}>Digite seu email</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </>
                ) : (
                    <>
                        <Text style={{ fontStyle: 'italic', color: '#999' }}>Digite seu telefone: (DDD) 00000-0000</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="phone-pad"
                            autoCapitalize="none"
                            value={telefone}
                            onChangeText={v => handleChange('telefone', String(v))}
                            placeholder='(00) 00000-0000'
                        />
                    </>
                )}
                <Text style={{ fontStyle: 'italic', color: '#999' }}>Digite sua senha</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Entrar</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#FFF', borderWidth: 1, borderColor: COLORS.primary }]}
                    onPress={() => navigation.navigate('NewPass')}
                    disabled={loading}
                >
                    <Text style={[styles.buttonText, { color: COLORS.primary }]}>Esqueci minha senha</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.buttonRegister]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    <Ionicons name="person-add" size={20} color="white" />
                    <Text style={[styles.buttonText]}>
                        Fazer meu cadastro (Grátis)
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={handleBack}
                    disabled={loading}
                >
                    <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                        Voltar
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingBottom: 100,
        justifyContent: 'center',
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: COLORS.primary,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: COLORS.primary,
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    buttonSecondary: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    buttonRegister: {
        backgroundColor: COLORS.secondary,
        borderWidth: 1,
        borderColor: COLORS.primary,
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    buttonTextSecondary: {
        color: COLORS.primary,
    }
});