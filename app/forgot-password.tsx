import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useAuthentication } from '../hooks/useAuthentication';
import { sendPasswordResetEmailToUser } from '../hooks/login';
import LanguageSwitcher from '../components/LanguangeSwitcher';
import i18n from '../constants/localization';
import { Link } from 'expo-router';
import { useThemeColor } from '../components/Themed';
import { useRouter } from 'expo-router';
import { Layout, Text, Input, Button, useTheme, StyleService, Divider } from '@ui-kitten/components';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const windowsHeight = Dimensions.get('window').height;

export default function Login() {
    const { user } = useAuthentication();
    const [email, setEmail] = useState('');
    const router = useRouter();

    const theme = useTheme();

    
    useEffect(() => {
        if (user) {
       router.back();
        }
    }, [user]);

      return (
        <Layout style={styles.container}>
      <Layout style={styles.content}>
        <Text style={styles.title} category="h1">
            {i18n.t('forgotPassword')}
        </Text>
        <Divider style={styles.divider} />
        <Input
            style={styles.input}
            placeholder={i18n.t('email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            />
        <Button onPress={() => sendPasswordResetEmailToUser(email)}>Reset Password</Button>
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
    linkText: {
        color: '#007AFF',
    },
    divider: {
        marginVertical: 10,
    },
  });
  