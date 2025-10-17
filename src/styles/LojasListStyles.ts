import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, normaSizes } from '../constants';

const { width } = Dimensions.get('window');

export const createLojasListStyles = () => {
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
    lojaCard: {
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
    },
    lojaHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: SPACING.sm,
    },
    lojaLogo: {
      width: 80,
      height: 80,
      borderRadius: 12,
      backgroundColor: COLORS.light,
      marginRight: SPACING.md,
    },
    lojaInfo: {
      flex: 1,
    },
    lojaNome: {
      fontSize: normaSizes(FONT_SIZES.lg),
      fontWeight: 'bold',
      color: COLORS.dark,
      marginBottom: SPACING.xs,
    },
    lojaEndereco: {
      fontSize: normaSizes(FONT_SIZES.sm),
      color: COLORS.gray,
      marginBottom: SPACING.xs,
      lineHeight: 18,
    },
    lojaCidade: {
      fontSize: normaSizes(FONT_SIZES.sm),
      color: COLORS.grayDark,
      fontWeight: '500',
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.md,
      marginBottom: SPACING.sm,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 0.48,
    },
    contactText: {
      fontSize: normaSizes(FONT_SIZES.sm),
      color: COLORS.grayDark,
      marginLeft: SPACING.xs,
    },
    lojaDescricao: {
      fontSize: normaSizes(FONT_SIZES.sm),
      color: COLORS.gray,
      marginBottom: SPACING.sm,
      lineHeight: 18,
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
      fontSize: normaSizes(FONT_SIZES.sm),
      fontWeight: 'bold',
      color: COLORS.white,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: COLORS.light,
      padding: SPACING.sm,
      borderRadius: 8,
      marginBottom: SPACING.sm,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: normaSizes(FONT_SIZES.lg),
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    statLabel: {
      fontSize: normaSizes(FONT_SIZES.xs),
      color: COLORS.gray,
      textAlign: 'center',
    },
    actionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
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
      justifyContent: 'center',
      minHeight: 44,
      minWidth: '30%',
      flex: 1,
    },
    editButton: {
      backgroundColor: COLORS.primary,
    },
    deleteButton: {
      position: 'absolute',
      right: 0,
      top: 0,
      padding: SPACING.md,
      borderTopRightRadius: 12,
      borderBottomLeftRadius: 12,
      backgroundColor: COLORS.danger,
    },
    actionButtonText: {
      color: COLORS.white,
      fontSize: normaSizes(FONT_SIZES.md),
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
  });
};