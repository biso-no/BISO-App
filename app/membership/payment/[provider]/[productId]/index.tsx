import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Layout, Text, Input } from '@ui-kitten/components';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useAuthentication } from '../../../../../hooks';
import { useLocalSearchParams } from 'expo-router';

function VippsPayment({ productId }: { productId: string }) {

    return (
        <View>
            <Text>Vipps</Text>
            <Text>{productId}</Text>
        </View>

    )
}

function StripePayment() {
    
    return (
        <View>
            <Text>Stripe</Text>
        </View>
    )
}

export default function PaymentScreen() {

    const { user, loading } = useAuthentication();
    const { provider, productId } = useLocalSearchParams();

    if (loading) {
        return <Text>Loading...</Text>
    }

    //If user selected Vipps, show Vipps payment screen, otherwise show Stripe
    if (provider === 'vipps') {
        return <VippsPayment productId={productId} />
    }

    return <StripePayment />

}