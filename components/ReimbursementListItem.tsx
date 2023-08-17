import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Dimensions, Image } from 'react-native';

import { ReimbursementListItemProps } from '../types';
import { expenseStatus } from '../hooks/expenseStatus';
import { useThemeColor } from './Themed';
import { useTheme, Text, StyleService, Layout } from '@ui-kitten/components';


const ReimbursementListItem = ({ item, onPress, isApproved }: ReimbursementListItemProps) => {

 

  const theme = useTheme();

  const backgroundColor = theme['color-primary-400'];
  const primaryBackgroundColor  = theme['color-primary-500'];
  const textColor = theme['color-basic-100'];

  const prepaymentReceived = item.prepayment === 'Yes';
  const spentAmount = item.total;
  const prepaidAmount = item.prepaymentAmount;
  const outstandingAmount = prepaymentReceived ? spentAmount - prepaidAmount : spentAmount;
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
    <TouchableOpacity onPress={onPress} style={[styles.container, containerStyle]}>
        {/* Potential space for an image or icon, just as an example */}
        <Layout style={styles.imageContainer}>
            <Image source={{uri: 'URL_TO_THE_IMAGE_OR_ICON'}} style={styles.image} />
        </Layout>
        <Layout style={styles.textContainer}>
            <Text style={[styles.title, { color: textColor}]}>Expense #{item.invoiceId}</Text>
            <Text style={[styles.subtitle, { color: textColor}]}>{item.purpose}</Text>
            <Text style={[styles.date, { color: textColor}]}>{item.date.toDate().toLocaleDateString()}</Text>
            <Text style={[styles.amountText, styles.outstandingText]}>{`${outstandingAmount} NOK`}</Text>
        </Layout>
    </TouchableOpacity>
);
};

const styles = StyleService.create({
container: {
    flexDirection: 'row',
    padding: 20, 
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
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
});

export default ReimbursementListItem;
