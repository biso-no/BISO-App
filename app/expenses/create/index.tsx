import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getDepartments, useAuthentication } from '../../../hooks';
import { Expense, Attachment, Subunit } from '../../../types';
import Accordion from '../../../components/Accordion';
import IonIcons from '@expo/vector-icons/Ionicons';
import generatePurpose from '../../../hooks/getPurpose';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Modal from '../../../components/Modal';
import CameraScreen from '../../../components/CameraModal';
import MlkitOcr from 'react-native-mlkit-ocr';
import axios from 'axios';
import Selector from '../../../components/Selector';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../../../config/firebase';
import { Layout, StyleService, useTheme, Button, Input, CheckBox, Divider, Spinner, Datepicker, Text } from '@ui-kitten/components';
import Constants from 'expo-constants'
import * as DocumentPicker from 'expo-document-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ExpenseConfirmationScreen from '../../../components/ExpenseConfirmation';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import Loading from '../../../components/Loading';
import {DateFnsOptions,DateFnsService} from '@ui-kitten/date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react-native';

const isRunningInExpoGo = Constants.appOwnership === 'expo'

const CreateExpenseScreen: React.FC = () => {
  const router = useRouter();
  const { user, profile } = useAuthentication();
  const theme = useTheme();

  const emptyExpense: Expense = {
    uid: user?.uid || '',
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    invoiceNo: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    date: new Date(),
    outstanding: 0,
    prepayment: false,
    purpose: '',
    bankAccountNumber: '',
    campus: '',
    department: '',
    totalAmount: 0,
    attachments: [] as Attachment[],
    isApproved: false,
  };

  const [expenseDetails, setExpenseDetails] = useState<Expense>(emptyExpense);
  const [favoriteUnits, setFavoriteUnits] = useState<Subunit[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [allDepartments, setAllDepartments] = useState<Subunit[]>([]);
  const [checked, setChecked] = useState(false);
  const [eventName, setEventName] = useState('');
  const [expenseSuccess, setExpenseSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitButtonEnabled, setSubmitButtonEnabled] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  React.useEffect(() => {
    const fetchDepartments = async () => {
      const departments = await getDepartments();
      setAllDepartments(departments);
    };
    fetchDepartments();
  }
  , []);

  const handleContactDetailsPress = () => {
    router.push('profile');
  };

  useEffect(() => {
    if (!user || user.uid) return router.push('login');
  }, [user]);

  useEffect(() => {
    let totalAmount = 0;
    expenseDetails.attachments.forEach((attachment) => {
      if (attachment.amount) {
        totalAmount += parseFloat(attachment.amount);
      }
    });
    setExpenseDetails((prevExpenseDetails) => ({
      ...prevExpenseDetails,
      totalAmount: totalAmount,
    }));
  }, [expenseDetails.attachments]);


  


  //Handle save draft. The expense details are saved to SecureStore, and the attachments are saved to FileSystem, with uri saved to SecureStore.
  const handleCloseAndSaveDraft = async () => {
    try {
      const attachments = expenseDetails.attachments.map((attachment) => ({
        ...attachment,
        file: attachment.file.split('/').pop(),
      }));
      const expenseDetailsToSave = {
        ...expenseDetails,
        attachments: attachments,
      };
      const expenseDetailsString = JSON.stringify(expenseDetailsToSave);
      await SecureStore.setItemAsync('expenseDetails', expenseDetailsString);
      await Promise.all(expenseDetails.attachments.map(async (attachment) => {
        const filename = attachment.file.split('/').pop();
        const fileUri = attachment.file;
        const fileDetails = await FileSystem.getInfoAsync(fileUri);
        const fileDetailsString = JSON.stringify(fileDetails);
        await SecureStore.setItemAsync(filename || '', fileDetailsString);
      }));
      router.push('expenses');
    } catch (error) {
      console.log(error);
    }
  };

  //Submit button is enabled if attachment details are populated. The button must be available as soon as the fields are filled.
  useEffect(() => {
    if (expenseDetails.attachments.length > 0 && expenseDetails.department !== '' && expenseDetails.totalAmount > 0 && expenseDetails.attachments.every((attachment) => attachment.amount)) {
      setSubmitButtonEnabled(true);
    } else {
      setSubmitButtonEnabled(false);
    }
  }, [expenseDetails.attachments, expenseDetails.department, expenseDetails.totalAmount]);
  
  


  const primaryBackgroundColor = theme['color-basic-1100'];
  const textColor = theme['color-basic-100'];

// Initialize profile values or empty data.
useEffect(() => {
  if (profile) {
    let campus = '';

    if (Array.isArray(profile.subunits) && profile.subunits.length > 0) {
      // Use the name of the first subunit as the campus
      campus = profile.subunits[0].campus;
    }

    setExpenseDetails({
      ...expenseDetails,
      firstName: profile.firstName || '',
      uid: user?.uid || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      address: profile.address || '',
      city: profile.city || '',
      zip: profile.zip || '',
      bankAccountNumber: profile.bankAccount || '',
      campus: campus,
      department: Array.isArray(profile.subunits) && profile.subunits.length > 0
      ? profile.subunits[0].name || ''
      : '',
      attachments: [
      ] as Attachment[],
    });

    if (profile.subunits ) {
      if (profile.subunits.length > 0) {
      const favoriteUnits: Subunit[] = profile.subunits.map((subunit: string | Subunit) => {
        if (typeof subunit === 'string') {
          return { id: '0', name: subunit, campus: '' }; // Provide default values for id and campus
        }
        return subunit;
      });
      setFavoriteUnits(favoriteUnits);
    }
    else {
      setFavoriteUnits([]);
    }
  }
  }
}, [profile]);




const createExpense = async (expenseDetails: Expense) => {

  try {
    const attachments = expenseDetails.attachments.map((attachment) => ({
      attachmentDescription: attachment.description,
      dateOfAttachment: attachment.date,
      amount: attachment.amount,
      image: attachment.file, // This is the local URI, change it to the download URL
    }));

    //Calculate the total amount of the expense
    let totalAmount = 0;
    expenseDetails.attachments.forEach((attachment) => {
      if (attachment.amount) {
        totalAmount += parseFloat(attachment.amount);
      }
    });
    const powerAutomateData = {
      firstname: expenseDetails.firstName,
      lastname: expenseDetails.lastName,
      address: expenseDetails.address,
      phone: expenseDetails.phone,
      city: expenseDetails.city,
      zip: expenseDetails.zip,
      email: expenseDetails.email,
      bank: expenseDetails.bankAccountNumber,
      org: expenseDetails.department,
      campus: expenseDetails.campus,
      purpose: expenseDetails.purpose,
      unit: expenseDetails.department,
      date: expenseDetails.date.toISOString(),
      prepayment: expenseDetails.prepayment || '',
      prepaymentAmount: expenseDetails.prepaymentAmount,
      attachments: attachments,
      total: totalAmount.toString(),
      //@TODO: Replace outstanding value with correct after prepayment is implemented.
      outstanding: totalAmount.toString(),
    };

    try {
      // Submit expense to Power Automate endpoint. The response contains the expense ID. Set to expenseDetails.id
      const response = await axios.post('https://prod-137.westeurope.logic.azure.com:443/workflows/57b3e0b3246d4fa68c8c88a04c7f8c0c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=G3ENciWITukSRZfV39m-vFsvOI8_MFWGXJytIwSYQCI', powerAutomateData);
      const data = response.data;
      console.warn('Invoice NO: ', data.invoiceId);
      const invoiceId = data.invoiceId;
      // Create the expense in Firestore
      const expenseRef = doc(db, `users/${user?.uid}/expenses/${invoiceId}`);
      console.log('Reference: ', expenseRef);
      await setDoc(expenseRef, {
        ...expenseDetails,
        docid: invoiceId,
        invoiceNo: data.invoiceId,
        attachments: attachments,
      });
      
      console.log('Expense created with ID: ', invoiceId);
      setExpenseSuccess(true);
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  } catch (error) {
    console.log('Error:' + error);
  }
};



const handleSubmit = async () => {
  setLoading(true);
  // Upload all attachments to Firebase Storage
  const uploadedAttachments: Attachment[] = [];

  await Promise.all(expenseDetails.attachments.map(async (attachment) => {
    const blob = await fetch(attachment.file).then((r) => r.blob());
    const filename = attachment.file.split('/').pop();
    const storageRef = ref(storage, `users/${user?.uid}/expenses/${expenseDetails.id}/${filename}`);
    
    try {
      // Upload the blob to Firebase Storage
      await uploadBytes(storageRef, blob);

      // Get the download URL of the uploaded file
      const url = await getDownloadURL(storageRef);

      // Store the download URL in Firestore
      uploadedAttachments.push({
        ...attachment,
        file: url,
      });
    } catch (error) {
      console.log(error);
    }
  }));

  const purpose = await generatePurpose(uploadedAttachments, eventName);
  console.log(purpose);

  // Update the expense details once with all changes
  setExpenseDetails((prevDetails) => ({
    ...prevDetails,
    attachments: uploadedAttachments, // Update with download URLs
    purpose: purpose,
  }));

  // Wait for the state update to finish, then create the expense
  await createExpense ({
    ...expenseDetails,
    attachments: uploadedAttachments, // Update with download URLs
    purpose: purpose,
  });
  setLoading(false);

};
  

const handleOcr = async (image: string) => {

  try {
 
  const imageUri = image

  if (isRunningInExpoGo) {
    // If running in Expo Go, just update the state
    const newAttachments = [{
      description: '',
      amount: '',
      date: '',
      file: imageUri,
    }];

    setExpenseDetails(prevDetails => ({
      ...prevDetails,
      attachments: [...prevDetails.attachments, ...newAttachments],
    }));
  } else {
    // Else, do the MlkitOcr and API call
    const result = await MlkitOcr.detectFromUri(imageUri);
    const text = result.map((block) => block.text).join('\n');

    try {
      const response = await axios.post('https://api.web.biso.no/openai', {
        text,
        token: 'sdbashdb13123ksadjdsn',
      });

      const data = response.data;
      const attachments = data.attachments

      const newAttachments = attachments.map((attachment: any) => {
        return {
          ...attachment,
          date: attachment.date || '',
          description: attachment.description || '',
          amount: attachment.amount || '',
          file: imageUri,
        };
      });

      setExpenseDetails(prevDetails => ({
        ...prevDetails,
        attachments: [...prevDetails.attachments, ...newAttachments],
      }));
    } catch (error) {
      console.log(error);
      //If the API call fails, just update the state with the image URI
      setExpenseDetails(prevDetails => ({
        ...prevDetails,
        attachments: [...prevDetails.attachments, {
          description: '',
          amount: '',
          date: '',
          file: imageUri,
        }],
      }))
    }
  }

  // Close modals
  setCameraModalVisible(false);
  setModalVisible(false);
} catch (error) {
  console.log(error);
}
};
  
  




//Multi select file picker that accepts pdf, jpg, png, jpeg. For each file, create an attachment object and add it to the attachments array.
const pickDocuments = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true
    });

    if (result.type !== 'cancel') {

      let documentDetails: Array<any> = [];

      
      if (Array.isArray(result.output)) {
        for (const asset of result.output) {
          console.log("Document Name:", asset.name);
          console.log("Document URI:", asset.uri);
          
          let text = '';
          if (!isRunningInExpoGo) {
            const ocrResult = await MlkitOcr.detectFromUri(asset.uri);
            text = ocrResult.map((block) => block.text).join('\n');
          

          const response = await axios.post('https://api.web.biso.no/openai', {
            text,
            token: 'sdbashdb13123ksadjdsn'
          });

          const data = response.data;
          const attachments = data.attachments;

          const newAttachments = attachments.map((attachment: any) => {
            return {
              ...attachment,
              date: attachment.date || '',
              description: attachment.description || '',
              amount: attachment.amount || '',
              file: asset.uri
            };
          });
          documentDetails = [...documentDetails, ...newAttachments];
        }

        setExpenseDetails(prevDetails => ({
          ...prevDetails,
          attachments: [...prevDetails.attachments, ...documentDetails],
        }))};
      } else {
        console.log("Document Name:", result.name);
        console.log("Document URI:", result.uri);

        //Save to state and pass along for submission
        const newAttachments = [{
          description: '',
          amount: '',
          date: '',
          file: result.uri,
        }];

        setExpenseDetails(prevDetails => ({
          ...prevDetails,
          attachments: [...prevDetails.attachments, ...newAttachments],
        }));
      }
    }
  } catch (error) {
    console.log(error);
  }
};


