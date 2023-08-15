import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useAuthentication } from '../hooks/useAuthentication';
import { login } from '../hooks/login';
import LanguageSwitcher from '../components/LanguangeSwitcher';
import i18n from '../constants/localization';
import { Link } from 'expo-router';
import { useThemeColor } from '../components/Themed';
import { useRouter } from 'expo-router';
import { Layout, Text, Input, Button, useTheme, StyleService } from '@ui-kitten/components';
import { GradientLayout } from '../components/GradientLayout';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const windowsHeight = Dimensions.get('window').height;

export default function Login() {
    const { user } = useAuthentication();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const theme = useTheme();

    
    useEffect(() => {
        if (user) {
       router.back();
        }
    }, [user]);

    const BackIcon = (props: any) => (
        <TouchableOpacity onPress={() => router.back()}>
        <Ionicons {...props} name='arrow-back' size={40} color={theme['color-primary-100']} />
        </TouchableOpacity>
      );


      return (
            <Layout style={styles.container}>
          <Layout style={styles.header}>
            <TouchableWithoutFeedback onPress={() => router.back()}>
                <BackIcon style={styles.backButton}/>
            </TouchableWithoutFeedback>
          </Layout>
          <Layout style={styles.content}>
            <LanguageSwitcher style={styles.languageSwitcher} />
            <Text style={styles.title} category="h1">
                {i18n.t('login')}
            </Text>
            <Input
                style={styles.input}
                placeholder={i18n.t('email')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                />
            <Input
                style={styles.input}
                placeholder={i18n.t('password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                />
            <Button onPress={() => login(email, password)}>{i18n.t('login')}</Button>
            <Link href="/register">
                <Text style={styles.link}>{i18n.t('signUp')}</Text>
            </Link>
          </Layout>
        </Layout>
      );
}      

const styles = StyleService.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 30,
        left: 10,
    },
    backButton: {
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flex: 1,
        backgroundColor: 'transparent',
    },
    languageSwitcher: {
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        marginVertical: 10,
        height: 50,
    },
    link: {
        color: '#007AFF',
    },
  });
  