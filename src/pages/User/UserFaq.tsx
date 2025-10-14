import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Button, Share, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendEmailContato } from '@/services/users';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { COLORS } from '@/constants';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { ButtonBack } from '@/components/ButtonBack';

const faqList = [
  {
    question: "Como faço para usar um cupom?",
    answer: "Acesse a aba 'Meus Cupons', escolha o cupom que deseja usar e toque em 'Usar Cupom'. Mostre o QR Code ao atendente da loja, ou informe o código do cupom para validar o uso."
  },
  {
    question: "O que acontece se o cupom vencer?",
    answer: "Cada cupom tem uma data de validade (ex.: 1 dia, 24 horas, ou conforme definido pela loja). Após o vencimento, o cupom perde a validade automaticamente e não pode ser reativado."
  },
  {
    question: "Posso usar o mesmo cupom mais de uma vez?",
    answer: "Não. Cada cupom é único e pessoal — após o uso, seu status muda para 'Usado' e ele não pode ser reutilizado."
  },
  {
    question: "Onde encontro as regras de uso de cada cupom?",
    answer: "As regras específicas ficam visíveis na página de detalhes do cupom, na página de uso (junto ao QR Code) ou em 'Meus Cupons', dentro das informações do cupom."
  },
  {
    question: "Como encontro cupons de lojas da minha cidade?",
    answer: "Use a aba 'Buscar' na barra inferior do app. Você pode pesquisar por nome da loja, categoria (Restaurantes, Calçados, Vestuário etc.) ou aplicar filtros por tipo de oferta."
  },
  {
    question: "Posso seguir uma loja específica?",
    answer: "Sim! Você pode seguir suas lojas favoritas e receber notificações sobre novas campanhas e atualizações de cupons."
  },
  {
    question: "Onde vejo informações da loja (WhatsApp, endereço etc.)?",
    answer: "Esses dados estão disponíveis na página de detalhes do cupom, na página de uso do cupom ou através da aba 'Meus Cupons'."
  },
  {
    question: "Como altero meus dados de cadastro ou senha?",
    answer: "Acesse 'Meu Perfil' → 'Meus Dados' ou 'Alterar Senha'. Lá você pode atualizar informações pessoais, senha e outros dados do seu cadastro."
  },
  {
    question: "Como entro em contato com o suporte?",
    answer: "Vá em 'Meu Perfil' → 'Ajuda e FAQ'. Você encontrará um formulário de contato para envio direto de mensagens à equipe de suporte."
  },
  {
    question: "Posso transferir um cupom para outra pessoa?",
    answer: "Não. Os cupons são pessoais e intransferíveis, vinculados à sua conta de usuário."
  },
  {
    question: "O que fazer se o QR Code não funcionar na loja?",
    answer: "Informe o código do cupom (mostrado logo abaixo do QR Code). O lojista pode validar manualmente pelo app 'QueroDesconto Parceiros'."
  }
];

