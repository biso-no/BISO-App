import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useAuthentication } from '../hooks/useAuthentication';
import { login,register } from '../hooks/login';
import LanguageSwitcher from '../components/LanguangeSwitcher';
import i18n from '../constants/localization';
import { Link } from 'expo-router';
import { useThemeColor } from '../components/Themed';
import { useRouter } from 'expo-router';
import { Layout, Text, Input, Button, useTheme, StyleService, Modal, Card } from '@ui-kitten/components';
import { GradientLayout } from '../components/GradientLayout';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CheckBox } from '@ui-kitten/components';

const windowsHeight = Dimensions.get('window').height;



export default function Login() {
    const { user } = useAuthentication();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const [error, setError] = useState('');
    const [hasAgreed, setHasAgreed] = useState(false);

    const theme = useTheme();

    const ErrorCard = () => (
        <Card style={styles.errorCard} status='danger'>
            <Text style={styles.errorText}>{error}</Text>
        </Card>
    );

    const validations = () => {
        if (!email) {
            setError(i18n.t('emailRequired'));
            return false;
        }
        if (!password) {
            setError(i18n.t('passwordRequired'));
            return false;
        }
        if (password !== confirmPassword) {
            setError(i18n.t('passwordsDontMatch'));
            return false;
        }
        return true;
    };
    
    const handleSignup = async (email: string, password: string) => {
        if (validations()) {
            try {
                await register(email, password);
            } catch (error) {
                setError(error.message);
            }
        }
    };

    
    
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

      const renderTermsLink = () => (
        <Layout style={styles.termsContainer}>
            <Text>{i18n.t('agreeToTerms')}</Text>
            <Link href="https://biso.no">
                <Text style={styles.termsLink}>{i18n.t('termsAndConditions')}</Text>
            </Link>
        </Layout>
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
                {i18n.t('signUp')}
            </Text>
            {error ? <ErrorCard /> : null}
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
            <Input style={styles.input} placeholder={i18n.t('confirmPassword')} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
                <CheckBox
                    checked={hasAgreed}
                    onChange={nextChecked => setHasAgreed(nextChecked)}>
                    {renderTermsLink()}
                </CheckBox>
            <Button onPress={() => handleSignup(email, password)} disabled={!hasAgreed}>{i18n.t('signUp')}</Button>
            <Link href="/login">
                <Text style={styles.link}>{i18n.t('login')}</Text>
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
    errorCard: {
        width: '100%',
        marginBottom: 10,
    },
    errorText: {
        color: 'white',
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
        // other styles as before
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flex: 1,
        backgroundColor: 'transparent',
    },
    languageSwitcher: {
        // adjust this based on your LanguageSwitcher component's size
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
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: 'transparent',
    },
    termsLink: {
        color: '#007AFF',
        marginLeft: 5,
    },
  });
  