import React, { useEffect, useState } from 'react';
import { useAuthentication } from '../../../hooks/useAuthentication';
import { sendPasswordResetEmailToUser } from '../../../hooks/login';
import i18n from '../../../constants/localization';
import { useRouter } from 'expo-router';
import { Layout, Text, Input, Button, StyleService, Divider, useTheme } from '@ui-kitten/components';
import { useForm, Controller } from "react-hook-form";
import { View } from 'react-native';


interface FormData {
    email: string;
    }

    function FormError({ error }: { error: any }) {

        const theme = useTheme();
    
        return (
            <View style={{ backgroundColor: theme['color-danger-500'], padding: 10, borderRadius: 10, marginBottom: 10 }} >
                <Text>{error.message}</Text>
            </View>
            
        )
        }

        function FormSuccess({ message }: { message: any }) {

            const theme = useTheme();
        
            return (
                <View style={{ backgroundColor: theme['color-success-500'], padding: 10, borderRadius: 10, marginBottom: 10 }} >
                    <Text>{message}</Text>
                </View>
                
            )
            }

export default function ForgotPassword() {
    const { user } = useAuthentication();
    const [email, setEmail] = useState('');
    const router = useRouter();
    const [resetError, setResetError] = useState('');
    const [resetMessage, setResetMessage] = useState('');

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
          email: '',
        }
      });
    
    useEffect(() => {
        if (user) {
       router.back();
        }
    }, [user]);

    const onSubmit = async (data: FormData) => {
        console.log('data', data);
        const responseMessage = await sendPasswordResetEmailToUser(data.email);
        if (responseMessage === 'Password reset email sent successfully') {
            setResetMessage(responseMessage);
        } else {
            setResetError(responseMessage);
        }
    }

      return (
        <Layout style={styles.container}>
      <Layout style={styles.content}>
        {resetError && <FormError error={loginError} />}
        {resetMessage && <FormSuccess message={resetMessage} />}
        <Text style={styles.title} category="h1">
            {i18n.t('forgotPassword')}
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
            />
            )}
            name="email"
            rules={{ required: i18n.t('email_required') }}
            defaultValue=""
            />
            {errors.email && <FormError error={errors.email} />}
        <Button onPress={handleSubmit(onSubmit)}>{i18n.t('send')}</Button>
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
  