const scrollViewRef = useRef<ScrollView>(null);


const handleInputFocus = (inputField: string) => {
  let yOffset = 0;
  if (inputField === eventName) {
    yOffset = 250; // The offset depends on your UI. Adjust it as needed.
  }
  // ... Add conditions for other fields if necessary

  if (!scrollViewRef.current) return;
  scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
}


const DepartmentSelector = () => {
  const [showDepartments, setShowDepartments] = useState(false);

  const Backdrop = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', // This gives a semi-transparent black backdrop
      zIndex: 1, // Adjust this value if there are other components overlaying the backdrop
    }} 
    onClick={() => setShowDepartments(false)} // Optional: Close the selector when backdrop is clicked
    />
  );
  
  // Return a Input if there are no favorite units available
  if (favoriteUnits.length === 0) {
    return (
      <Layout style={{ flex: 1, backgroundColor: 'transparent' }}>
      <TouchableOpacity
        onPress={() => setShowDepartments(true)}
        style={[styles.fieldContainer, { backgroundColor: primaryBackgroundColor }]}
      >
        <Text style={{ color: textColor, fontSize: 16 }}>
          {expenseDetails.department || 'Velg avdeling'}
        </Text>
      </TouchableOpacity>
      {showDepartments && <Backdrop />}
      <Selector
        allData={allDepartments}
        visible={showDepartments}
        onClose={() => setShowDepartments(false)}
        onSelect={(items: { id: string; name: string; campus: string }[]) => {
          if (items.length > 0) {
            setExpenseDetails({
              ...expenseDetails,
              department: items[0].name,
              campus: items[0].campus,
            });
          }
          setShowDepartments(false);
        }
        }
      />
    </Layout>
    );
  }

  if (favoriteUnits.length > 1) {
    return (
      <Layout style={{ flex: 1, backgroundColor: 'transparent' }}>
        <TouchableOpacity
          onPress={() => setShowDepartments(true)}
          style={[styles.fieldContainer, { backgroundColor: primaryBackgroundColor }]}
        >
          <Text style={{ color: textColor, fontSize: 16 }}>
          {expenseDetails.department || 'Velg avdeling'}
          </Text>
          <IonIcons name="chevron-down" size={20} color={textColor} />
        </TouchableOpacity>
        
        <Selector
          allData={favoriteUnits.map((department) => ({
            id: department.id ? department.id.toString() : '',
            name: department.name || '',
            campus: department.campus || '',
          }))}
          visible={showDepartments}
          onClose={() => setShowDepartments(false)}
          onSelect={(items: { id: string; name: string; campus: string }[]) => {
            if (items.length > 0) {
              const selectedDepartment = items[0];
              setExpenseDetails({
                ...expenseDetails,
                department: selectedDepartment.name,
                campus: selectedDepartment.campus,
              });
            }
          }}
        />
      </Layout>
    );
  }
  
  return (
    <Layout style={{ flex: 1, backgroundColor: 'transparent' }}>
      <TouchableOpacity
        onPress={() => setShowDepartments(true)}
        style={[styles.fieldContainer, { backgroundColor: primaryBackgroundColor }]}
      >
        <Text style={{ color: textColor, fontSize: 16 }}>
        {expenseDetails.department || 'Velg avdeling'}
        </Text>
      </TouchableOpacity>
    </Layout>
  );
};




