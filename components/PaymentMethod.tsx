import { Badge, BadgeCheck } from 'lucide-react-native';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Text } from '@ui-kitten/components';

const options = ['CARD', 'WALLET'];

interface PaymentMethodProps {
    selectedPaymentMethod: string;
    setSelectedPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
}

export function PaymentMethod({ selectedPaymentMethod, setSelectedPaymentMethod }: PaymentMethodProps) {

    const handlePaymentMethodSelect = (index: number) => {
        setSelectedPaymentMethod(options[index]);
    }

    return (
        <View style={styles.container}>
            <Text category='h6'>Velg betalingsmetode</Text>
            <View style={styles.paymentMethodContainer}>
                {options.map((option, index) => (
                    <TouchableOpacity key={index} onPress={() => handlePaymentMethodSelect(index)} style={styles.paymentMethod}>
                        {selectedPaymentMethod === option ? <BadgeCheck size={24} style={{ color: 'black'}} /> : <Badge size={24} style={{ color: 'black'}} />}
                        <Text style={styles.paymentMethodText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    paymentMethodContainer: {
        flexDirection: 'column',
        marginVertical: 8,
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10, // Add padding for each option
        borderWidth: 1, // Optional: Add border for each option box
        borderRadius: 5, // Optional: Round the corners of the option box
        marginBottom: 5, // Space between each option
    },
    paymentMethodText: {
        marginLeft: 8,
    },
});
