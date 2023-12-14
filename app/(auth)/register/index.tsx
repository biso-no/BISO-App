import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useAuthentication } from '../../../hooks/useAuthentication';
import { login,register } from '../../../hooks/login';
import LanguageSwitcher from '../../../components/LanguangeSwitcher';
import i18n from '../../../constants/localization';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Link } from 'expo-router';
import { useThemeColor } from '../../../components/Themed';
import { useRouter } from 'expo-router';
import { Layout, Text, Input, Button, useTheme, StyleService, Modal, Card, ButtonGroup } from '@ui-kitten/components';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CheckBox } from '@ui-kitten/components';

const windowsHeight = Dimensions.get('window').height;



export default function Login() {
    const { user } = useAuthentication();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(false);
    const router = useRouter();
    const [error, setError] = useState('');
    const [hasAgreed, setHasAgreed] = useState(false);
    const [emailStructure, setEmailStructure] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [studentId, setStudentId] = useState('');
    const [isStudent, setIsStudent] = useState(true);

    const { language } = useLanguage();

        i18n.locale = language;

    //Animation states
    const [shakeAnimation] = useState(new Animated.Value(0));

    const theme = useTheme();

    const ErrorCard = () => (
        <Card style={styles.errorCard} status='danger'>
            <Text style={styles.errorText}>{error}</Text>
        </Card>
    );

    const validations = () => {
        if (!email || !email.includes('@')) {
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
    
    const handleSignup = async (email: string, password: string, studentId: string) => {
        if (validations()) {
            try {
                await register(email, password, {studentId: studentId});
            } catch (error) {
                setError((error as Error).message);
            }
        }
    };

    const startShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
        ]).start();
    }
    

    const enableButton = () => {
        return (
            email.length > 0 &&
            password.length > 0 &&
            password === confirmPassword &&
            hasAgreed
        );
    };

    useEffect(() => {
        // Only check password matching if both passwords are not empty.
        if (password && confirmPassword) {
            setPasswordMatch(password === confirmPassword);
        }
    }, [password, confirmPassword]);

    const validateIfEmailContainsAt = () => {
        if (email.includes('@')) {
            setEmailStructure(true);
            setEmailError(''); // clear any previous error messages
        } else {
            setEmailStructure(false);
            setEmailError(i18n.t('invalidEmail'));  // assuming you have an 'invalidEmail' key in your translations
            startShake();
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
            <Animated.View style={{ transform: [{ translateX: shakeAnimation }], width: '100%' }}>
                <Input
                    style={styles.input}
                    placeholder={i18n.t('email')}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={validateIfEmailContainsAt}
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </Animated.View>

            <Input
                style={styles.input}
                placeholder={i18n.t('password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                />
            <Input style={styles.input} placeholder={i18n.t('confirmPassword')} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
            <Text style={{ color: passwordMatch ? theme['color-primary-100'] : theme['color-danger-500'] }}>
                {(password && confirmPassword && !passwordMatch) ? i18n.t('passwordsDontMatch') : ''}
            </Text>
            <View style={{ marginTop: 20 }}>
                <CheckBox
                    checked={hasAgreed}
                    onChange={nextChecked => setHasAgreed(nextChecked)}>
                    {renderTermsLink()}
                </CheckBox>
                <Button 
                    onPress={() => handleSignup(email, password, studentId)} // Replace with your actual navigation function
                    style={styles.button}
                >
                    {i18n.t('signUp')}
                </Button>
            </View>
            <Button 
                    status="basic"
                    onPress={() => router.push('login')} // Replace with your actual navigation function
                    style={styles.button}
                >
                    {i18n.t('login')}
                </Button>
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
    button: {
        borderRadius: 16,
        marginTop: 10,
    },
    errorCard: {
        width: '100%',
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
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
  