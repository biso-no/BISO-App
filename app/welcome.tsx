import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { Layout, Text, Button } from '@ui-kitten/components';
import { Link } from 'expo-router';

interface WelcomeScreenProps {
    setIsFirstTime: (arg0: boolean) => void;
    existingUser: boolean;
}

export default function WelcomeScreen({ setIsFirstTime, existingUser }: WelcomeScreenProps) {
    const theme = useTheme();

    return (
        <Layout style={styles.container}>
            <Text style={styles.title} category="h1">
                Welcome to the BISO App!
            </Text>
            {existingUser ? (
                <>
                    <Text style={styles.subtitle} category="h6">
                        You're already part of our community, but it's your first time here.
                    </Text>
                    <Text style={styles.subtitle} category="h6">
                        Take a moment to explore our terms and conditions.
                    </Text>
                    <Link href={'https://biso.no/terms'} asChild>
                        <Button style={styles.button}>
                            Terms and Conditions
                        </Button>
                    </Link>
                    <Button style={styles.button} onPress={() => setIsFirstTime(false)}>
                        Let's Begin
                    </Button>
                </>
            ) : (
                <Button style={styles.button} onPress={() => setIsFirstTime(false)}>
                    Get Started
                </Button>
            )}
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
    button: {
        marginVertical: 10,
    },
});
