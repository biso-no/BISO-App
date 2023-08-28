import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Layout, Text, Button, useTheme } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const ExpenseConfirmationScreen = (expenseDetails: any) => {

    const router = useRouter();
    const theme = useTheme();

  const navigateBack = () => {
    router.push('/expenses')
  };

  const navigateToExpenseDetails = () => {
    router.push({ pathname: '/expenses/', params: { id: expenseDetails.id } });
  };

  return (
    <Layout style={styles.container}>
      <Ionicons
        name="checkmark-circle-outline"
        size={100}
        color={theme['color-success-500']}
        style={styles.icon}
      />
      <Text category="h4" style={styles.title}>
        Expense Submitted!
      </Text>
      <Text category="p1" style={styles.subtitle}>
        Your expense has been successfully submitted and will be reviewed shortly.
      </Text>
      <Button style={styles.button} onPress={navigateBack}>
        Go Back
      </Button>
      <Button style={styles.button} onPress={navigateToExpenseDetails}>
        View Expense
        </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  button: {
    marginTop: 16,
    width: '100%',
  },
});

export default ExpenseConfirmationScreen;
