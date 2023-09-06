import React from 'react';
import { Card, Text } from '@ui-kitten/components';

type CardProps = {
    title: string;
    count: number;
    status: 'submitted' | 'approved' | 'draft';
    onPress?: () => void;
    style?: any;
  };

const colors = {
  submitted: '#D1E8D1',
  draft: '#FFEB3B',
  approved: '#B2DFDB',
};

const ExpenseStatusCard: React.FC<CardProps> = ({ title, count, status, onPress, style }) => {
  return (
    <Card onPress={onPress} style={[style, { backgroundColor: colors[status] }]}>
      <Text category="h5">{title}</Text>
      <Text category="h2">{count}</Text>
    </Card>
  );
};

export default ExpenseStatusCard;
