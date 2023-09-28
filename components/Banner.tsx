import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Link } from 'expo-router';
import i18n from '../constants/localization';
import { useTheme, Button, Layout, Text, StyleService } from '@ui-kitten/components';

interface BannerProps {
  isAuthenticated?: boolean;
  onLoginPress: () => void;
  style?: StyleProp<ViewStyle>;
}


const Banner: React.FC<BannerProps> = ({ isAuthenticated, onLoginPress, style }) => {
  if (isAuthenticated) {
    return null;
  }


  const theme = useTheme();



  return (
    <Layout style={[styles.banner, style, { backgroundColor: theme['color-primary-500'] }]}>
      <Text style={[styles.welcomeText, { color: theme['color-primary-100'] }]}>
        {i18n.t('welcome_message')}
      </Text>
      <Link href={'/login'}>
        <Layout style={[styles.loginButton, { backgroundColor: theme['color-primary-100'] }]}>
          <Text style={[styles.buttonText, { color: theme['color-primary-500'] }]} category="s1">
            {i18n.t('login')}
          </Text>
        </Layout>
      </Link>
    </Layout>
  );
};

const styles = StyleService.create({
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: '100%',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Banner;
