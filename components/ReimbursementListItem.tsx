import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Dimensions, View } from 'react-native';

import { ReimbursementListItemProps } from '../types';
import { useTheme, Text, StyleService, Layout } from '@ui-kitten/components';


const ReimbursementListItem = ({ item, onPress, isApproved }: ReimbursementListItemProps) => {

 

  const theme = useTheme();

  const backgroundColor = theme['color-basic-800'];
  const primaryBackgroundColor  = theme['color-primary-500'];
  const textColor = theme['color-basic-100'];

  
  const prepaymentReceived = item.prepayment === 'Yes';
  const spentAmount = item.total;
  const prepaidAmount = item.prepaymentAmount;
  //TODO! Add approved logic when service is up.
  //const containerStyle = isApproved ? { backgroundColor: primaryBackgroundColor } : { backgroundColor: backgroundColor };
  const containerStyle = { backgroundColor: backgroundColor };


  const { height: windowHeight } = Dimensions.get('window');
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    if (listHeight < windowHeight) {
      const paddingHeight = windowHeight - listHeight;
      const paddingElement = <Layout key="padding" style={{ height: paddingHeight }} />;
      setListHeight(listHeight + paddingHeight);
    }
  }, [listHeight]);

  

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container]}>
        {/* Potential space for an image or icon, just as an example */}
        <Layout style={[styles.textContainer]}>
        <Text style={[styles.date]}>{item.date.toDate().toLocaleDateString()}</Text>
        <View style={styles.row}>
  <Text style={[styles.title]} numberOfLines={1}>{item.invoiceNo}</Text>
  <Text style={[styles.amountText, styles.outstandingText]}>{item.totalAmount}</Text>
</View>
<View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
  <Text style={[styles.subtitle]} numberOfLines={3}>{item.purpose}</Text>

</View>
        </Layout>
    </TouchableOpacity>
);
};

const styles = StyleService.create({
container: {
    flexDirection: 'row',
    padding: 20, 
    marginBottom: 15,
    rounded: 5,
    elevation: 1,
},
imageContainer: {
    flex: 1,
    marginRight: 20,
},
image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
},
textContainer: {
    flex: 2,
},
title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
},
subtitle: {
    fontSize: 16,
    marginBottom: 10,
},
date: {
    fontSize: 16,
    marginBottom: 10,
},
amountText: {
    fontSize: 24,
    fontWeight: 'bold',
},
paidText: {
    color: '#1976d2',
},
outstandingText: {
    color: '#4caf50',
},
row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
},

});

export default ReimbursementListItem;
