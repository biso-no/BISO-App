import { Layout, Button, Input, Text, ButtonGroup } from '@ui-kitten/components';
import { View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useUserProfile } from '../../hooks';


interface Props {
    setStep: (step: number) => void;
    setUserType: (userType: 'student' | 'guest') => void;
}

export function OnboardingPage2({ setStep, setUserType }: Props) {
    const { updateUserProfile, profile } = useUserProfile();

    const [isStudent, setIsStudent] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [studentIdError, setStudentIdError] = useState('');
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (touched) {
            setStudentIdError(!studentId ? 'Student ID is required' : '');
        }
    }, [studentId, touched]);

    const handleBlur = () => {
        setTouched(true);
    };

    const isFormValid = () => studentIdError === '' && studentId;

    const onSubmit = () => {
        if (!isFormValid()) {
            return;
        }

        updateUserProfile({
            userType: isStudent ? 'student' : 'guest',
            studentId,
        });

        setUserType(isStudent ? 'student' : 'guest');
        setStep(3);
    };

    const onSkip = () => {
        updateUserProfile({
            userType: 'guest',
        })

        setUserType('guest');
        setStep(3);
    };

    return (
        <Layout style={styles.container}>
            {profile?.firstName && <Text category="h1" style={styles.title}>Hi {profile.firstName}!</Text>}
            <Text category="s1" style={styles.subtitle}>Are you an active student?</Text>
            <ButtonGroup
                style={styles.buttonGroup}
                appearance='outline'
                >
                <Button
                    onPress={() => setIsStudent(true)}
                    status={isStudent ? 'primary' : 'basic'}
                >
                    Yes
                </Button>
                <Button
                    onPress={() => setIsStudent(false)}
                    status={isStudent ? 'basic' : 'primary'}
                >
                    No
                </Button>
            </ButtonGroup>
            <View style={styles.form}>
                {isStudent && (
                <Input
                    style={styles.input}
                    label="Student ID"
                    placeholder="Enter your student ID"
                    value={studentId}
                    onChangeText={setStudentId}
                    onBlur={handleBlur}
                    status={studentIdError && touched ? 'danger' : 'basic'}
                    caption={studentIdError && touched ? studentIdError : ''}
                />
                )}
                <Button onPress={!isStudent ? onSkip : onSubmit} disabled={isStudent && !isFormValid()}>
                    {!isStudent ? 'Skip' : 'Next'}
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
    buttonGroup: {
        marginBottom: 16,
    },
});
