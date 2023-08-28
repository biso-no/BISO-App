import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

interface LanguageSwitcherProps {
  style?: object;
}

const languages = [
  { code: 'en', image: require('../assets/usa.png') },
  { code: 'nb', image: require('../assets/norway.png') },
];

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ style }) => {
  const { setLanguage } = useLanguage();
  const router = useRouter();

  const handleLanguageChange = (code: string) => {
    setLanguage(code);
    router.replace('/profile');
  };

  return (
    <View style={[styles.container, style]}>
      {languages.map((language) => (
        <TouchableOpacity
          key={language.code}
          onPress={() => handleLanguageChange(language.code)}
        >
          <View style={styles.languageItem}>
            <Image source={language.image} style={styles.languageImage} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  languageItem: {
    width: 80,
    height: 40,
  },
  languageImage: {
    width: 80,
    height: 40,
  },
});

export default LanguageSwitcher;
