# Components

Esta pasta contém todos os componentes reutilizáveis do aplicativo.

## Estrutura Sugerida

- **UI Components**: Botões, inputs, cards, etc.
- **Layout Components**: Headers, footers, containers
- **Feature Components**: Componentes específicos de funcionalidades

## Exemplo de Componente

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```
