import React, { useState, useCallback } from 'react';
import { Modal, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { SelectorProps } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { Layout, Text, Input, Button } from '@ui-kitten/components';

const { width } = Dimensions.get('window');

export type DataItem = {
  id: string;
  name: string;
  campus: string;
  organisation: string;
};

type Props = SelectorProps & {
  multiSelect?: boolean;
  allData?: DataItem[];
  favoriteData?: DataItem[];
};

const Selector: React.FC<Props> = ({ 
  visible, 
  allData = [], 
  favoriteData = [], 
  onSelect, 
  onClose, 
  enableSearch = false, 
  enableFavorites = false, 
  multiSelect = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedItems, setSelectedItems] = useState<DataItem[]>([]);

  const filteredData = favoritesOnly && enableFavorites ? favoriteData : allData;
  const filteredDataWithSearch = filteredData.filter(item => 
    item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const toggleFavorites = useCallback(() => {
    setFavoritesOnly(prev => !prev);
  }, []);

  const toggleItemSelection = useCallback((item: DataItem) => {
    console.log("Before Toggle:", selectedItems);
  
    if (multiSelect) {
      if (selectedItems.some(selectedItem => selectedItem.id === item.id)) {
        setSelectedItems(prevItems => prevItems.filter(selectedItem => selectedItem.id !== item.id));
      } else {
        setSelectedItems(prevItems => [...prevItems, item]);
      }
    } else {
      setSelectedItems([item]);
    }
  
    console.log("After Toggle:", selectedItems);
  }, [multiSelect, selectedItems]);
  
  

  const isItemSelected = useCallback((item: DataItem) => selectedItems.some(selectedItem => selectedItem.id === item.id), [selectedItems]);

  const handleOnClose = useCallback(() => {
    //If item is selected, call onSelect with the selected items
    if (selectedItems.length > 0) {
      onSelect(selectedItems);
    }

    //Reset the selected items
    setSelectedItems([]);
    onClose();
  }
  , [selectedItems, onSelect, onClose]);



  return (
    <Modal visible={visible} animationType="slide">
      <Layout style={styles.container}>
        {enableSearch && (
          <Input 
            placeholder="Search..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
            accessoryRight={() => <Ionicons name="search" size={20} />}
          />
        )}

        {enableFavorites && (
          <Button
            onPress={toggleFavorites}
            appearance={favoritesOnly ? "filled" : "outline"}
            accessoryRight={() => <Ionicons name="star" size={20} color={favoritesOnly ? "#FFF" : "#000"} />}
            style={styles.favoriteButton}
          >
            {favoritesOnly ? "Favorites Only" : "All Items"}
          </Button>
        )}

        <FlatList 
          data={filteredDataWithSearch}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => toggleItemSelection(item)} style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
              {isItemSelected(item) && <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />}
            </TouchableOpacity>
          )}
        />
        <Button onPress={handleOnClose} style={styles.closeButton}>Close</Button>
      </Layout>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchInput: {
    marginBottom: 10
  },
  favoriteButton: {
    marginBottom: 10
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#E4E9F2'
  },
  itemText: {
    fontSize: 16
  },
  closeButton: {
    marginVertical: 10
  }
});

export default Selector;
