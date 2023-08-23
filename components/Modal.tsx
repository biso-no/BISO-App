import React from 'react';
import { View, Text, TouchableOpacity, Modal as DefaultModal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useThemeColor } from '../components/Themed';

interface CustomModalProps {
  visible: boolean;
  onRequestClose: () => void;
  title: string;
  onFirstOption: () => void;
  onSecondOption: () => void;
  options?: string[];
}

const Modal: React.FC<CustomModalProps> = ({
    visible,
    onRequestClose,
    title,
    onFirstOption,
    onSecondOption,
    options,
  }) => {
    const primaryBackgroundColor = useThemeColor({}, 'primaryBackground');
    const primaryColor = useThemeColor({}, 'primary');
    const textColor = useThemeColor({}, 'text');
  
    return (
      <DefaultModal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onRequestClose}
      >
        <TouchableWithoutFeedback onPress={onRequestClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.modalView, { backgroundColor: primaryBackgroundColor }]}>
                <Text style={[styles.modalTitle, { color: textColor }]}>{title}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={onFirstOption}>
                    <Text style={[styles.modalText, { color: primaryColor }]}>{options ? options[0] : 'Yes'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onSecondOption}>
                    <Text style={[styles.modalText, { color: primaryColor }]}>{options ? options[1] : 'No'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </DefaultModal>
    );
  };
  

const styles = StyleSheet.create({
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the background color and opacity as needed
  },
});

export default Modal;
