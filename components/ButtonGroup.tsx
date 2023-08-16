import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, ButtonGroup as ButtonGroupDefault, Layout, Text } from '@ui-kitten/components';




export const ButtonGroup = ({ children }: any) => {

  return (
    <Layout
      style={styles.container}
      level='1'
    >
      <ButtonGroupDefault>
        {children}
      </ButtonGroupDefault>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginHorizontal: 8,
  },
});