import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Alert, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { updateUser, updateFotoUser } from '@services/users';
import { Ionicons } from '@expo/vector-icons';
//import { urlToFotos } from '@/utils/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Image as ExpoImage } from 'expo-image';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { COLORS } from '@/constants';

const initialStateFoto = {
  uri: '',
  name: '',
  type: 'image/jpeg', // Padrão para JPEG, pode ser alterado conforme necessário
};

export default function EditarDados() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [foto, setFoto] = useState('');
  const [formFoto, setFormFoto] = useState(initialStateFoto);
  const [fotoFile, setFotoFile] = useState<any>(null);
  const [userLastMedal, setUserLastMedal] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { signOut, isAuthenticated, user } = useAuth();
  const [userNome, setUserNome] = useState('usuario');
  const [userId, setUserId] = useState(null);
  const [fotoCacheBuster, setFotoCacheBuster] = useState(Date.now());

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
    }
    loadDataUser();

  }, [isAuthenticated]);

  async function loadDataUser() {
    try {

      if (!isAuthenticated) {
        return;
      }

      const userData = user?.user;

      if (userData) {
        setUserNome(userData.nome);
        setUserId(userData.id);
        setFoto(userData.foto || '');
        setUserLastMedal(userData.ultima_medalha || '');
      }

      setLoading(true);

    } catch (e) {
      console.error('Erro ao carregar dados do usuário:', e);
      //Alert.alert('Erro', 'Não foi possível carregar seus dados.');
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Você tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: signOut }
      ]
    );
  };

  const handleFotoUser = async () => {
    if (!fotoFile) {
      Alert.alert('Erro', 'Nenhuma foto selecionada.');
      return;
    }

    try {
      setSaving(true);

      // Verifique se o arquivo realmente existe (Android pode gerar URI inválida)
      const checkUri = fotoFile.uri;
      if (Platform.OS === 'android') {
        // Teste de acesso ao arquivo (opcional, para debug)
        try {
          const response = await fetch(checkUri);
          if (!response.ok) throw new Error('Arquivo não acessível');
        } catch {
          Alert.alert('Erro', 'Não foi possível acessar o arquivo da foto.');
          setSaving(false);
          return;
        }
      }
      /*
            const fotoData = {
              apelido: form.apelido,
              foto: {
                uri: fotoFile.uri,
                name: fotoFile.name || 'foto.jpg',
                type: fotoFile.type || 'image/jpeg', // aceita jpeg ou png conforme selecionado
              }
            };
            */

      const formData = new FormData();
      formData.append('apelido', 'Lindo');
      formData.append('foto', {
        uri: fotoFile.uri,
        name: fotoFile.name,
        type: fotoFile.type,
      } as any);

      await updateFotoUser(formData);

      // Atualiza foto no estado global do usuário
      if (user?.user) {
        user.user.foto = fotoFile.name; // Atualiza a foto no estado global
      }
      //Alert.alert('Sucesso', 'Foto atualizada com sucesso!');
      await loadDataUser();
      setFotoCacheBuster(Date.now()); // Atualiza o cache buster

    } catch (e: any) {

      //console.error('Erro ao atualizar foto:', e);

      let errorMessage = 'Não foi possível atualizar a foto.';

      if (e?.response?.data?.message) {
        errorMessage = e.response.data.message;
      } else if (e?.message === 'Network Error') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }

      Alert.alert('Erro', errorMessage);
    } finally {
      setSaving(false);
      setFotoFile(null);
    }
  }

  if (!isAuthenticated) {
    return null;
  }


  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'É necessário permitir acesso à galeria.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.5,
        aspect: [1, 1],
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];

        // Corrigir URI para Android
        let uri = asset.uri;
        if (Platform.OS === 'android' && !uri.startsWith('file://')) {
          uri = 'file://' + uri;
        }

        // Garantir nome e type válidos
        const name = asset.fileName || `foto_${Date.now()}.jpg`;

        // Corrigir o type para sempre ser um MIME type válido
        let mimeType = asset.type === 'image' || !asset.type
          ? (name.endsWith('.png') ? 'image/png'
            : (name.endsWith('.jpg') || name.endsWith('.jpeg')) ? 'image/jpeg'
              : 'image/jpeg')
          : asset.type;

        setFoto(uri);
        setFotoFile({
          uri,
          name,
          type: mimeType,
        });
      }
    } catch (error) {
      //console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'É necessário permitir acesso à câmera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.5,
        aspect: [1, 1],
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];

        // Corrigir URI para Android
        let uri = asset.uri;
        if (Platform.OS === 'android' && !uri.startsWith('file://')) {
          uri = 'file://' + uri;
        }

        const name = asset.fileName || `camera_${Date.now()}.jpg`;

        // Corrigir o type para sempre ser um MIME type válido
        let mimeType = asset.type === 'image' || !asset.type
          ? (name.endsWith('.png') ? 'image/png'
            : (name.endsWith('.jpg') || name.endsWith('.jpeg')) ? 'image/jpeg'
              : 'image/jpeg')
          : asset.type;

        setFoto(uri);
        setFotoFile({
          uri,
          name,
          type: mimeType,
        });
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  };

  const handleRemovePhoto = () => {
    setFoto('');
    setFotoFile(null);
  };

  if (loading) {
    return (

      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 16, color: COLORS.secondary }}>Carregando...</Text>
      </SafeAreaView>

    );
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: -20 }}>
      <ScrollView contentContainerStyle={{
        paddingHorizontal: 24,
        paddingBottom: 140,
      }}>

        <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.primary, alignSelf: 'center', marginVertical: 40 }}>
          {userNome}
        </Text>
        {/*}
        <View style={{ flexDirection: 'row', width: '100%', gap: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
        
          <View style={{ width: '35%'}}>
            <ExpoImage
              source={fotoFile ? { uri: fotoFile.uri } : urlToFotos(foto)}
              style={{
                width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#FF8C00', marginBottom: 8
              }}
              transition={500}
              cachePolicy="memory-disk"
              contentFit="cover"
            />
          </View>
          
          <View style={{ width: '50%', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: 12 }}>

            <View style={{ flexDirection: 'row', gap: 20 }}>
              <TouchableOpacity onPress={handlePickImage}>
                <Ionicons name="image" size={32} color="#FF8C00" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleTakePhoto}>
                <Ionicons name="camera" size={32} color="#FF8C00" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={handleFotoUser}
              disabled={!fotoFile || saving}
              style={{
                marginTop: 8,
                padding: 8,
                backgroundColor: (!fotoFile || saving) ? '#b5b5b5ff' : '#FF8C00',
                borderRadius: 8,
                minWidth: '75%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} />
              ) : (
                <Ionicons name="cloud-upload" size={20} color="#FFF" style={{ marginRight: 8 }} />
              )}
              <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold' }}>
                {saving ? 'Enviando...' : 'Atualizar Foto'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      */}
        <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {/* Menu de botões para paginas de usuários */}
          <TouchableOpacity
            onPress={() => navigation.navigate('UserDados')}
            style={styles.buttonMenu}
          >
            <Ionicons name="create-outline" size={20} color="#FFF" />
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
              Editar Dados
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('UserTrocaSenha')}
            style={styles.buttonMenu}
          >
            <Ionicons name="lock-closed-outline" size={20} color="#FFF" />
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Alterar Senha</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('UserFaq')}
            style={[styles.buttonMenu, { width: '100%' }]}
          >
            <Ionicons name="help-circle-outline" size={20} color="#FFF" />
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Ajuda</Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={{ padding: 8, backgroundColor: 'brown', borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}
        >
          <Ionicons name="log-out-outline" size={20} color="#FFF" />
          <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Sair</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Excluir Conta',
              'Você tem certeza que deseja excluir sua conta? Esta ação é irreversível.',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Excluir',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await updateUser({ status: 'excluir' });
                      Alert.alert('Conta Excluída', 'Sua conta foi excluída com sucesso.');
                      signOut();
                    } catch (error) {
                      console.error('Erro ao excluir conta:', error);
                      Alert.alert('Erro', 'Não foi possível excluir sua conta. Tente novamente mais tarde.');
                    }
                  },
                },
              ]
            );
          }}
          style={{ padding: 12, marginTop: 10 }}
        >
          <Text>
            - Excluir minha conta
          </Text>

        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#333',
  },
  buttonMenu: {
    padding: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '47%',
    height: 100, // Altura fixa para os botões
  },
  userMedal: {
    position: 'absolute',
    bottom: -10,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#ffe600ff',
    marginBottom: 8
  }
});