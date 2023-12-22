import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Layout, Text, StyleService, Divider, RadioGroup, Radio } from '@ui-kitten/components';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, Redirect } from 'expo-router';
import { Product } from '../../types';
import { useAuthentication } from '../../hooks';
import { Link } from 'expo-router';
import { VippsButton } from '../../components/VippsButton';
import { useUserProfile } from '../../hooks';

import { PaymentMethod } from '../../components/PaymentMethod';

//Checkbox options are CARD or WALLET
const options = ['CARD', 'WALLET'];

interface PaymentDataProps {
  productId: number;
  productName: string;
  price: number;
  phoneNumber: string;
  studentId: number;
  source: string;
  paymentMethod: string;
}


export default function MembershipScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [productId, setProductId] = useState<number>();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('CARD');

  const { user } = useAuthentication();
  const { profile } = useUserProfile();
  
  const router = useRouter(); 

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('https://api.web.biso.no/api/products');
      console.log(response.data);
      setProducts(response.data as Product[]);
    };
    fetchProducts();
  }, []);
  

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setProductId(product.id);
  };

  const fullName = profile?.firstName + ' ' + profile?.lastName;

  const order = {
    productId: productId,
    productName: selectedProduct?.name,
    price: selectedProduct?.price,
    phoneNumber: profile?.phone,
    studentId: profile?.studentId,
    name: fullName,
    campus: profile?.campus,
    source: 'membership',
    paymentMethod: selectedPaymentMethod, // Added line
  }
  
  

  return (
    <Layout style={styles.container}>
      <Text style={styles.selectPaymentText}>Select membership</Text>
      <View style={styles.productsContainer}>
        {products.map((product) => (
          <TouchableOpacity
            style={[
              styles.productBox,
              selectedProduct && selectedProduct.id === product.id && styles.selectedProductBox,
            ]}
            key={product.id}
            onPress={() => handleProductSelect(product)}
          >
            {product.discount > 17 && (
              <View style={styles.saveAmountBox}>
                <Text style={styles.saveAmountText}>-{((product.price / 300) * 100).toFixed(0)},-</Text>
              </View>
            )}
            <Text style={[styles.productName, selectedProduct && selectedProduct.id === product.id && styles.selectedProductName]}>{product.name}</Text>
            <Text style={[styles.productPrice, selectedProduct && selectedProduct.id === product.id && styles.selectedProductPrice]}>{product.price},-</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.infoContainer}>
        <Ionicons name="ios-information-circle-outline" size={24} color="black" />
        <Text style={styles.infoText}>
          Membership lasts until the end of the year.
        </Text>
      </View>
              <PaymentMethod selectedPaymentMethod={selectedPaymentMethod} setSelectedPaymentMethod={setSelectedPaymentMethod} />
      <View style={styles.buttonsContainer}>
        <VippsButton order={order} />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  button: {
    borderRadius: 16,
    marginTop: 10,
    fontSize: 18,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  selectPaymentText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    alignSelf: 'center',
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productBox: {
    width: '30%',
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 10,
    padding: 10,
    justifyContent: 'space-between',
  },
  selectedProductBox: {
    borderColor: '#000',
    backgroundColor: 'black',
  },
  saveAmountBox: {
    backgroundColor: 'red',
    padding: 0,
    borderRadius: 5,
    marginTop: '-30%',

  },
  saveAmountText: {
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    position: 'absolute',
    top: 20,
    textTransform: 'uppercase',
  },
  selectedProductName: {
    color: 'white',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
  },
  selectedProductPrice: {
    color: 'white',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    alignSelf: 'center',
    marginTop: 30,
  },
  dummyButton1: {
    width: '30%',
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dummyButton2: {
    width: '30%',
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    width: '30%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
  },
  buttonText: {
    color: '#000',
  },
  payButton: {
    height: 50,
    borderRadius: 40,
    marginTop: 30,
  },
  payButtonText: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  radioGroupContainer: {
    marginTop: 20,
  },
});
