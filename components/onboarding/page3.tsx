import React, { useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Layout, Button, Input, Text, ButtonGroup } from '@ui-kitten/components';
import { useUserProfile } from '../../hooks';
import { Features } from '../../types';
interface Props {
    setStep: (step: number) => void;
    step: number;
}


export function OnboardingExpenses({ setStep, step }: Props) {
  const [submitExpenses, setSubmitExpenses] = useState<boolean>(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [bankAccount, setBankAccount] = useState('');

  const {updateUserProfile} = useUserProfile();

  // Animation state
  const [fadeAnim] = useState(new Animated.Value(0));

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleExpenseDecision = (decision: boolean) => {
    setSubmitExpenses(decision);
    if (decision) fadeIn();
  };

  // Corrected isFormValid function to return true only if all fields are filled
  const isFormValid = () => address && city && zip && bankAccount;

  const onSubmit = () => {
    if (submitExpenses && !isFormValid()) {
      // Prevent submission if form is invalid and user has chosen to submit expenses
      return;
    }
    updateUserProfile({
      address,
      city,
      zip,
      bankAccount,
      features: [Features.expenses],
    });
    setStep(step + 1);
    }

  return (
    <Layout style={styles.container}>
      <Text category="h1" style={styles.title}>Expenses</Text>
      <Text category="s1" style={styles.subtitle}>Will you be submitting any expenses?</Text>
      <ButtonGroup style={styles.buttonGroup} appearance='outline'>
        <Button onPress={() => handleExpenseDecision(true)} status={submitExpenses === true ? 'primary' : 'basic'}>
          Yes
        </Button>
        <Button onPress={() => handleExpenseDecision(false)} status={submitExpenses === false ? 'primary' : 'basic'}>
          No
        </Button>
      </ButtonGroup>
      {submitExpenses && (
        <Animated.View style={[styles.form, { opacity: fadeAnim }]}>
          <Input
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />
          <Input
            placeholder="City"
            value={city}
            onChangeText={setCity}
            style={styles.input}
          />
          <Input
            placeholder="Zip"
            value={zip}
            onChangeText={setZip}
            style={styles.input}
          />
          <Input
            placeholder="Bank Account"
            value={bankAccount}
            onChangeText={setBankAccount}
            style={styles.input}
          />
        </Animated.View>
      )}
      <Button onPress={onSubmit} disabled={submitExpenses && !isFormValid()} style={styles.button}>
        {!submitExpenses ? 'Skip' : 'Next'}
      </Button>
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
