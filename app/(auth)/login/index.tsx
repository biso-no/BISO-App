import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useAuthentication } from '../../../hooks/useAuthentication';
import { login } from '../../../hooks/login';
import LanguageSwitcher from '../../../components/LanguangeSwitcher';
import i18n from '../../../constants/localization';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Link } from 'expo-router';
import { useThemeColor } from '../../../components/Themed';
import { useRouter } from 'expo-router';
import { Layout, Text, Input, Button, useTheme, StyleService, Divider } from '@ui-kitten/components';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from "react-hook-form";
import { UserIcon, LockIcon } from '../../../components/icons';

const windowsHeight = Dimensions.get('window').height;

interface FormData {
    email: string;
    password: string;
  }

  function FormError({ error }: { error: string }) {
    const theme = useTheme();
    return (
        <View style={{ backgroundColor: theme['color-danger-500'], padding: 10, borderRadius: 10, marginBottom: 10 }} >
            <Text>{error}</Text>
        </View>
    )
}

export default function Login() {
    const { user } = useAuthentication();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [loginError, setLoginError] = useState('');

    const { language } = useLanguage();

        i18n.locale = language;

    const theme = useTheme();

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
          email: '',
          password: ''
        }
      });

      function getErrorMessage(code: string): string {
        switch (code) {
          case 'auth/wrong-password':
            return 'Wrong password';
          case 'auth/user-not-found':
            return 'User not found';
          case 'auth/too-many-requests':
            return 'Too many requests';
          case 'auth/invalid-email':
            return 'Invalid email';
          // Add more cases as needed
          default:
            return 'An unknown error occurred';
        }
    }

    const onSubmit = async (data: FormData) => {
        const errorMessage = await login(data.email, data.password);
        if (errorMessage) {
          console.log('Error code:', errorMessage);
          const userFriendlyMessage = getErrorMessage(errorMessage);
          setLoginError(userFriendlyMessage);
          console.log(userFriendlyMessage);
        }
    }


    
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
                <BackIcon style={styles.backButton} onPress={() => router.push('/')} />
          </Layout>
          <Layout style={styles.content}>
            {loginError && <FormError error={loginError} />}
            <Text style={styles.title} category="h1">
                    {`${i18n.t('welcome')}!`}
                </Text>
                <Divider style={styles.divider} />
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                <Input
                    style={styles.input}
                    placeholder={i18n.t('email')}
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    accessoryLeft={UserIcon}
                />
                )}
                name="email"
                rules={{ required: i18n.t('email_required') }}
                defaultValue=""
            />
            {errors.email && <FormError error={errors.email} />}
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                <Input
                    style={styles.input}
                    placeholder={i18n.t('password')}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    accessoryLeft={LockIcon}
                />
                )}
                name="password"
                rules={{ required: i18n.t('pwd_required') }}
                defaultValue=""
            />
            {errors.password && <FormError error={errors.password} />}
            <Divider style={styles.divider} />
                                <Button 
                                size='large'
                        onPress={handleSubmit(onSubmit)}
                        style={styles.button}
                    >
                        {i18n.t('login')}
                    </Button>
            <Divider style={styles.divider} />
            <Button 
                    status="basic"
                    size='large'
                    onPress={() => router.push('register')} // Replace with your actual navigation function
                    style={styles.button}
                >
                    {i18n.t('register')}
                </Button>
            <Divider style={styles.divider} />
            <Link href="/forgot-password">
                <Text style={styles.link}>{i18n.t('forgotPassword')}</Text>
            </Link>
            <Divider style={styles.divider} />
            <LanguageSwitcher style={styles.languageSwitcher} />
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
        height: 100,
    },
    button: {
        borderRadius: 26,
        width: '90%', // Set the width to 90% of the parent container
        marginHorizontal: '5%', // Set the horizontal margin to 5% of the parent container
        paddingVertical: 12, // Increase the vertical padding to increase the height
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
        backgroundColor: 'transparent',
        borderBottomColor: 'color-basic-400', // Set the color for the bottom border
        borderBottomWidth: 1, // Set the width of the bottom border
        borderLeftWidth: 0, // Ensure no border on the left
        borderRightWidth: 0, // Ensure no border on the right
        borderTopWidth: 0, // Ensure no border on the top
    },
    link: {
        color: '#007AFF',
    },
    linkText: {
        color: '#007AFF',
    },
    divider: {
        marginVertical: 10,
    },
  });
  