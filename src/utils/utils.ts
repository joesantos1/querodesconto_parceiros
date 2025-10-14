interface FormatDateOptions {
  year: 'numeric' | '2-digit';
  month: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day: 'numeric' | '2-digit';
}

export const formatarDataTimeStampToPtBr = (data: string | number | Date): string => {
  const dataFormatada = new Date(data);
  const opcoes: FormatDateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const dataString: string = dataFormatada.toLocaleDateString('pt-BR', opcoes);
  const horaString: string = dataFormatada.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dataString} ${horaString}`;
};

export const formatarDataTimeStampToPtBr2 = (data: string | number | Date): string => {
  const dataFormatada = new Date(data);
  const opcoes: FormatDateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const dataString: string = dataFormatada.toLocaleDateString('pt-BR', opcoes);
  const horaString: string = dataFormatada.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return `${dataString} ${horaString}`;
};

// Formata data para formato há x dias atrás, x horas atrás, x minutos atrás ou agora
export const formatarDataRelativa = (data: string | number | Date): string => {
  const agora = new Date();
  const dataFormatada = new Date(data);
  const diferencaEmMs = agora.getTime() - dataFormatada.getTime();
  const diferencaEmMinutos = Math.floor(diferencaEmMs / 60000);
  const diferencaEmHoras = Math.floor(diferencaEmMinutos / 60);
  const diferencaEmDias = Math.floor(diferencaEmHoras / 24);

  if (diferencaEmMinutos < 1) return 'Agora';
  if (diferencaEmHoras < 1) return `${diferencaEmMinutos} minuto${diferencaEmMinutos > 1 ? 's' : ''} atrás`;
  if (diferencaEmDias < 1) return `${diferencaEmHoras} hora${diferencaEmHoras > 1 ? 's' : ''} atrás`;
  return `${diferencaEmDias} dia${diferencaEmDias > 1 ? 's' : ''} atrás`;
};

export const formatarMoeda = (valor: number) => {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarSenha = (senha: string): boolean => {
  return senha.length >= 6;
};

export const formatarTelefone = (telefone: string): string => {
  const apenasNumeros = telefone.replace(/\D/g, '');
  if (apenasNumeros.length === 11) {
    return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (apenasNumeros.length === 10) {
    return apenasNumeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
};

export const validarTelefone = (telefone: string): boolean => {
  const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
  return regex.test(telefone);
};

export const getErrorMessage = (error: any): string => {
  if (error.response) {
    return error.response.data.message || 'Erro no servidor';
  }
  return error.message || 'Erro na conexão';
};

export const formatCurrency = (value?: any): string => {
  if (!value) return '';
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

export const formatNumber = (value?: number): string => {
  if (value === undefined || value === null) return '';
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Truncar texto
export const truncateText = (text: string, maxLength: number) => {
  return text?.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text || '—';
};

export const maskPhone = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}

export const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11) return false;
  let sum = 0, rest;
  if (/^(\d)\1+$/.test(cpf)) return false;
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

export const urlToImages = (url: string): any => {
  if (!url || url.trim() === '') return require('../../assets/images/qd_logo.png');
  const baseURL = process.env.EXPO_PUBLIC_IMG_URL;
  return {
    uri: `${baseURL}/uploads/${url}`
  };
}
export const urlToLojasLogo = (url: string): any => {
  if (!url || url.trim() === '') return require('../../assets/images/qd_logo.png');
  const baseURL = process.env.EXPO_PUBLIC_IMG_URL;
  return {
    uri: `${baseURL}/uploads/lojas/${url}`
  };
}
/*
export const urlToFotos = (url: string): any => {
  if (!url || url.trim() === '') return require('@/assets/images/avatar2.png');
  const baseURL = process.env.EXPO_PUBLIC_IMG_URL;
  return {
    uri: `${baseURL}/uploads/${url}`
  };
}
*/
export const emojiPosition = (position: number): string => {
  const emojis = [
    '🥇', '🥈', '🥉'
  ];
  return emojis[position - 1] || '';
}

//funcao formata data para formato DD/NomedoMes/YYYY - Exemplo: 01/Janeiro/2023
export const formatarDataCompleta = (data: string): string => {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const date = new Date(data);
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = meses[date.getMonth()];
  const ano = date.getFullYear();
  return `${dia} de ${mes} de ${ano} às ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

//formata data timestamp para formato DD/MM/YYYY
export const formatarDataTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

//formata texto recebido com tags html de formatação
export const formatarTextoComTags = (texto: string): string => {
  if (!texto) return '';
  return texto
    .replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>')
    .replace(/<i>(.*?)<\/i>/g, '<em>$1</em>')
    .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

//Função ShareByParticipant - Recebe o total de pontos do participante, o total de pontos da equipe e o total de participantes; faz o calculo de porcentagem de pontos do participante em relação ao total da equipe e retorna um valor 00,00
export const shareByMember = (pontosParticipante: number, totalPontosEquipe: number, totalParticipantes: number): string => {
  if (totalPontosEquipe === 0 || totalParticipantes === 0) return '0,00';
  const porcentagem = (pontosParticipante / totalPontosEquipe) * 100;
  const valorPorParticipante = porcentagem.toFixed(2);
  return valorPorParticipante.replace('.', ',');
}

export const checkDateToEnd = (datestart: string, dateEnd: string) => {
  const now = Date.now();
  const start = new Date(datestart).getTime();
  const end = new Date(dateEnd).getTime();

  let dateChamp = '';
  let msg = '';

  if (now < start) {
    dateChamp = datestart;
    msg = '🔵Inicia em';
  } else if (now > end) {
    dateChamp = dateEnd;
    msg = '🔴Finalizado(a) em';
  } else {
    dateChamp = dateEnd;
    msg = '';
  }

  const formatted = Math.floor(new Date(dateChamp).getTime() / 1000);

  return { formatted, msg };
};

export const cupomStatus = (status: number) => {
  switch (status) {
    case 0:
      return { label: '⚫Inativo', color: 'gray' };
    case 1:
      return { label: '🟢Ativo', color: 'green' };
    case 2:
      return { label: '☑️Usado', color: 'gray' };
    case 3:
      return { label: '🟡Expirado', color: 'orange' };
    case 4:
      return { label: '⚫Cancelado', color: 'black' };
    case 5:
      return { label: '🔴Bloqueado', color: 'red' };
    default:
      return { label: 'Desconhecido', color: 'orange' };
  }
}