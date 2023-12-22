import axios from 'axios';

interface PaymentDataProps {
        productId: number;
        productName: string;
        price: number;
        name: string;
        phoneNumber: string;
        studentId: number;
        campus: string;
        source: string;
        paymentMethod: string;
}

export default async function initVippsPayment({ productId, productName, price, name, phoneNumber, studentId, campus, source, paymentMethod }: PaymentDataProps) {
    console.log('initVippsPayment', productId, productName, price, phoneNumber, source);

    const data = {
        productId,
        productName,
        value: price,
        name: name,
        phoneNumber,
        studentId,
        campus,
        source,
        paymentMethod
    }

    console.log('data', data)
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