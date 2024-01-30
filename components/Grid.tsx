import React from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Card, Text, useTheme } from '@ui-kitten/components';
import { ExternalLink } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';


interface GridItem {
  key: string;
  icon: React.ReactElement;
  backgroundColor: string[];
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


  const renderItem = ({ item }: { item: GridItem }) => (
    <TouchableOpacity onPress={item.onPress} style={[styles.gridItem]} disabled={item.disabled}>
      <LinearGradient
      colors={item.backgroundColor}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
      >
      <View style={styles.cardTop}>
        {item.isExternalLink && (
          <ExternalLink color="white" size={20} style={styles.externalLinkIcon} />
        )}
        {item.icon}
      </View>
      <View style={styles.cardBottom}>
          <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      </LinearGradient>
    </TouchableOpacity>
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
  card: {
    flex: 1,
    marginTop: 10,
    marginBottom: -10,
    width: '100%',
    borderRadius: 20,
    borderColor: 'transparent',
  },

  externalLinkIcon: {
    position: 'absolute',
    right: -10,
    top: -10,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gridItem: {
    flex: 1,
    margin: 10,
    borderRadius: 20,
    height: 150,
    padding: 10,
    position: 'relative', // Ensure the card is positioned relative for absolute positioning of children
  },
  cardTop: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  cardBottom: {
    position: 'absolute',
    bottom: 10, // Adjust this value as needed to position the title correctly
    left: 20,
    right: 20, 
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 20, // Match the borderRadius of gridItem
    padding: 10, // Match the padding of gridItem
    position: 'relative', // Match the position of gridItem
  },
});

