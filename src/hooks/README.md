# Hooks

Esta pasta contém custom hooks reutilizáveis do aplicativo.

## Exemplo de Custom Hook

```tsx
import { useState, useEffect } from 'react';

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
```

## Uso

```tsx
import { useFetch } from '@hooks/useFetch';

function MyComponent() {
  const { data, loading, error } = useFetch<Product[]>('/products');

  if (loading) return <Text>Carregando...</Text>;
  if (error) return <Text>Erro: {error.message}</Text>;

  return <View>{/* Renderizar dados */}</View>;
}
```
