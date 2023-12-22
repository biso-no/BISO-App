import axios from 'axios';

interface PaymentDataProps {
        productId: number;
        productName: string;
        price: number;
        phoneNumber: string;
        source: string;
}

export default async function initVippsPayment({ productId, productName, price, phoneNumber, source }: PaymentDataProps) {
    console.log('initVippsPayment', productId, productName, price, phoneNumber, source);

    const data = {
        productId,
        productName,
        value: price,
        phoneNumber,
        source
    }

    try {
        const response = await axios.post('https://api.web.biso.no/api/payment/vipps/create-payment', data);
        console.log('response', response.data);
        return response.data;
    }
    catch (error) {
        console.error(error);
        return '';
    }
}