import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from '@ui-kitten/components';
import { ExternalLink } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';


interface GridItem {
  key: string;
  icon: React.ReactElement;
  backgroundColor: string;
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


  const renderItem = (item: GridItem) => (
    <TouchableOpacity onPress={item.onPress} style={[styles.gridItem]} disabled={item.disabled}>
      <View
      style={[styles.gradientBackground, { backgroundColor: theme['color-info-focus'] }]}
      >
        {item.isExternalLink && (
          <ExternalLink color="white" size={20} style={styles.externalLinkIcon} />
        )}
        {item.icon}
      <View style={styles.cardBottom}>
          <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      </View>
    </TouchableOpacity>
  );
  



  //Return the grid with 2 columns.
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.contentContainer}>{items.map(renderItem)}</View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    padding: 0,
    margin: 0,
    borderRadius: 0,
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItem: {
    width: '50%',
    padding: 10,
    height: 120,
  },
  gradientBackground: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
  },
  cardTop: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardBottom: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  externalLinkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

});

