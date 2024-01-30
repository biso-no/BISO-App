import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Dimensions, View } from 'react-native';

import { ReimbursementListItemProps } from '../types';
import { useTheme, Text, StyleService, Layout } from '@ui-kitten/components';
import axios from 'axios';
import BadgeComponent from './Badge';
import SkeletonBadge from './SkeletonBadge';



const ReimbursementListItem = ({ item, onPress }: ReimbursementListItemProps) => {

    const [expenseStatus, setExpenseStatus] = useState('Awaiting');
    const [loading, setLoading] = useState(true);

    const theme = useTheme();

     const [badgeColor, setBadgeColor] = useState('');
     const greenColor = theme['color-success-default'];
     const yellowColor = theme['color-warning-default'];





  const { height: windowHeight } = Dimensions.get('window');
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    if (listHeight < windowHeight) {
      const paddingHeight = windowHeight - listHeight;
      const paddingElement = <Layout key="padding" style={{ height: paddingHeight }} />;
      setListHeight(listHeight + paddingHeight);
    }
  }, [listHeight]);

  useEffect(() => {
    axios.get('https://api.web.biso.no/expenseStatus', {
  headers: {
    'x-access-key': '21ijen321heb12iuhb34hjfjhdfsnbfisdnfiusadn328'
  },
  params: {
    invoiceNo: item.invoiceNo,
    customerName: item.firstName + ' ' + item.lastName,
  }
})
.then(response => {
    const status = response.data === true ? 'Booked' : 'Awaiting';
    setExpenseStatus(status);
    setBadgeColor(status === 'Booked' ? greenColor : yellowColor);
    setLoading(false);
  })
.catch(error => console.error(error));
  }, []);
  
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container]}>
      <View style={[styles.textContainer]}>
        <Text style={[styles.date]}>{item.date.toDate().toLocaleDateString()}</Text>
        <View style={styles.row}>
          <Text style={[styles.title]} numberOfLines={1}>{item.invoiceNo}</Text>
          <Text style={[styles.amountText, styles.outstandingText]}>{item.totalAmount}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 3 }}>
            <Text style={[styles.subtitle]} numberOfLines={3}>{item.purpose}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
          {loading ? <SkeletonBadge loading={loading} /> : <BadgeComponent text={expenseStatus} color={badgeColor} />}
          </View>
        </View>
      </View>
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
