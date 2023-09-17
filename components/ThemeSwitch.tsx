import { MoonStar, Sun } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { ThemeContext } from '../contexts/ThemeContext';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

//TODO: Implement async storage to store the theme

export const ThemeSwitch = () => {
    const themeContext = React.useContext(ThemeContext);
    const theme = useTheme();

    const handleToggleTheme = async () => {
        try {
            const storedTheme = await AsyncStorage.getItem('theme');
            const newTheme = storedTheme === 'light' ? 'dark' : 'light';
            await AsyncStorage.setItem('theme', newTheme);
            themeContext.toggleTheme();
        } catch (error) {
            console.error('Error storing theme:', error);
        }
    };

    const iconColor = theme['color-primary-500'];
    const iconSize = 30;

    const icon = themeContext.theme === 'light' ? <Sun color={iconColor} size={iconSize} /> : <MoonStar color={iconColor} size={iconSize} />;

    return (
        <TouchableOpacity onPress={handleToggleTheme}>
            {icon}
        </TouchableOpacity>
    );
}
