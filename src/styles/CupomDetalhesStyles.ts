import { StyleSheet, Dimensions, Platform } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../constants';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 3; // 3 items per row with margins

const normaSizes = (medida: number) => {
    if (width < 380) {
        return Math.floor(medida - (medida * 0.3));
    }
    if (width > 700) {
        return Math.floor(medida + (medida * 0.3));
    }
    return medida;
}

export const createStyles = () => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#ebebebff',
            paddingHorizontal: 16,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: SPACING.md,
            paddingVertical: SPACING.sm,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.grayLight,
            backgroundColor: COLORS.white,
            elevation: 2,
            shadowColor: COLORS.black,
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        headerTitle: {
            fontSize: normaSizes(FONT_SIZES.md),
            fontWeight: 'bold',
            color: COLORS.dark,
            marginLeft: SPACING.md,
        },
        subtitle: {
            fontSize: 18,
            color: COLORS.primary,
            textAlign: 'center',
            marginVertical: SPACING.sm
        },
        headerLoja: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: COLORS.primary,
            width: '100%',
            alignItems: 'center',
            padding: SPACING.md,
            borderRadius: 12,
            marginBottom: SPACING.lg,
        },
        lojaNome: {
            fontSize: normaSizes(16),
            fontWeight: 'bold',
            color: COLORS.white,
            marginTop: SPACING.sm,
        },
        lojaSubtitulos: {
            fontSize: normaSizes(14),
            color: COLORS.grayLight,
            marginTop: SPACING.xs,
        },
        headerLojaInfo: {
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
        },
        logo: {
            width: 100,
            height: 100,
            borderRadius: 100,
            marginRight: 5,
            marginBottom: 5,
        },
        logoContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
            backgroundColor: 'white',
            marginHorizontal: SPACING.md,
        },
        lojaCampanhaTitulo: {
            fontSize: normaSizes(18),
            fontWeight: 'bold',
            color: COLORS.primary,
            marginVertical: SPACING.sm,
            textAlign: 'center',
        },
        CupomInfo: {
            width: '100%',
            marginTop: SPACING.lg,
            paddingHorizontal: 2,
            paddingVertical: SPACING.lg,
            backgroundColor: COLORS.white,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            alignItems: 'center',
            gap: SPACING.sm,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: COLORS.primary,
            alignItems: 'center'
        },
        tableContainer: {
            width: '100%',
        },
        tableRow: {
            flexDirection: 'row',
            justifyContent: 'center',
        },
        tableLabel: {
            width: '25%',
            backgroundColor: COLORS.primary,
            color: COLORS.white,
            paddingVertical: 10,
            paddingHorizontal: 4,
            fontSize: normaSizes(16),
            fontWeight: 'bold',
            textAlign: 'right',
        },
        tableValue: {
            width: '75%',
            fontSize: normaSizes(18),
            textAlign: 'left',
            paddingHorizontal: 5,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: COLORS.grayLight,
            backgroundColor: '#f9f9f9',
        },
        pegaCupomButton: {
            backgroundColor: COLORS.secondary,
            padding: SPACING.md,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: SPACING.md,
        },
        pegaCupomButtonText: {
            color: COLORS.white,
            fontSize: normaSizes(24),
            fontWeight: 'bold',
        },
        cupomContainer: {
            width: normaSizes(150),
            height: normaSizes(100),
            backgroundColor: COLORS.primary,
            paddingVertical: SPACING.xs,
            marginRight: SPACING.sm,
            borderRadius: 10,
            borderBottomWidth: normaSizes(6),
            borderRightWidth: normaSizes(6),
            borderColor: COLORS.secondary,
            shadowColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
        },
        cupomText: {
            color: COLORS.white,
            fontWeight: 'bold',
            marginHorizontal: SPACING.sm,
            fontStyle: 'italic'
        },
        cupomTipoBox: {
            position: 'absolute',
            backgroundColor: COLORS.secondary,
            paddingHorizontal: normaSizes(1),
            paddingVertical: normaSizes(4),
            borderRadius: 6,
        },
        cupomTipoText: {
            color: COLORS.primary,
            fontSize: normaSizes(FONT_SIZES.lg),
            fontWeight: 'bold',
            marginHorizontal: SPACING.sm,
        },
        cupomRestamBox: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            backgroundColor: '#ffffffff',
            borderTopRightRadius: 4,
            paddingHorizontal: 4,
        },
        cupomRestamText: {
            color: COLORS.primary,
            fontSize: normaSizes(12),
            fontStyle: 'italic',
        },
        cupomOffBox: {
            position: 'absolute',
            top: normaSizes(60),
            right: 0,
            backgroundColor: '#ffdb3bff',
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4
        },
        cupomOffBoxText: {
            color: COLORS.black,
            fontSize: normaSizes(11),
        },
        cupomTituloBox: {
            position: 'absolute',
            top: 0,
            paddingHorizontal: 3,
            paddingVertical: 2,
            backgroundColor: COLORS.secondary,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
        },
        cupomTituloBoxText: {
            color: COLORS.white,
            fontSize: normaSizes(11),
        },
    });
}