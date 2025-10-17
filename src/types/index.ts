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
  CampanhasList: undefined;
  CampanhaCreateEdit: { campanhaId?: number } | undefined;
  CuponsList: { campanhaId?: number } | undefined;
  CupomCreateEdit: { cupomId?: number; campanhaId?: number } | undefined;
  LojasList: undefined;
  LojaCreateEdit: { lojaId?: number } | undefined;
  ColabTeam: { lojaId: number; lojaNome?: string };
};

// Tipos para o Tab Navigator
export type TabParamList = {
  Home: undefined;
  Search: undefined;
  ValidaCupom: undefined;
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
  loja_id?: number;
  loja?: Loja;
}

// Interface para campanhas com dados completos (para lista)
export interface CampanhaCompleta extends Omit<Campanha, 'loja'> {
  loja: {
    id: number;
    nome: string;
    logo: string;
  };
  cupons_count?: number;
  cupons_ativos?: number;
}

// Interface para formulário de campanha
export interface CampanhaFormData {
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  status: number;
  loja_id: number;
}

// Interface para validação de formulário
export interface CampanhaFormErrors {
  titulo?: string;
  descricao?: string;
  data_inicio?: string;
  data_fim?: string;
  loja_id?: string;
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
  cidade: Cidade;
  localizacao_link?: string;
}

export interface Categorias {
  id: number;
  nome: string;
  cor: string;
  icone?: string;
}

// Interface para formulário de loja
export interface LojaFormData {
  nome: string;
  endereco: string;
  cidade_id: number;
  telefone1: string;
  telefone2: string;
  email: string;
  site: string;
  status: number;
  descricao: string;
  cnpj: string;
  localizacao_link: string;
  categoria_ids?: number[];
}

// Interface para validação de formulário de loja
export interface LojaFormErrors {
  nome?: string;
  endereco?: string;
  cidade_id?: string;
  telefone1?: string;
  telefone2?: string;
  email?: string;
  site?: string;
  descricao?: string;
  cnpj?: string;
  localizacao_link?: string;
  categoria_ids?: string;
}

// Interface para loja com dados completos (para lista)
export interface LojaCompleta extends Loja {
  categorias?: Categorias[];
  campanhas_count?: number;
  cupons_count?: number;
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
  regras: { [key: string]: string };
  campanha_id: number;
  campanha?: Campanha;
  loja?: Loja;
  loja_id?: number;
}

// Interface para formulário de cupom
export interface CupomFormData {
  valor: number;
  tipo: 'R$' | '%';
  qtd: number;
  codigo: string;
  validade: number;
  regras: { [key: string]: string };
  campanha_id: number;
  loja_id?: number;
  status: number;
}

// Interface para validação de formulário de cupom
export interface CupomFormErrors {
  valor?: string;
  tipo?: string;
  qtd?: string;
  codigo?: string;
  validade?: string;
  campanha_id?: string;
}

// Interface para cupom com dados completos (para lista)
export interface CupomCompleto extends Omit<Cupom, 'campanha' | 'loja'> {
  campanha: {
    id: number;
    titulo: string;
    status: number;
  };
  loja: {
    id: number;
    nome: string;
    logo?: string;
  };
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

// Enums para status
export enum CampanhaStatus {
  INATIVA = 0,
  ATIVA = 1,
  SUSPENSA = 2,
  FINALIZADA = 3,
}

export enum CupomStatus {
  INATIVO = 0,
  ATIVO = 1,
  ESGOTADO = 2,
  EXPIRADO = 3,
}

// Tipos utilitários
export type StatusCampanha = 'ativa' | 'inativa' | 'suspensa' | 'finalizada';
export type StatusCupom = 'ativo' | 'inativo' | 'esgotado' | 'expirado';