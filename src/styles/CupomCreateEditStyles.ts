import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, normaSizes } from '../constants';

const { width } = Dimensions.get('window');

export const createCupomCreateEditStyles = () => {
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
    title:{
      fontSize: normaSizes(FONT_SIZES.lg),
      fontWeight: 'bold',
      color: COLORS.dark,
      marginBottom: SPACING.md,
      textAlign: 'center',
    },
    scrollView: {
      flex: 1,
    },
    form: {
      padding: SPACING.md,
      paddingBottom: SPACING.xl,
    },
    section: {
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
    inputGroup: {
      marginBottom: SPACING.lg,
    },
    inputRow: {
      flexDirection: 'row',
      gap: SPACING.md,
    },
    inputHalf: {
      flex: 1,
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
    helpText: {
      fontSize: normaSizes(FONT_SIZES.sm),
      color: COLORS.gray,
      fontStyle: 'italic',
      marginTop: SPACING.xs,
      lineHeight: 16,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: COLORS.grayLight,
      borderRadius: 8,
      backgroundColor: COLORS.white,
      overflow: 'hidden',
    },
    picker: {
      height: 48,
      color: COLORS.dark,
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
    valueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLORS.grayLight,
      borderRadius: 8,
      backgroundColor: COLORS.white,
      paddingLeft: SPACING.md,
    },
    currencySymbol: {
      fontSize: normaSizes(FONT_SIZES.md),
      color: COLORS.gray,
      marginRight: SPACING.xs,
    },
    percentSymbol: {
      fontSize: normaSizes(FONT_SIZES.md),
      color: COLORS.gray,
      marginLeft: SPACING.xs,
    },
    valueInput: {
      flex: 1,
      paddingVertical: SPACING.sm,
      paddingRight: SPACING.md,
      fontSize: normaSizes(FONT_SIZES.md),
      color: COLORS.dark,
      minHeight: 48,
    },
    typeSelector: {
      flexDirection: 'row',
      gap: SPACING.sm,
      marginBottom: SPACING.sm,
    },
    typeButton: {
      flex: 1,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: COLORS.grayLight,
      backgroundColor: COLORS.white,
      alignItems: 'center',
    },
    typeButtonActive: {
      borderColor: COLORS.primary,
      backgroundColor: COLORS.primary + '10',
    },
    typeButtonText: {
      fontSize: normaSizes(FONT_SIZES.md),
      fontWeight: '600',
      color: COLORS.gray,
    },
    typeButtonTextActive: {
      color: COLORS.primary,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
    },
    quantityButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityButtonDisabled: {
      backgroundColor: COLORS.grayLight,
    },
    quantityInput: {
      flex: 1,
      textAlign: 'center',
    },
    validadeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
    },
    validadeInput: {
      flex: 1,
    },
    validadeLabel: {
      fontSize: normaSizes(FONT_SIZES.sm),
      color: COLORS.gray,
      fontWeight: '600',
    },
    regrasContainer: {
      flexDirection: 'column',
      gap: SPACING.md,
    },
      regraRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      marginVertical: SPACING.sm,
    },
    regrasInput: {
      flex: 1,
      paddingVertical: SPACING.sm,
      paddingRight: SPACING.md,
      fontSize: normaSizes(FONT_SIZES.md),
      color: COLORS.dark,
      minHeight: 48,
    },
    addRegraButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    regraLabel: {
      fontSize: normaSizes(FONT_SIZES.md),
      color: COLORS.primary,
      fontWeight: '600',
    },
    deleteRegraButton: {
      padding: SPACING.xs,
    },
    previewContainer: {
      backgroundColor: COLORS.light,
      padding: SPACING.md,
      borderRadius: 12,
      marginTop: SPACING.md,
    },
    previewTitle: {
      fontSize: normaSizes(FONT_SIZES.md),
      fontWeight: 'bold',
      color: COLORS.dark,
      marginBottom: SPACING.sm,
    },
    previewCard: {
      backgroundColor: COLORS.white,
      borderRadius: 8,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: COLORS.grayLight,
    },
    previewValue: {
      fontSize: normaSizes(FONT_SIZES.xl),
      fontWeight: 'bold',
      color: COLORS.primary,
      textAlign: 'center',
      marginBottom: SPACING.xs,
    },
    previewCode: {
      fontSize: normaSizes(FONT_SIZES.md),
      fontWeight: 'bold',
      color: COLORS.dark,
      textAlign: 'center',
      letterSpacing: 1,
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
      width: '50%'
    },
    saveButton: {
      flex: 1,
      backgroundColor: COLORS.primary,
      width: '50%'
    },
    saveButtonDisabled: {
      backgroundColor: COLORS.gray,
    },
    lastCuponsItem: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      borderRadius: 8,
      marginVertical: SPACING.sm,
      backgroundColor: COLORS.white,
    },
    lastCuponStats: {
      fontSize: normaSizes(FONT_SIZES.md),
      color: COLORS.dark,
      padding: SPACING.xs,
      borderRadius: 6,
      backgroundColor: COLORS.light,
    },
  });
};