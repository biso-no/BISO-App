import React from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Card, Text, useTheme } from '@ui-kitten/components';
import { ExternalLink } from 'lucide-react-native';

interface GridItem {
  key: string;
  icon: React.ReactElement;
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isExternalLink?: boolean;
}

interface GridProps {
  items: GridItem[];
}

export default function Grid({ items }: GridProps) {

  const theme = useTheme();

  const renderIsExternalLink  = (item: GridItem) => {
    if (item.isExternalLink) {
      return (
        <View style={styles.iconContainer}>
          {item.icon}
          <ExternalLink style={styles.externalLinkIcon} size={16} color={theme['text-basic-color']} />
        </View>
      );
    }
    return item.icon;
  };

  const renderItem = ({ item }: { item: GridItem }) => (
    <Card onPress={item.onPress} style={styles.gridItem} disabled={item.disabled}>
      {renderIsExternalLink(item)}
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
  iconContainer: {
    position: 'relative',
  },
  externalLinkIcon: {
    position: 'absolute',
    right: -10,
    top: -10,
  },
});

