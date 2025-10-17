import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING } from '../constants';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import { Platform } from 'react-native';

interface ButtonProps {
    goTo?: string;
    type?: number;
    goToScreen?: string[];
}

export const ButtonBack: React.FC<ButtonProps> = ({
    goTo,
    type = 1,
    goToScreen
}) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const handleBack = () => {
        if(goTo === 'back') return navigation.goBack();
        if(goToScreen) return navigation.navigate(goToScreen[0] as any, { screen: goToScreen[1] } as any);
        navigation.navigate(goTo as any);
    };
    return (
        <View style={type === 1 ? styles.buttonBackContainer : styles.buttonBackContainerAlt}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
                <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('TabNavigator')} style={styles.backButton}>
                <Ionicons name="home" size={20} color={COLORS.primary} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonBackContainer: {
        position: 'absolute',
        top: 60,
        left: 0,
        width: 100,
        zIndex: 1000,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    buttonBackContainerAlt: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 100,
        gap: 5,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    backText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
    }
});