export default function FaqScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Formulário de contato
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleEnviarContato = async () => {
    if (!nome.trim() || !email.trim() || !mensagem.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    // Validação simples de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Erro', 'E-mail inválido.');
      return;
    }
    setEnviando(true);
    setEnviado(false);
    try {
      await sendEmailContato({ name: nome, email, message: mensagem });
      setEnviado(true);
      setNome('');
      setEmail('');
      setMensagem('');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível enviar sua mensagem. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

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

  const handleShare = async () => {
    try {
      const shareMessage = 'Confira as dúvidas frequentes do GCamp!';
      const shareUrl = 'https://gchamps.com/faq'; // URL do FAQ

      await Share.share(
        {
          title: 'GCamp FAQ',
          message: shareMessage,
          url: shareUrl,
        },
        {
          // This makes the share dialog better on iOS
          dialogTitle: 'Compartilhar FAQ do GCamp',
          subject: 'FAQ do GCamp'
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ButtonBack goTo={'back'} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* =================================================== Versão do App */}
          <Text style={{ fontStyle: 'italic' }}>Versão 1.0.0</Text>
          <Text style={{ fontSize: 16, color: '#333', marginBottom: 24 }}>
            Bem-vindo ao Quero Desconto! Aqui você as melhores lojas da cidade com os melhores descontos pra você
            Navegue pelas FAQs para esclarecer suas dúvidas ou entre em contato com nosso suporte.
          </Text>
          <Text>
            O QueroDesconto conecta você às melhores ofertas e cupons de desconto do comércio local — tudo em um só lugar.
            Basta escolher uma loja, pegar seu cupom e economizar!{'\n'}{'\n'}

            💡 É simples:{'\n'}{'\n'}

            1. Baixe o app QueroDesconto e faça seu cadastro gratuito.{'\n'}{'\n'}

            2. Explore as campanhas ativas das lojas da sua cidade e escolha o cupom que desejar.{'\n'}{'\n'}

            3. Guarde seu cupom na aba Meus Cupons — ele ficará disponível até o fim do prazo de validade.{'\n'}{'\n'}

            4. Use o cupom na loja física: apresente o QR Code (ou informe o código do cupom) ao atendente.{'\n'}{'\n'}

            5. O lojista valida o uso no app QueroDesconto Parceiros, e pronto — você garante seu desconto! 🎉{'\n'}{'\n'}

            ⚠️ Importante:{'\n'}{'\n'}

            Cada cupom tem prazo de validade — se expirar, não poderá ser utilizado.{'\n'}

            As regras de uso são definidas pela loja e podem variar conforme o tipo de desconto.
          </Text>

          <View>
            <Text style={styles.title}>Faça parte da nossa comunidade:</Text>
            <Text>Siga-nos nas redes sociais para ficar por dentro das novidades!</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, marginVertical: 16 }}>
              <View>
                <Text style={{ fontWeight: 'bold' }}>Instagram:</Text>
                <TouchableOpacity onPress={() => handleAbreLink('https://instagram.com/gcamp.app', 'INSTAGRAM')}>
                  <Ionicons name="logo-instagram" size={60} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
              <View>
                <Text style={{ fontWeight: 'bold' }}>WhatsApp:</Text>
                <TouchableOpacity onPress={() => handleAbreLink('https://t.me/gcampapp', 'WHATSAPP')}>
                  <FontAwesome name="whatsapp" size={60} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>

          </View>
          <Text style={styles.title}>FAQ & Suporte</Text>
          {faqList.map((item, idx) => (
            <View key={idx} style={styles.faqItem}>
              <TouchableOpacity onPress={() => handleToggle(idx)} style={styles.questionButton}>
                <Text style={styles.questionText}>{item.question}</Text>
              </TouchableOpacity>
              {openIndex === idx && (
                <View style={styles.answerBox}>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}
          <View style={{ height: 40 }} />
          {/* =================================================== Rodapé com Contato */}
          <Text style={{ fontSize: 16, color: '#333', marginBottom: 16 }}>
            Se você tiver mais perguntas ou precisar de ajuda, entre em contato conosco:
          </Text>

          {/* Formulário de contato */}
          <View style={styles.formContato}>
            <Text style={styles.formTitle}>Formulário de Contato e Suporte</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={nome}
              onChangeText={setNome}
              editable={!enviando}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!enviando}
            />
            <TextInput
              style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
              placeholder="Mensagem"
              value={mensagem}
              onChangeText={setMensagem}
              multiline
              editable={!enviando}
            />
            <TouchableOpacity
              onPress={handleEnviarContato}
              style={{
                backgroundColor: enviando ? '#FFA94D' : COLORS.primary,
                padding: 14,
                borderRadius: 8,
                alignItems: 'center',
                marginTop: 8,
              }}
              disabled={enviando}
            >
              {enviando ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Enviar Mensagem</Text>
              )}
            </TouchableOpacity>
            {enviado && (
              <Text style={{ color: 'green', marginTop: 10, textAlign: 'center' }}>
                Mensagem enviada com sucesso! Em breve entraremos em contato.
              </Text>
            )}
          </View>
          <Text style={{ fontSize: 14, color: '#666', marginTop: 12, alignItems: 'center', textAlign: 'center' }}>
            Ou fale conosco pelo <Ionicons name="logo-instagram" size={24} color="black" /> Instagram: <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>@gcamp.app</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  scroll: { padding: 24, paddingBottom: 100 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: 24,
    textAlign: 'center',
  },
  faqItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  questionButton: {
    padding: 8,
  },
  questionText: {
    fontSize: 16,
    color: '#8B4513',
    fontWeight: 'bold',
  },
  answerBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 6,
    padding: 10,
    marginTop: 4,
  },
  answerText: {
    fontSize: 15,
    color: '#333',
  },
  formContato: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    marginTop: 8,
    elevation: 1,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 15,
    backgroundColor: '#FFF',
    color: '#333',
  },
});
