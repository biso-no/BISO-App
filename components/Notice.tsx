import { View } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme } from '@ui-kitten/components';
import { Text } from '@ui-kitten/components';
import { CloseIcon2 } from './icons';

export interface NoticeProps {
    id: string;
    message: string;
    onClose: () => void;
    dismissed?: boolean;
    }

    export interface NoticeData {
        id: string;
        message: string;
    }

    export function Notice(props: NoticeProps) {
        const theme = useTheme();
        const [visible, setVisible] = useState(false); // Initialize as false
    
        useEffect(() => {
            setVisible(true); // Show the notice when it's initially created
        }, []);
    
        const handleClose = () => {
            setVisible(false); // Hide the notice when the user closes it
            props.onClose();
        };
    
        // Conditionally render the View based on the 'visible' state
        return (
            visible && (
                <View style={{ backgroundColor: theme['color-warning-hover'], padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowRadius: 5, shadowOpacity: 0.5, shadowOffset: { width: 0, height: 0 }, opacity: 0.85, borderColor: "black", borderWidth: 1 }}>
                    <Text style={{ color: theme['text-basic-color'] }}>{props.message}</Text>
                    <CloseIcon2 onPress={handleClose} />
                </View>
            )
        );
    }
    