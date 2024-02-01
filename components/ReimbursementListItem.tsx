import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Dimensions, View } from 'react-native';

import { useTheme, Text, StyleService, Layout } from '@ui-kitten/components';
import axios from 'axios';
import BadgeComponent from './Badge';
import SkeletonBadge from './SkeletonBadge';


interface ReimbursementListItemProps {
  item: any;
  onPress: () => void;
  isApproved: boolean;
  status: string;
}

//Need a Skeleton version of this component to render while loading.
export const ReimbursementListItemSkeleton = () => {
  const theme = useTheme();
  const greenColor = theme['color-success-default'];
  const yellowColor = theme['color-warning-default'];
  return (
    <TouchableOpacity style={[styles.container]}>
      <View style={[styles.textContainer]}>
        <Text style={[styles.date]}></Text>
        <View style={styles.row}>
          <Text style={[styles.title]} numberOfLines={1}></Text>
          <Text style={[styles.amountText, styles.outstandingText]}></Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 3 }}>
            <Text style={[styles.subtitle]} numberOfLines={3}></Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const ReimbursementListItem = ({ item, onPress , status}: ReimbursementListItemProps) => {


    const theme = useTheme();

    const greenColor = theme['color-success-default'];
    const yellowColor = theme['color-warning-default'];

    useEffect(() => {
      console.log(status)
    }
    ,[])
  
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
        <BadgeComponent text={status} color={status === 'Approved' ? greenColor : yellowColor} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleService.create({
container: {
    flex: 1,
    flexDirection: 'row',
    padding: 20, 
    marginBottom: 15,
    rounded: 5,
    elevation: 1,
},
badge: {
  minWidth: 80, // Set a minimum width for the badge to fit the text
  justifyContent: 'center',
  paddingHorizontal: 10, // Add horizontal padding to ensure the text fits comfortably
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
