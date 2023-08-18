import React, { useState } from 'react';
import { StyleSheet, View, FlatList, } from 'react-native';
import { Button, Card, Input, Modal, Text } from '@ui-kitten/components';

//Typesafe Searchable modal component.
//When the modal is opened, display a backdrop. The modal renders a list of items that can be selected.
//Above the list, display a search field.
//When the user selects an item, automatically close the modal and return the selected item.
//When the user closes the modal, return undefined.

interface SearchableSelectProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    items: string[];
    onSelect: (item: string) => void;
    onClose: () => void;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ visible, setVisible, items, onSelect, onClose }) => {
    
        const [searchText, setSearchText] = useState<string>('');
        const [filteredItems, setFilteredItems] = useState<string[]>(items);
    
        const onSearchTextChange = (text: string) => {
            setSearchText(text);
            setFilteredItems(items.filter(item => item.toLowerCase().includes(text.toLowerCase())));
        };
    
        const renderItem = ({ item }: { item: string }) => (
            <Card style={styles.item} onPress={() => { onSelect(item); setVisible(false); }}>
                <Text>{item}</Text>
            </Card>
        );
    
        return (
            <Modal
                visible={visible}
                backdropStyle={styles.backdrop}
                onBackdropPress={() => { setVisible(false); onClose(); }}>
                <Card disabled={true}>
                    <View style={styles.container}>
                        <View style={styles.searchContainer}>
                            <Text>Search</Text>
                            <View style={styles.searchField}>
                                <Input
                                    placeholder='Search'
                                    value={searchText}
                                    onChangeText={onSearchTextChange}
                                />
                            </View>
                        </View>
                        <FlatList
                            style={styles.list}
                            data={filteredItems}
                            renderItem={renderItem}
                            keyExtractor={item => item}
                        />
                    </View>
                </Card>
            </Modal>
        );
    };

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        maxHeight: 400,
        width: 300,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8,
    },
    searchField: {
        flex: 1,
        marginLeft: 8,
    },
    list: {
        maxHeight: 300,
    },
    item: {
        margin: 8,
    },
});
