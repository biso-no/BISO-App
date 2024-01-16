import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Linking } from 'react-native';
import i18n from '../constants/localization';
import initVippsPayment from '../hooks/initVippsPayment';

interface VippsButtonProps {
    order: {
        productId: number;
        productName: string;
        price: number;
        name: string;
        phoneNumber: string;
        studentId: number;
        campus: string;
        source: string;
        paymentMethod: string;
    };
}

export function VippsButton({ order }: VippsButtonProps) {
    
    const locale = i18n.locale;

    const imageSource = locale === 'nb' 
        ? require('../assets/images/betal_med_vipps.png') 
        : require('../assets/images/pay_with_vipps.png');

    //Run initVippsPayment hook with onPress.
    const onPress = async () => {
        console.log('Vipps button pressed');
        const redirectUrl = await initVippsPayment(order);
        const redirectUrlString = redirectUrl.toString();
        console.log("RedirectUri: ", redirectUrl)
        if (redirectUrl) {
            Linking.openURL(redirectUrlString).catch(err => console.error('An error occurred', err));
        } else {
            // Handle the case where no URL is returned
            console.error('Failed to get the redirect URL');
        }
    }

    return (
        <TouchableOpacity onPress={onPress}>
            <Image style={styles.image} source={imageSource} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 50,
        borderRadius: 16,
    }
});