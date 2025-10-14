import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../constants';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { Platform } from 'react-native';

interface ButtonProps {
    goTo: string;
}

export const ButtonBack: React.FC<ButtonProps> = ({
    goTo
}) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const handleBack = () => {
        if(goTo === 'back') return navigation.goBack();
        navigation.navigate(goTo as any);
    };
    return (
        <View style={styles.buttonBackContainer}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
                <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonBackContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 0,
        width: 100,
        zIndex: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 8,
        marginLeft: 8,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    backText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
    }
});