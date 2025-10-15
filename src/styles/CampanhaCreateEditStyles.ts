import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, normaSizes } from '../constants';

const { width } = Dimensions.get('window');

export const createCampanhaCreateEditStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
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
      fontSize: normaSizes(FONT_SIZES.lg),
      fontWeight: 'bold',
      color: COLORS.dark,
      marginLeft: SPACING.md,
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
    scrollView: {
      flex: 1,
    },
    form: {
      padding: SPACING.md,
      paddingBottom: SPACING.xl,
    },
    inputGroup: {
      marginBottom: SPACING.lg,
    },
    label: {
      fontSize: normaSizes(FONT_SIZES.md),
      fontWeight: '600',
      color: COLORS.dark,
      marginBottom: SPACING.xs,
    },
    requiredIndicator: {
      color: COLORS.danger,
      fontSize: normaSizes(FONT_SIZES.md),
    },
    input: {
      borderWidth: 1,
      borderColor: COLORS.grayLight,
      borderRadius: 8,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      fontSize: normaSizes(FONT_SIZES.md),
      backgroundColor: COLORS.white,
      color: COLORS.dark,
      minHeight: 48,
    },
    textArea: {
      borderWidth: 1,
      borderColor: COLORS.grayLight,
      borderRadius: 8,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      fontSize: normaSizes(FONT_SIZES.md),
      backgroundColor: COLORS.white,
      color: COLORS.dark,
      minHeight: 100,
      maxHeight: 150,
    },
    inputError: {
      borderColor: COLORS.danger,
      borderWidth: 2,
    },
    inputFocused: {
      borderColor: COLORS.primary,
      borderWidth: 2,
    },
    errorText: {
      fontSize: normaSizes(FONT_SIZES.sm),
      color: COLORS.danger,
      marginTop: SPACING.xs,
      fontWeight: '500',
    },
    characterCount: {
      fontSize: normaSizes(FONT_SIZES.sm),
      color: COLORS.gray,
      textAlign: 'right',
      marginTop: SPACING.xs,
    },
    characterCountWarning: {
      color: COLORS.warning,
    },
    characterCountError: {
      color: COLORS.danger,
    },
    dateInputContainer: {
      position: 'relative',
    },
    dateInput: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLORS.grayLight,
      borderRadius: 8,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      backgroundColor: COLORS.white,
      minHeight: 48,
    },
    dateIcon: {
      marginRight: SPACING.sm,
    },
    dateText: {
      fontSize: normaSizes(FONT_SIZES.md),
      color: COLORS.dark,
      flex: 1,
    },
    datePlaceholder: {
      color: COLORS.gray,
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: SPACING.xs,
    },
    switchLabel: {
      fontSize: normaSizes(FONT_SIZES.md),
      fontWeight: '600',
      color: COLORS.dark,
      flex: 1,
    },
    switchDescription: {
      fontSize: normaSizes(FONT_SIZES.sm),
      color: COLORS.gray,
      marginTop: SPACING.xs,
      lineHeight: 18,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: SPACING.xl,
      gap: SPACING.md,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: COLORS.grayLight,
    },
    saveButton: {
      flex: 1,
      backgroundColor: COLORS.primary,
    },
    saveButtonDisabled: {
      backgroundColor: COLORS.gray,
    },
    formSection: {
      backgroundColor: COLORS.white,
      borderRadius: 12,
      padding: SPACING.md,
      marginBottom: SPACING.md,
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 3.84,
      elevation: 2,
      borderWidth: 1,
      borderColor: COLORS.grayLight,
    },
    sectionTitle: {
      fontSize: normaSizes(FONT_SIZES.lg),
      fontWeight: 'bold',
      color: COLORS.dark,
      marginBottom: SPACING.md,
      paddingBottom: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.grayLight,
    },
    helpText: {
      fontSize: normaSizes(FONT_SIZES.sm),
      color: COLORS.gray,
      fontStyle: 'italic',
      marginTop: SPACING.xs,
      lineHeight: 16,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.light,
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: SPACING.xs,
    },
    statusBadgeActive: {
      backgroundColor: COLORS.success + '20',
    },
    statusBadgeInactive: {
      backgroundColor: COLORS.warning + '20',
    },
    statusBadgeText: {
      fontSize: normaSizes(FONT_SIZES.sm),
      fontWeight: '600',
      marginLeft: SPACING.xs,
    },
    statusBadgeTextActive: {
      color: COLORS.success,
    },
    statusBadgeTextInactive: {
      color: COLORS.warning,
    },
  });
};