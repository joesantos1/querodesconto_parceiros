import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, normaSizes } from '../constants';

const { width } = Dimensions.get('window');

export const createCampanhasListStyles = () => {
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
    campanhaCard: {
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
    lojaLogo: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignSelf: 'center',
      marginBottom: SPACING.sm,
      backgroundColor: COLORS.light,
    },
    campanhaContent: {
      flex: 1,
    },
    campanhaTitle: {
      fontSize: normaSizes(FONT_SIZES.lg),
      fontWeight: 'bold',
      color: COLORS.primary,
      marginBottom: SPACING.xs,
      lineHeight: 24,
    },
    campanhaDescription: {
      fontSize: normaSizes(FONT_SIZES.md),
      color: COLORS.gray,
      marginBottom: SPACING.sm,
      lineHeight: 20,
    },
    dateContainer: {
      marginBottom: SPACING.sm,
      backgroundColor: COLORS.light,
      padding: SPACING.sm,
      borderRadius: 8,
    },
    dateText: {
      fontSize: normaSizes(FONT_SIZES.sm),
      color: COLORS.grayDark,
      marginBottom: SPACING.xs,
      fontWeight: '500',
    },
    statusContainer: {
      marginBottom: SPACING.sm,
      alignItems: 'flex-start',
    },
    statusBadge: {
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
    refreshControl: {
      backgroundColor: COLORS.white,
    },
  });
};