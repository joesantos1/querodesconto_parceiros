import { Dimensions, Platform } from 'react-native';
const { width } = Dimensions.get('window');

// Constantes do aplicativo
export const APP_NAME = 'Quero Desconto';

// Cores do tema (exemplo - você pode personalizar)
export const COLORS = {
  primary: '#6f0075ff',
  secondary: '#00b20fff',
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',
  light: '#F2F2F7',
  dark: '#1C1C1E',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  grayDark: '#636366',
  grayLight: '#d4d4d4ff',
};

// Tamanhos de fonte
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
};

export const normaSizes = (medida: number) => {
    if (width < 385) {
        return Math.floor(medida - (medida * 0.3));
    }
    if (width > 700) {
        return Math.floor(medida + (medida * 0.3));
    }
    return medida;
}

export const FONTFAMILY = Platform.select({
  ios: 'Arial-Black',
  android: 'sans-serif-black',
  default: 'Arial Black',
});

// Espaçamentos
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};
