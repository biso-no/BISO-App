import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Layout, Text, StyleService } from '@ui-kitten/components';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useSearchParams } from 'expo-router';
import TextInput from '../components/TextInput';
import { useAuthentication } from '../hooks';
const stripe = require('stripe-client')('pk_test_gVvcgfdzboTdS3wjp2Jmrgfj00R06iGFfc');

export default function PaymentScren () {

    const router = useRouter();
   const params = useSearchParams();
   useEffect(() => {
    console.log('params', params);
    }, [params]);

    const { selectedProduct, userId } = params as { selectedProduct: string; userId: string };
    const product = JSON.parse(selectedProduct);
   
    const [cardNumber, setCardNumber] = useState<string>('');
    const [cardExpiry, setCardExpiry] = useState<string>('');
    const [cardCvc, setCardCvc] = useState<string>('');
    const [cardHolderName, setCardHolderName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<boolean>(false);

    const { user } = useAuthentication();

    if (!selectedProduct) {
        router.push('/MembershipScreen');
    }


    const handlePay = async () => {
        setLoading(true);
        setError('');
        setSuccess(false);
        try {
            const token = await stripe.createToken({
                card: {
                    number: cardNumber,
                    exp_month: parseInt(cardExpiry.split('/')[0]),
                    exp_year: parseInt(cardExpiry.split('/')[1]),
                    cvc: cardCvc,
                    name: cardHolderName
                }
            });
            const response = await axios.post('https://api.web.biso.no/api/payments', {
                token: token.id,
                amount: product.price,
                product: product.name,
                user: userId
            });
            if (response.data.status === 'succeeded') {
                setSuccess(true);
                Alert.alert('Payment successful', 'Your payment was successful. You will receive your product shortly.');
            }
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    }

    const handleExpiryDateChange = (text: string) => {
        // Remove any non-numeric characters
        const cleaned = text.replace(/\D+/g, '');
    
        // Check the length of the input, and add a / after the first 2 digits
        if (cleaned.length < 3) {
          setCardExpiry(cleaned);
        } else {
          setCardExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
        }
      };

    return (
        <Layout style={styles.container}>
            <View style={styles.content}>
                <View style={styles.product}>
                    <View style={styles.productDetails}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.productPrice}>NOK{product.price}</Text>
                    </View>
                </View>
                <View style={styles.form}>
                    <TextInput
                        label="Card number"
                        value={cardNumber}
                        onChangeText={text => setCardNumber(text)}
                        keyboardType="numeric"
                        maxLength={16}
                    />
                    <TextInput
                        label="Expiry date"
                        value={cardExpiry}
                        onChangeText={handleExpiryDateChange}
                        keyboardType="numeric"
                        maxLength={5}
                    />
                    <TextInput
                        label="CVC"
                        value={cardCvc}
                        onChangeText={text => setCardCvc(text)}
                        keyboardType="numeric"
                        maxLength={3}
                    />
                    <TextInput
                        label="Card holder name"
                        value={cardHolderName}
                        onChangeText={text => setCardHolderName(text)}
                    />
                    <TouchableOpacity style={styles.payButton} onPress={handlePay}>
                        <Text style={styles.payButtonText}>Pay</Text>
                    </TouchableOpacity>
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    {success ? <Text style={styles.success}>Payment successful</Text> : null}
                </View>

            </View>

        </Layout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        backgroundColor: '#000',
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16
    },
    content: {
        flex: 1,
        padding: 16
    },
    product: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 4
    },
    productDetails: {
        marginLeft: 16
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    productPrice: {
        fontSize: 14,
        color: '#888'
    },
    form: {
        flex: 1,
        justifyContent: 'center'
    },
    payButton: {
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 16
    },
    payButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    error: {
        color: 'red',
        marginBottom: 16
    },
    success: {
        color: 'green',
        marginBottom: 16
    }
});