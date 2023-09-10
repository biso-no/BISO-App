import React, { useEffect, useState } from 'react';
import { Modal, Button, Text, Input, Card, StyleService } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import { validateDocument } from '../hooks/validateDocument';

interface ModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}




export default function ElectionModal(props: ModalProps) {
    const { visible, setVisible } = props;
    const router = useRouter();
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    const validate = async () => {
        //Run validateDocument to check if document exists. If it does not exist, we will display an error saying the document does not exist. If it exist, user is routed to the election
        const doc = await validateDocument('elections', value);
        if (doc) {
            router.push('/elections/' + value);
            setVisible(false);
        } else {
            setError('Election does not exist');
        }
        }

    return (
        <Modal
            visible={visible}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => setVisible(false)}
        >
            <Card disabled={true}>
                <Text category='h6'>Search</Text>
                <Input
                    placeholder='Search'
                    value={value}
                    keyboardType='numeric'
                    onChangeText={setValue}
                />
                <Button
                    onPress={validate}
                >
                    Join Election
                </Button>
                {error && 
                <Card
                status='danger'
                style={styles.error}
                >
                    <Text>
                    {error}
                    </Text>
                </Card>
                }
            </Card>
        </Modal>
    )
}

const styles = StyleService.create({
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    error: {
        padding: 16
    },
})