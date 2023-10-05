import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Modal, Text } from '@ui-kitten/components';

export interface ContentModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    title: string;
    children: React.ReactNode;
}

export const ContentModal = (props: ContentModalProps) => {
    const { visible, setVisible, title, children } = props;

    return (
        <Modal
            visible={visible}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => setVisible(false)}>
            <Card disabled={true} style={styles.card}>
                <Text category='h6'>{title}</Text>
                {children}
            </Card>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    card: {
        padding: 20,
        
    }
});

export default ContentModal;