if (expenseSuccess) {
    return (
      <ExpenseConfirmationScreen
        expenseDetails={expenseDetails} />
    );
  }

//Validate input fields, and show error message if input is invalid. If not run handleSubmit
const handleSubmitPress = () => {
  /*if (expenseDetails.attachments.length === 0) {
    alert('Please add at least one attachment.');
    return;
  }
  if (expenseDetails.department === '') {
    alert('Please select a department.');
    return;
  }
  if (expenseDetails.totalAmount === 0) {
    alert('Please add an amount.');
    return;
  }
  if (expenseDetails.attachments.some((attachment) => attachment.amount === '')) {
    alert('Please add an amount to all attachments.');
    return;
  }
  */
  handleSubmit();
};

if (loading) {
  return (
    <Loading />
  );
}


return (
  <View style={{ flex: 1 }}>
  <KeyboardAwareScrollView
  style={[styles.container, { backgroundColor: theme['color-basic-800'] }]}
  resetScrollToCoords={{ x: 0, y: 20 }}
  scrollEnabled={true}
  extraScrollHeight={10} // Optional: Add extra height if necessary
>
<ScrollView ref={scrollViewRef}>
        <Text style={[styles.header, { color: textColor }]}>Contact details</Text>
        <TouchableOpacity style={[styles.fieldContainer, { backgroundColor: primaryBackgroundColor }]} onPress={handleContactDetailsPress}>
          <Text style={[styles.fieldText, { color: textColor }]}>Contact details fetched from profile.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fieldContainer, { backgroundColor: primaryBackgroundColor }]} onPress={handleContactDetailsPress}>
          <Text style={[styles.fieldText, { color: textColor }]}>Payout details fetched from profile.</Text>
        </TouchableOpacity>
        <DepartmentSelector />
        <Divider style={{ marginVertical: 5, backgroundColor: textColor }} />
        <View style={[styles.row, { 
          //This is a row view, where I want a checkbox next to the text.
          paddingRight: 30,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }]}>
          <Text style={styles.fieldText}>
            Are you requesting on behalf of an event or project?
          </Text>
          <CheckBox
            checked={checked}
            style={{ margin: 2 }}
            onChange={nextChecked => setChecked(nextChecked)}>
              {checked ? <Text style={{ color: textColor }}>Yes</Text> : <Text style={{ color: textColor }}>No</Text>}
            </CheckBox>
        </View>
        {checked ? <Input 
          style={[styles.fieldContainer, { backgroundColor: primaryBackgroundColor }]}
          placeholder='Name of event'
          value={eventName}
          onChangeText={nextValue => setEventName(nextValue)}
        /> : null}
        <Divider style={{ marginVertical: 5, backgroundColor: textColor }} />
      <Layout style={{ marginBottom: 16, flex: 1, backgroundColor: 'transparent' }}>
        <Layout style={styles.row}>
          <Text style={[styles.header, { color: textColor }]}>Attachments</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
          <PlusCircle size={25} color={theme['color-basic-100']} />
          </TouchableOpacity>
        </Layout>
          <ScrollView>
          <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
  {expenseDetails.attachments.map((attachment, index) => (
    <Accordion
      title={`Attachment ${index + 1}`}
      key={index}
      item={attachment}
      index={index}
      deleteable
      expandable
      onDelete={() => {
        console.log('delete')
        const newAttachments = expenseDetails.attachments;
        newAttachments.splice(index, 1);
        setExpenseDetails({
          ...expenseDetails,
          attachments: newAttachments,
        });
      }}
    >
      <Layout style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor: 'transparent' }}>
        <Input
        onFocus={() => handleInputFocus(attachment.description)}
          style={{ marginBottom: 8 }}
          label="Description"
          value={attachment.description}
          onChangeText={(text) => {
            const newAttachments = expenseDetails.attachments;
            newAttachments[index].description = text;
            setExpenseDetails({
              ...expenseDetails,
              attachments: newAttachments,
            });
          }}
        />
        <TouchableOpacity
          onPress={() => {
            setDatePickerVisible(true);
          }}
          style={[styles.fieldContainer, { backgroundColor: primaryBackgroundColor, width: '100%' }]}
        >
          <Text style={[styles.fieldText, { color: textColor }]}>{attachment.date || 'Velg dato'}</Text>
        </TouchableOpacity>
        {datePickerVisible && (
        <DateTimePicker
          value={attachment.date ? new Date(attachment.date) : new Date()}
          mode={'date'}
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              const newAttachments = expenseDetails.attachments;
              newAttachments[index].date = format(selectedDate, 'yyyy-MM-dd');
              setExpenseDetails({
                ...expenseDetails,
                attachments: newAttachments,
              });
            }
            setDatePickerVisible(false);
          }}
        />
      )}
        <Input
        onFocus={() => handleInputFocus(attachment.amount)}
          style={{ marginBottom: 8 }}
          keyboardType='numeric'
          label="Amount"
          value={attachment.amount}
          onChangeText={(text) => {
            const newAttachments = expenseDetails.attachments;
            newAttachments[index].amount = text;
            setExpenseDetails({
              ...expenseDetails,
              attachments: newAttachments,
            });
          }}
        />
      </Layout>
    </Accordion>
  ))}
</Layout>
          </ScrollView>
      </Layout>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
      <Button
      accessoryLeft={loading ? () => <Spinner status='basic' /> : undefined}
       onPress={handleSubmitPress}
       style={{ 
        width: '65%', 
        height: 45 }}>
          Submit expense
      </Button>
      </View>
    <Modal
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      title="Add attachment"
      options={['Camera', 'Files']}
      onFirstOption={() => {
          setCameraModalVisible(true);
          setModalVisible(false);
        }
      }
      onSecondOption={() => {
        pickDocuments();
        setModalVisible(false);
        setCameraModalVisible(false);
      }
      }
    />
          <CameraScreen
      isVisible={cameraModalVisible}
      onClose={() => setCameraModalVisible(false)}
      onPictureTaken={async (image) => {
        await handleOcr(image);
        setCameraModalVisible(false);
        setModalVisible(false);
      }}
    />
      </ScrollView>
  </KeyboardAwareScrollView>
  </View>
);
}

const styles = StyleService.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fieldContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 5,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  fieldText: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  input: {
    marginBottom: 16,
  },
  modalText: {
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default CreateExpenseScreen;
