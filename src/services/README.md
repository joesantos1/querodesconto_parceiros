# Services

Esta pasta contém serviços para comunicação com APIs e outras integrações externas.

## Estrutura Sugerida

- **api.ts**: Configuração base da API (axios, fetch, etc.)
- **authService.ts**: Serviços de autenticação
- **dataService.ts**: Serviços de dados/produtos

## Exemplo de Serviço com Fetch

```tsx
const API_BASE_URL = 'https://api.exemplo.com';

export const api = {
  async get(endpoint: string) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) throw new Error('Erro na requisição');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async post(endpoint: string, data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Erro na requisição');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};
```
