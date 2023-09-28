import React from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Text, useTheme } from '@ui-kitten/components';

interface GridItem {
  key: string;
  icon: React.ReactElement;
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

interface GridProps {
  items: GridItem[];
}

const Grid: React.FC<GridProps> = ({ items }, ...props) => {

  const theme = useTheme();


  const renderItem = ({ item }: { item: GridItem }) => (
    <Card onPress={item.onPress} style={styles.gridItem} disabled={item.disabled}>
      {item.icon}
      <Text style={styles.title}>{item.title}</Text>
    </Card>
  );



  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
      numColumns={3}
      style={{ flex: 1, width: '100%', padding: 10 }}
    />
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  title: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'normal',
  },
});

export default Grid;
