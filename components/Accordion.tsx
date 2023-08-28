import React, { useState, useRef, useEffect, ReactNode } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
  View as DefaultView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from './Themed';
import { useThemeColor } from './Themed';
import { Attachment } from '../types';
import TextInput from './TextInput';
import { Button } from './Button';
import Modal from './Modal';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
  deleteable?: boolean;
  expandable?: boolean;
  children?: ReactNode;
  onDelete?: () => void;
  onPress?: () => void;
  item?: Attachment;
  index?: number;
  onDescriptionChange?: (text: string) => void;
  onDateChange?: (text: string) => void;
  onAmountChange?: (text: string) => void;
}

const screenWidth = Dimensions.get('window').width;

const Accordion: React.FC<AccordionProps> = ({
  title,
  subtitle,
  icon,
  content,
  deleteable,
  expandable,
  children,
  onDelete,
  onPress,
  item,
  index,
  onDescriptionChange,
  onDateChange,
  onAmountChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const iconColor = useThemeColor({}, 'text');
  const primaryBackgroundColor = useThemeColor({}, 'primaryBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleAccordion = () => {
    if (expandable) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
    } else {
      onPress?.();
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    onDelete?.();
  };

  const renderContent = () => {
    if (content) return content;
    return children;
  };
  

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: 'transparent' },
        item && index !== undefined ? { transform: [{ translateX: slideAnim }] } : {},
      ]}
    >
      <TouchableOpacity style={styles.header} onPress={toggleAccordion}>
        {icon}
        <Text style={styles.title}>{title}</Text>
        <View style={styles.titleContainer}>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color={iconColor} />
        {deleteable && (
          <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
            <Ionicons name="close" size={24} color={iconColor} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {isExpanded && (
        <View style={[styles.contentContainer, { backgroundColor: 'transparent' }]}>{renderContent()}</View>
      )}
      {deleteable && (
        <Modal
          visible={showDeleteModal}
          onSecondOption={() => setShowDeleteModal(false)}
          onFirstOption={handleDelete}
          title="Are you sure you want to delete the attachment?"
          onRequestClose={() => setShowDeleteModal(false)}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderRadius: 10,
    width: screenWidth - 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
  },
  iconContainer: {
    marginRight: 15,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18, // Slightly larger font
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 5,
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  contentContainer: {
    padding: 15,
  },
  modalView: {
    position: 'absolute',
    bottom: 20, // Customize the distance from the bottom of the screen
    left: 20,
    right: 20,
    opacity: 1,
    height: 200,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  inputContainer: {
    width: '70%',
  },
  buttonsContainer: {
    width: '30%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    height: 60,
  },
});

export default Accordion;
