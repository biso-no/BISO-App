import React, { useEffect, useState } from 'react';
import { TouchableOpacity, FlatList, KeyboardAvoidingView, ScrollView, Platform, Switch, View } from 'react-native';
import { useThemeColor, Text } from '../components/Themed';
import { useRouter } from 'expo-router';
import { getDepartments, useAuthentication } from '../hooks';
import { Expense, Attachment, Subunit } from '../types';
import Accordion from '../components/Accordion';
import IonIcons from '@expo/vector-icons/Ionicons';
import generatePurpose from '../hooks/getPurpose';
import { Camera, CameraType } from 'expo-camera';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Modal from '../components/Modal';
import CameraScreen from '../components/CameraModal';
import MlkitOcr from 'react-native-mlkit-ocr';
import axios from 'axios';
import Selector from '../components/Selector';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '../config/firebase';
import { Layout, StyleService, useTheme, Button, Input, CheckBox } from '@ui-kitten/components';
import { takePhoto } from '../hooks/firebase/imageCapture';

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
  const [showDepartments, setShowDepartments] = useState(false);
  const [descriptionStringified, setDescriptionStringified] = useState<string>('');
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [purposeEnabled, setPurposeEnabled] = useState(false);
  const [allDepartments, setAllDepartments] = useState<Subunit[]>([]);
  const [showPurposeModal, setShowPurposeModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [eventName, setEventName] = useState('');


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

  const handlePayoutDetailsPress = () => {
    router.push('profile');
  };

  const backgroundColor = theme['color-basic-1000'];
  const primaryBackgroundColor = theme['color-basic-1100'];
  const textColor = theme['color-basic-100'];

// Initialize profile values or empty data.
useEffect(() => {
  if (profile) {
    setExpenseDetails({
      ...expenseDetails,
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      address: profile.address || '',
      city: profile.city || '',
      zip: profile.zip || '',
      bankAccountNumber: profile.bankAccount || '',
      campus: profile.campus || '',
      department: Array.isArray(profile.subunits) && profile.subunits.length > 0
      ? profile.subunits[0].name || ''
      : '',
      attachments: [] as Attachment[],
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


const createExpense = async (expense: Expense) => {
  try {
  const expenseRef = collection(db, `users/${user?.uid}/expenses`);
  await addDoc(expenseRef, expense);
  } catch (error) {
    console.log(error);
  }
  const attachments = expenseDetails.attachments.map((attachment) => ({
    attachmentDescription: attachment.description,
    dateOfAttachment: attachment.date,
    amount: attachment.amount,
    image: attachment.file,
  }));
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
    total: expenseDetails.totalAmount.toString(),
    outstanding: expenseDetails.outstanding.toString(),
  };

  try {
    // Submit expense to Power Automate endpoint
    await axios.post('https://prod-137.westeurope.logic.azure.com:443/workflows/57b3e0b3246d4fa68c8c88a04c7f8c0c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=G3ENciWITukSRZfV39m-vFsvOI8_MFWGXJytIwSYQCI', powerAutomateData);
  } catch (error) {
    console.log(error);
  }
  router.push('expenses');
};


const DepartmentSelector = () => {
  const [showDepartments, setShowDepartments] = useState(false);
  
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
      <Layout>
        <TouchableOpacity
          onPress={() => setShowDepartments(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}
        >
          <Text style={{ color: textColor, fontSize: 16 }}>
            {expenseDetails.department}
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
    <Layout>
      <TouchableOpacity
        onPress={() => setShowDepartments(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: textColor, fontSize: 16 }}>
          {expenseDetails.department}
        </Text>
        <IonIcons name="chevron-down" size={20} color={textColor} />
      </TouchableOpacity>
    </Layout>
  );
};

  //Calculate attachment amounts to number, and calculate total amount
  useEffect(() => {
    let totalAmount = 0;
    if (expenseDetails.attachments) {
      expenseDetails.attachments.forEach((attachment) => {
        if (attachment.amount) {
          totalAmount += Number(attachment.amount);
        }
      });
    }
    setExpenseDetails({
      ...expenseDetails,
      totalAmount,
    });
  }, [expenseDetails.attachments]);

  //Get description from all attachments, and convert to a single string.
  const stringifyAttachmentDescriptions = (attachments: Attachment[]) => {
    let purpose = '';
    attachments.forEach((attachment) => {
      if (attachment.description) {
        purpose += attachment.description + ', ';
      }
    });
    setDescriptionStringified(purpose);
  };

  useEffect(() => {
    stringifyAttachmentDescriptions(expenseDetails.attachments);
  }, [expenseDetails.attachments]);
  
  const handleOcr = async (image: string) => {
    const result = await MlkitOcr.detectFromUri(image);
    const text = result.map((block) => block.text).join('\n');
  
    try {
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
        };
      });
  
      setExpenseDetails(prevDetails => ({
        ...prevDetails,
        attachments: [...prevDetails.attachments, ...newAttachments],
      }));
  
      setCameraModalVisible(false);
    } catch (error) {
      // handle the error as you wish, e.g., console.error(error) or set an error message in the state
      console.error(error);
    }
  };
  
  
  
  const handleSubmit = async () => {
    const attachmentsArray = expenseDetails.attachments;

    const savePath = `images/${user?.uid}_${Date.now()}`;
    const docPath = `users/${user?.uid}/expenses/`;

    // Upload images to the database and get the URLs
    const uploadedAttachments = await Promise.all(
      attachmentsArray.map(async (attachment) => {
        if (attachment.file) {
          const docName = "attachments";
          const filename = `${user?.uid}_${Date.now()}`;
          
          const takePhotoResult = await takePhoto(savePath, docPath, docName);
          
          if (!takePhotoResult.success || !takePhotoResult.downloadURL) {
            console.log('Failed to capture or upload image:', takePhotoResult.error);
            return attachment;
          }

          return {
            description: attachment.description,
            date: attachment.date,
            amount: attachment.amount,
            file: takePhotoResult.downloadURL
          };
        } else {
          return attachment;
        }
      })
    );

    const purpose = await generatePurpose(uploadedAttachments, eventName);
  
    // Update the expense details once with all changes
    setExpenseDetails(prevDetails => ({
      ...prevDetails,
      attachments: uploadedAttachments,
      purpose: purpose,
    }));
  
    // Wait for the state update to finish, then create the expense
    await createExpense(expenseDetails);
};






return (
  <KeyboardAvoidingView
  style={[styles.container, { backgroundColor: theme['color-basic-1000'] }]}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
>
    <ScrollView>
        <Text style={[styles.header, { color: textColor }]}>Contact details</Text>
        <TouchableOpacity style={[styles.fieldContainer, { backgroundColor: primaryBackgroundColor }]} onPress={handleContactDetailsPress}>
          <Text style={[styles.fieldText, { color: textColor }]}>Contact details fetched from profile.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fieldContainer, { backgroundColor: primaryBackgroundColor }]} onPress={handlePayoutDetailsPress}>
          <Text style={[styles.fieldText, { color: textColor }]}>Payout details fetched from profile.</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <Text style={styles.fieldText}>
            My expense belongs to
          </Text>
          <CheckBox
            checked={checked}
            onChange={nextChecked => setChecked(nextChecked)}>
              {checked ? 'an event' : 'general'}
            </CheckBox>
        </View>
        {checked ? <Input 
          style={[styles.fieldContainer, { backgroundColor: primaryBackgroundColor }]}
          placeholder='Event name'
          value={eventName}
          onChangeText={nextValue => setEventName(nextValue)}
        /> : null}
        <DepartmentSelector />
        <Text> Creating a profile is required for submitting expenses.</Text>
      <Layout style={{ marginBottom: 16, flex: 1, backgroundColor: 'transparent' }}>
        <Layout style={styles.row}>
          <Text style={[styles.header, { color: textColor }]}>Attachments</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
          <IonIcons
            name="add-circle"
            size={24}
            color={textColor}
          />
          </TouchableOpacity>
        </Layout>
          <ScrollView>
          <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  {expenseDetails.attachments.map((attachment, index) => (
    <Accordion
      title={`Attachment ${index + 1}`}
      key={index}
      item={attachment}
      index={index}
      deleteable
      expandable
      onDelete={() => {
        const newAttachments = expenseDetails.attachments.filter((_, i) => i !== index);
        setExpenseDetails({
          ...expenseDetails,
          attachments: newAttachments,
        });
      }}
    >
      <Layout style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <Input
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
        <Input
          style={{ marginBottom: 8 }}
          label="Date"
          value={attachment.date}
          onChangeText={(text) => {
            const newAttachments = expenseDetails.attachments;
            newAttachments[index].date = text;
            setExpenseDetails({
              ...expenseDetails,
              attachments: newAttachments,
            });
          }}
        />
        <Input
          style={{ marginBottom: 8 }}
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
      <Button onPress={handleSubmit}>Submit</Button>
    </ScrollView>
    <Modal
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      title="Add attachment"
      options={['Camera', 'Files']}
      onConfirm={() => setCameraModalVisible(true)}
      onCancel={() => setModalVisible(false)}
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
  </KeyboardAvoidingView>
);
};



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
    justifyContent: 'space-between',
    alignItems: 'center',
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
