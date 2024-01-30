import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme, Layout } from '@ui-kitten/components';

const Loading = () => {

  const theme = useTheme();

  return (
    <Layout style={[styles.container]}>
      <ActivityIndicator size="large" color="#0000ff" />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
