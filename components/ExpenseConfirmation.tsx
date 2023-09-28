import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Layout, Text, Button, useTheme } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../constants/localization';


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
        {i18n.t('expense_submitted')}
      </Text>
      <Text category="p1" style={styles.subtitle}>
        {i18n.t('submitted_and_review_shortly')}
      </Text>
      <Button style={styles.button} onPress={navigateBack}>
        {i18n.t('go_back')}
      </Button>
      <Button style={styles.button} onPress={navigateToExpenseDetails}>
        {i18n.t('view_expense')}
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
