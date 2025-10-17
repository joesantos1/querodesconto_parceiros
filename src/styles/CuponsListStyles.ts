import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, normaSizes } from '../constants';

const { width } = Dimensions.get('window');

export const createCuponsListStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
      fontSize: normaSizes(FONT_SIZES.lg),
      fontWeight: 'bold',
      color: COLORS.dark,
      marginLeft: SPACING.sm,
    },
    addButton: {
      padding: SPACING.xs,
      borderRadius: 8,
      backgroundColor: COLORS.primary + '10',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.white,
    },
    loadingText: {
      marginTop: SPACING.sm,
      fontSize: normaSizes(FONT_SIZES.md),
      color: COLORS.gray,
      textAlign: 'center',
    },
    listContainer: {
      padding: SPACING.md,
      paddingBottom: SPACING.xl,
    },
    cupomCard: {
      backgroundColor: COLORS.white,
      borderRadius: 12,
      marginBottom: SPACING.md,
      padding: SPACING.md,
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      borderWidth: 1,
      borderColor: COLORS.grayLight,
      position: 'relative',
    },
    cupomCardExpired: {
      opacity: 0.6,
      backgroundColor: COLORS.light,
    },
    cupomHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: SPACING.sm,
    },
    cupomValue: {
      fontSize: normaSizes(40),
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    cupomValueContainer: {
      flex: 1,
    },
    cupomType: {
      fontSize: normaSizes(FONT_SIZES.sm),
      color: COLORS.gray,
      textTransform: 'uppercase',
      fontWeight: '600',
    },
    cupomInfo: {
      flex: 1,
      marginBottom: SPACING.sm,
    },
    cupomCodigo: {
      fontSize: normaSizes(FONT_SIZES.lg),
      fontWeight: 'bold',
      color: COLORS.dark,
      marginBottom: SPACING.xs,
      letterSpacing: 1,
    },
    cupomQuantity: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.xs,
    },
    quantityText: {
      fontSize: normaSizes(FONT_SIZES.lg),
      color: 'blue',
      marginLeft: SPACING.xs,
      fontWeight: '600',
    },
    quantityAvailable: {
      color: COLORS.success,
      fontWeight: '600',
    },
    quantityLow: {
      color: COLORS.warning,
      fontWeight: '600',
    },
    quantityEmpty: {
      color: COLORS.danger,
      fontWeight: '600',
    },
    cupomValidade: {
      fontSize: normaSizes(FONT_SIZES.sm),
      color: COLORS.gray,
      marginBottom: SPACING.sm,
    },
    campanhaInfo: {
      backgroundColor: COLORS.light,
      padding: SPACING.sm,
      borderRadius: 8,
      marginBottom: SPACING.sm,
    },
    campanhaTitle: {
      fontSize: normaSizes(FONT_SIZES.md),
      fontWeight: '600',
      color: COLORS.dark,
      marginBottom: SPACING.xs,
    },
    lojaName: {
      fontSize: normaSizes(FONT_SIZES.sm),
      color: COLORS.gray,
    },
    statusContainer: {
      marginBottom: SPACING.sm,
    },
    statusBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: 12,
      minWidth: 60,
      alignItems: 'center',
    },
    statusText: {
      fontSize: normaSizes(FONT_SIZES.lg),
      fontWeight: 'bold',
      color: COLORS.white,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: SPACING.sm,
      gap: SPACING.sm,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: 8,
      flex: 0.48,
      justifyContent: 'center',
      minHeight: 44,
    },
    editButton: {
      backgroundColor: COLORS.primary,
    },
    deleteButton: {
      backgroundColor: COLORS.danger,
    },
    actionButtonText: {
      color: COLORS.white,
      fontSize: normaSizes(FONT_SIZES.sm),
      fontWeight: 'bold',
      marginLeft: SPACING.xs,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
      paddingHorizontal: SPACING.xl,
    },
    emptyTitle: {
      fontSize: normaSizes(FONT_SIZES.xl),
      fontWeight: 'bold',
      color: COLORS.dark,
      marginTop: SPACING.md,
      marginBottom: SPACING.xs,
      textAlign: 'center',
    },
    emptyDescription: {
      fontSize: normaSizes(FONT_SIZES.md),
      color: COLORS.gray,
      textAlign: 'center',
      marginBottom: SPACING.xl,
      lineHeight: 22,
    },
    createButton: {
      marginTop: SPACING.lg,
      minWidth: 200,
    },
    filterContainer: {
      flexDirection: 'row',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      backgroundColor: COLORS.light,
      gap: SPACING.sm,
    },
    filterButton: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: 20,
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.grayLight,
    },
    filterButtonActive: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    filterButtonText: {
      fontSize: normaSizes(FONT_SIZES.sm),
      color: COLORS.gray,
      fontWeight: '600',
    },
    filterButtonTextActive: {
      color: COLORS.white,
    },
  });
};