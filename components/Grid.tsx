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
    <View style={[styles.card, { backgroundColor: theme['background-basic-color-1'] }]}>
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
      numColumns={2}
      style={{ flex: 1, width: '100%', padding: 10 }}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 20,
    margin: 5,
  },
  title: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'normal',
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: -10,
    width: '100%',
    borderRadius: 20,
  },
});

export default Grid;
