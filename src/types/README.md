# Documentação dos Types

Este arquivo documenta os tipos TypeScript definidos no projeto, especialmente para o sistema de campanhas.

## Tipos de Navegação

### RootStackParamList
Define todas as rotas da aplicação e seus parâmetros:
- `CampanhasList`: undefined - Lista de campanhas
- `CampanhaCreateEdit`: { campanhaId?: number } | undefined - Criar/editar campanha

### TabParamList
Define as abas do navegador principal.

## Interfaces de Campanhas

### Campanha (Base)
Interface base para campanhas:
```typescript
interface Campanha {
  id: number;
  titulo: string;
  descricao: string;
  data_inicio: Date;
  data_fim: Date;
  status: number;
  loja_id?: number;
  loja?: Loja;
}
```

### CampanhaCompleta
Extensão de Campanha com dados da loja simplificados para listagem:
```typescript
interface CampanhaCompleta extends Omit<Campanha, 'loja'> {
  loja: {
    id: number;
    nome: string;
    logo: string;
  };
  cupons_count?: number;
  cupons_ativos?: number;
}
```

### CampanhaFormData
Interface para dados do formulário de campanha:
```typescript
interface CampanhaFormData {
  titulo: string;
  descricao: string;
  data_inicio: Date;
  data_fim: Date;
  status: number;
  loja_id?: number;
}
```

### CampanhaFormErrors
Interface para erros de validação do formulário:
```typescript
interface CampanhaFormErrors {
  titulo?: string;
  descricao?: string;
  data_inicio?: string;
  data_fim?: string;
  loja_id?: string;
}
```

## Enums

### CampanhaStatus
Enumera os possíveis status de uma campanha:
```typescript
enum CampanhaStatus {
  INATIVA = 0,
  ATIVA = 1,
  SUSPENSA = 2,
  FINALIZADA = 3,
}
```

### CupomStatus
Enumera os possíveis status de um cupom:
```typescript
enum CupomStatus {
  INATIVO = 0,
  ATIVO = 1,
  ESGOTADO = 2,
  EXPIRADO = 3,
}
```

## Tipos Utilitários

### StatusCampanha
Tipo union para status de campanha como string:
```typescript
type StatusCampanha = 'ativa' | 'inativa' | 'suspensa' | 'finalizada';
```

### StatusCupom
Tipo union para status de cupom como string:
```typescript
type StatusCupom = 'ativo' | 'inativo' | 'esgotado' | 'expirado';
```

## Interfaces Existentes

### User
Interface para dados do usuário logado.

### Loja
Interface completa para dados de uma loja/parceiro.

### Cupom
Interface para dados de cupons.

### CupomDetalhes
Extensão de Cupom com dados adicionais para página de detalhes.

### CupomUsuario
Interface para cupons do usuário.

### Cidade
Interface para dados de cidade.

### Categorias
Interface para categorias de lojas.

## Uso dos Types

### Em Componentes
```typescript
import { CampanhaCompleta, CampanhaStatus } from '@/types';

const [campanhas, setCampanhas] = useState<CampanhaCompleta[]>([]);
```

### Em Formulários
```typescript
import { CampanhaFormData, CampanhaFormErrors } from '@/types';

const [formData, setFormData] = useState<CampanhaFormData>({
  titulo: '',
  descricao: '',
  data_inicio: new Date(),
  data_fim: new Date(),
  status: CampanhaStatus.ATIVA,
});

const [errors, setErrors] = useState<CampanhaFormErrors>({});
```

### Em Funções de Validação
```typescript
const validateForm = (): CampanhaFormErrors => {
  const errors: CampanhaFormErrors = {};
  
  if (!formData.titulo.trim()) {
    errors.titulo = 'Título é obrigatório';
  }
  
  return errors;
};
```

## Convenções

1. **Interfaces**: PascalCase (ex: `CampanhaCompleta`)
2. **Enums**: PascalCase (ex: `CampanhaStatus`)
3. **Types**: PascalCase (ex: `StatusCampanha`)
4. **Propriedades**: camelCase (ex: `data_inicio`)
5. **Status numéricos**: Use enums em vez de números mágicos
6. **Datas**: Sempre como `Date` no TypeScript, converter para string na API
7. **IDs opcionais**: Use `?` para campos que podem não existir
8. **Extensões**: Use `extends` ou `Omit` para reutilizar interfaces

## Melhorias Futuras

1. **Validação em tempo de execução**: Usar bibliotecas como Zod ou Yup
2. **Tipos mais específicos**: Criar types para diferentes contextos
3. **Discriminated Unions**: Para diferentes tipos de campanhas
4. **Branded Types**: Para IDs específicos (ex: `CampanhaId`, `LojaId`)
5. **Utility Types**: Criar helpers para transformações comuns