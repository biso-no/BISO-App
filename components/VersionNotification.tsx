import React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { Button, Card, Layout, Modal, Text } from '@ui-kitten/components';
import * as Device from 'expo-device';
import { Link } from 'expo-router';

const APP_STORE_URL = 'https://apps.apple.com/us/app/biso/id1552202171';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.biso';

interface ModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const VersionNotification = (props: ModalProps) => {
  // Get the device type to display the correct app store link
  const deviceType = Device.osName;

  const handleOpenAppStore = () => {
    if (deviceType === 'ios') {
      Linking.openURL(APP_STORE_URL);
    } else {
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
          Get the app
        </Button>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    opacity: 0,
  },
  card: {
    width: 300, // Adjust the width as needed
    padding: 20, // Adjust the padding as needed
    alignItems: 'center', // Center the content horizontally
    justifyContent: 'center', // Center the content vertically
  },
});
