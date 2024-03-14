import React, { useState, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Layout, Button, Text, ButtonGroup } from '@ui-kitten/components';
import { useUserProfile } from '../../hooks';
import { Features } from '../../types';

interface Props {
    setStep: (step: number) => void;
    step: number;
}

export function OnboardingElections({ setStep, step }: Props) {
  const [elections, setElections] = useState<boolean | null>(null);

  const { updateUserProfile } = useUserProfile();

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (elections !== null) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [elections]);

  const handleExpenseDecision = (decision: boolean) => {
    setElections(decision);
  };

  const onSubmit = () => {
    if (elections) {
      updateUserProfile({
        features: [Features.elections],
      });
    }
    setStep(step + 1);
  };

  return (
    <Layout style={styles.container}>
      <Text category="h1" style={styles.title}>Elections</Text>
      <Text category="s1" style={styles.subtitle}>Will you be participating in elections?</Text>
      <ButtonGroup style={styles.buttonGroup} appearance='outline'>
        <Button onPress={() => handleExpenseDecision(true)}>Yes</Button>
        <Button onPress={() => handleExpenseDecision(false)}>No</Button>
      </ButtonGroup>
      {elections !== null && (
        <Animated.View
          style={{
            opacity: fadeAnim,
          }}
        >
          <Button onPress={onSubmit}>Next</Button>
        </Animated.View>
      )}
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
