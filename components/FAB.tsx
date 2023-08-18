import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@ui-kitten/components';

interface FABProps {
  icon: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  expandable?: boolean;
  expanded?: boolean;
}

interface FABMenuItem {
  label: string;
  onPress: () => void;
}

const FAB: React.FC<FABProps> = ({ icon, onPress, style, expandable, expanded }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuItems: FABMenuItem[] = [
    // Define your menu items here
    { label: 'Item 1', onPress: () => console.log('Item 1 pressed') },
    { label: 'Item 2', onPress: () => console.log('Item 2 pressed') },
  ];

  const theme = useTheme();

  const handlePress = () => {
    if (expandable) {
      setMenuOpen(!menuOpen);
    }
    onPress();
  };

  return (
    <View style={[styles.container, style]}>
      {menuOpen && (
        <View style={styles.menu}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuItem} onPress={item.onPress}>
              <Text>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableOpacity style={[styles.fab, { backgroundColor: theme['color-primary-500'] }]} onPress={handlePress}>
        {icon}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'flex-end',
    marginBottom: 16,
    marginRight: 16,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    position: 'absolute',
    top: -16,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 4,
  },
  menuItem: {
    paddingVertical: 4,
  },
});

export default FAB;
