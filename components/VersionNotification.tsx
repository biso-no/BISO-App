import React from 'react';
import { Linking, StyleSheet, Platform } from 'react-native';
import { Button, Card, Layout, Modal, Text } from '@ui-kitten/components';
import * as Device from 'expo-device';
import { Link } from 'expo-router';

const APP_STORE_URL = 'itms-beta://';
const PLAY_STORE_URL = 'market://details?id=com.biso.no';

interface ModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const VersionNotification = (props: ModalProps) => {
  // Get the device type to display the correct app store link
  const platform = Platform.OS;

  const handleOpenAppStore = () => {
    if (platform === 'ios') {
      // This will try to open TestFlight directly
      Linking.openURL(APP_STORE_URL);
    } else {
      // This will try to open the Play Store app directly to your app's page
      Linking.openURL(PLAY_STORE_URL);
    }
  };
  

  return (
    <Modal
      visible={props.visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => props.setVisible(false)}
    >
      <Card style={styles.card}>
        <Text category='h6'>New update is available!</Text>
        <Button  onPress={handleOpenAppStore}>
          Get the update
        </Button>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    width: 300, // Adjust the width as needed
    padding: 20, // Adjust the padding as needed
    alignItems: 'center', // Center the content horizontally
    justifyContent: 'center', // Center the content vertically
  },
});
