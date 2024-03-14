import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';

interface Props {
    step: number;
  onFinished: () => void;
}

export const WelcomeScreen = ({ onFinished }: Props) => {
  return (
    <Layout style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../../assets/images/icon.png')} style={styles.image} />
        <Text category="h1" style={styles.title}>Welcome!</Text>
        <Text category="s1" style={styles.subtitle}>
          You're all set to start exploring. We're thrilled to have you onboard.
        </Text>
      </View>
      <Button onPress={onFinished} style={styles.button}>
        Let's Get Started
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
});
