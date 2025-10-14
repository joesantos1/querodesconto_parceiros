// Tipos de navegação
export type RootStackParamList = {
  TabNavigator: { screen?: keyof TabParamList } | undefined;
  Login: undefined;
  Register: undefined;
  NewPass: undefined;
  CupomDetalhes: { cupomId: number };
  MeusCupons: undefined;
  UserDados: undefined;
  UserTrocaSenha: undefined;
  UserFaq: undefined;
};

// Tipos para o Tab Navigator
export type TabParamList = {
  Home: undefined;
  Search: undefined;
  MeusCupons: undefined;
  Profile: undefined;
  Login: undefined;
};

// Tipos de dados comuns
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CampanhasHome {
  id: number,
  titulo: string,
  descricao: string,
  data_inicio: Date,
  data_fim: Date,
  status: number,
  loja: {
    id: number,
    nome: string,
    logo: string,
    categorias: { id: number }[]
  },
  cupons?: {
    id: number;
    valor: number;
    status: number;
    tipo: string;
    qtd: number;
    usados: number;
  }[]
}

export interface Cidade {
  id: number;
  cidade: string;
  estado: string;
}

export interface Campanha {
  id: number;
  titulo: string;
  descricao: string;
  data_inicio: Date;
  data_fim: Date;
  status: number;
}

export interface Loja {
  id: number;
  nome: string;
  endereco: string;
  cidade_id: number;
  telefone1: string;
  telefone2: string;
  email: string;
  site: string;
  status: number;
  logo?: string;
  descricao?: string;
  cnpj: string;
  cidade?: Cidade;
  localizacao_link?: string;
}

export interface Cupom {
  id: number;
  valor: number;
  status: number;
  tipo: string;
  qtd: number;
  usados: number;
  codigo: string;
  validade: number;
  regras: { [key: string]: string }[];
  campanha_id: number;
  campanha?: Campanha;
  loja?: Loja;
  loja_id?: number;
}

export interface CupomDetalhes extends Cupom {
  outrosCupons: Cupom[];
  ultimosUsuarios: {
    nome: string
    pegoEm: Date
  }[];
}

export interface CupomUsuario {
  id: number;
  valor: number;
  status: number;
  tipo: string;
  qtd: number;
  usados: number;
  codigo: string;
  validade: number;
  criado_em: Date;
  regras: { [key: string]: string }[];
  loja: Loja;
}

export interface Categorias {
  id: number;
  nome: string;
  cor: string;
}