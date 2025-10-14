import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, FONTFAMILY, normaSizes } from '../constants';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 3; // 3 items per row with margins

export const createStyles = () => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ebebebff',
            paddingTop: 40,
            paddingHorizontal: 14,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: COLORS.primary,
            marginBottom: 10,
        },
        subtitle: {
            fontSize: 16,
            color: '#666',
            textAlign: 'center',
        },
        cupomContainer: {
            backgroundColor: '#fff',
            width: '98%',
            minHeight: 130,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 8,
            borderBottomWidth: 6,
            borderRightWidth: 6,
            borderColor: COLORS.primary,
            padding: 12,
            marginVertical: 12,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        cupomCodigoContainer: {
            position: 'absolute',
            top: 0,
            left: 90,
            width: '50%',
            minWidth: 120,
            backgroundColor: COLORS.primary,
            padding: 6,
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
        },
        cupomLojaLogoContainer: {
            position: 'absolute',
            top: -15,
            left: 5,
            width: 73,
            height: 73,
            zIndex: 1,
            borderRadius: 35,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
        },
        lojaLogo: {
            width: 70,
            height: 70,
            borderRadius: 35
        },
        cupomLojaNome: {
            fontSize: 14,
            fontWeight: 'bold',
        },
        cupomTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
        },
        cupomValue: {
            fontSize: normaSizes(45),
            color: COLORS.primary,
            fontWeight: 'bold',
            fontStyle: 'italic',
            fontFamily: FONTFAMILY,
        },
        rodapeCupom: {
            position: 'absolute',
            bottom: 0,
            left: 10,
            paddingVertical: 6,
            flexDirection: 'row',
            alignItems: 'flex-start',
            width: '100%',
            gap: 5,
        },
        itemRodape: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        rodapeTexto: {
            fontSize: normaSizes(14),
            color: COLORS.black,
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
        tableContainer: {
            width: '100%',
        },
        tableRow: {
            flexDirection: 'row',
            justifyContent: 'center'
        },
        tableLabel: {
            width: '30%',
            backgroundColor: COLORS.primary,
            color: COLORS.white,
            padding: 8,
            fontSize: normaSizes(16),
            fontWeight: 'bold',
            textAlign: 'right',
        },
        tableValue: {
            width: '70%',
            fontSize: normaSizes(18),
            textAlign: 'left',
            paddingVertical: 8,
            paddingLeft: 5,
            borderWidth: 1,
            borderColor: COLORS.grayLight,
            backgroundColor: '#f9f9f9',
        },
    });
}