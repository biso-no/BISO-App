import { Layout, Button, Input, Text } from '@ui-kitten/components';
import { View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useUserProfile } from '../../hooks';
import { useAuthentication } from '../../hooks';

interface Props {
    setStep: (step: number) => void;
}

export function OnboardingPage1({ setStep }: Props) {
    const { updateUserProfile } = useUserProfile();
    const { user } = useAuthentication();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');

    const [touched, setTouched] = useState({
        firstName: false,
        lastName: false,
        phone: false,
    });

    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    useEffect(() => {
        if (touched.firstName) {
            setFirstNameError(!firstName ? 'First name is required' : '');
        }
        if (touched.lastName) {
            setLastNameError(!lastName ? 'Last name is required' : '');
        }
        if (touched.phone) {
            setPhoneError(!phone ? 'Phone number is required' : '');
        }
    }, [firstName, lastName, phone, touched]);

    const handleBlur = (field: string) => {
        setTouched({ ...touched, [field]: true });
    };

    const isFormValid = () => !firstNameError && !lastNameError && !phoneError && firstName && lastName && phone;

    const onSubmit = () => {
        if (!isFormValid()) {
            return;
        }

        updateUserProfile({
            firstName,
            lastName,
            phone,
        });
        setStep(2);
    };

    if (!user) return null;

    return (
        <Layout style={styles.container}>
            <Text category="h1" style={styles.title}>Welcome!</Text>
            <Text category="s1" style={styles.subtitle}>Let's get to know you better.</Text>
            <View style={styles.form}>
                <Input
                    style={styles.input}
                    label="Email"
                    placeholder="Enter your email"
                    value={user.email || undefined}
                    disabled
                />
                <Input
                    style={styles.input}
                    label="First name"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChangeText={setFirstName}
                    onBlur={() => handleBlur('firstName')}
                    status={firstNameError && touched.firstName ? 'danger' : 'basic'}
                    caption={firstNameError && touched.firstName ? firstNameError : ''}
                />
                <Input
                    style={styles.input}
                    label="Last name"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChangeText={setLastName}
                    onBlur={() => handleBlur('lastName')}
                    status={lastNameError && touched.lastName ? 'danger' : 'basic'}
                    caption={lastNameError && touched.lastName ? lastNameError : ''}
                />
                <Input
                    style={styles.input}
                    label="Phone number"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChangeText={setPhone}
                    onBlur={() => handleBlur('phone')}
                    status={phoneError && touched.phone ? 'danger' : 'basic'}
                    caption={phoneError && touched.phone ? phoneError : ''}
                    keyboardType="phone-pad"
                />
                <Button onPress={onSubmit} disabled={!isFormValid()} style={styles.button}>
                    Next
                </Button>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        marginBottom: 8,
    },
    subtitle: {
        marginBottom: 20,
    },
    form: {
        width: '100%',
        maxWidth: 400,
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
    button: {
        marginTop: 16,
    },
});
