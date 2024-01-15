import React from 'react';
import { Dimensions, TouchableOpacity, View} from 'react-native';
import Accordion from '../../components/Accordion';
import IonIcons from '@expo/vector-icons/Ionicons';
import Tag from '../../components/Tag';
import Selector, { DataItem } from '../../components/Selector';
import { useAuthentication } from '../../hooks/useAuthentication';
import { useUserProfile, getDepartments } from '../../hooks';
import { Subunit, UserProfile } from '../../types';
import LanguageSwitcher from '../../components/LanguangeSwitcher';
import i18n from '../../constants/localization';
import { Layout, Text, Button, Input, useTheme, StyleService, Select, SelectItem, IndexPath, Divider, Modal } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ThemeSwitch } from '../../components/ThemeSwitch';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useLanguage } from '../../contexts/LanguageContext';
import { useMembership } from '../../contexts/MembershipContext';
import * as SecureStore from 'expo-secure-store';


const screenWidth = Dimensions.get('window').width;

export default function Profile() {

const theme = useTheme();

const { language } = useLanguage();

i18n.locale = language;

const icon = <IonIcons name="information-circle-outline" size={24} color={theme['text-basic-color']} />;
const primaryBackgroundColor = theme['color-primary-100'];
    
    const { user, deleteAccount, loading } = useAuthentication();
    const { profile, updateUserProfile } = useUserProfile();
    const { membershipIsValid, membershipExpiry, studentId, isLoading } = useMembership();

    const [newProfile, setNewProfile] = React.useState<UserProfile | null>(null);
    const [selectedDepartment, setSelectedDepartment] = React.useState<string[]>([]);
    const [selectedCampus, setSelectedCampus] = React.useState<string>('');
    const [selectedTags, setSelectedTags] = React.useState<Subunit[]>([]);
    const [selectedIndice, setSelectedIndice] = React.useState<IndexPath>();
    const [selectedDepartments, setSelectedDepartments] = React.useState<string[]>([]);
    const [departments, setDepartments] = React.useState([
        { campus: "", id: '0', name: "", organisation: "" },
    ]);
    const [selectorVisible, setSelectorVisible] = React.useState(false);
    const [filteredDepartments, setFilteredDepartments] = React.useState(departments);
    const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = React.useState(false);
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const router = useRouter();

    const campusNames = ['Bergen', 'Oslo', 'Stavanger', 'Trondheim', 'National'];


    React.useEffect(() => {
        if (profile) {
            setNewProfile(profile);
            setSelectedTags(profile?.subunits || []);
            console.log(profile?.subunits)
        }
    }, [profile]);

    if (isLoading) {
      return <Text>Loading...</Text>;
    }

    React.useEffect(() => {
      const fetchDepartments = async () => {
        const url = "https://api.web.biso.no/app/departments";
        const departments = await getDepartments(url);
        // Ensure each department has a campus property
        const departmentsWithCampus = departments.map((department) => ({
          ...department,
          campus: department.campus || '',
          organisation: department.organisation || '',
        }));
        setDepartments(departmentsWithCampus);
      }
      fetchDepartments();
    }
    , []);
      
    const getCampusFromAsyncStorage = async () => {
      try {
        const campus = await AsyncStorage.getItem('campus');
        if (campus) {
          const campusArray = JSON.parse(campus);
          setSelectedCampus(campusArray);
        }
      } catch (error) {
        // Handle AsyncStorage error here
        console.error('Error retrieving campus from AsyncStorage:', error);
      }
    };

    React.useEffect(() => {
      getCampusFromAsyncStorage();
    }, []);
    

    //AsyncStorage contains an array of campuses. Filter departments into a new array containing only departments with a campus that is in the AsyncStorage array.
    //save to filteredDepartments
    const filterDepartments = async () => {
      const campus = await AsyncStorage.getItem('campus');
      if (campus) {
        const campusArray = JSON.parse(campus);
        const filtered = departments.filter((department) => campusArray.includes(department.campus));
        setFilteredDepartments(filtered);
      }
    };

    const filterDepartmentsByCampus = (selectedCampus: string[]) => {
      const filtered = departments.filter((department) =>
        selectedCampus.includes(department.campus)
      );
      setFilteredDepartments(filtered);
    };
    

    React.useEffect(() => {
      filterDepartments();
    }, [departments]);

    React.useEffect(() => {
      if (!loading && !user) {
        router.push('/');
      }
   }, [user, loading]);

    React.useEffect(() => {
      const getCampusFromAsyncStorage = async () => {
        const campus = await AsyncStorage.getItem('campus');
        if (campus) {
          const campusArray = JSON.parse(campus);
          setSelectedCampus(campusArray);
        }
      }
      getCampusFromAsyncStorage();
    }
    , []);
    
    const deletemembershipDataFromSecureStore = async () => {
      try {
        await SecureStore.deleteItemAsync('membershipData');
      } catch (error) {
        console.error('Error deleting membership data from AsyncStorage:', error);
      }
    };


    const hasStudentId = () => {
      if (studentId) {
        console.log("Student ID is " + studentId);
        return true;
      }
      console.log("Student ID is not set: " + studentId);
      return false;
    };

    const addressDetails = (
        <Layout style={{ backgroundColor: 'transparent' }}>
            <Input label={i18n.t('address')} style={styles.input} onChangeText={(value) => setNewProfile({ ...newProfile, address: value })} value={newProfile?.address} />
            <Input label={i18n.t('zip_code')} style={styles.input} onChangeText={(value) => setNewProfile({ ...newProfile, zip: value })} value={newProfile?.zip} />
            <Input label={i18n.t('city')} style={styles.input} onChangeText={(value) => setNewProfile({ ...newProfile, city: value })} value={newProfile?.city} />
        </Layout>
    );

    const contactDetails = (
        <Layout style={{ backgroundColor: 'transparent' }}>
            <Input label={i18n.t('phone_number')} style={styles.input} onChangeText={(value) => setNewProfile({ ...newProfile, phone: value })} value={newProfile?.phone} />
            <Input label={i18n.t('email_address')} style={styles.input} onChangeText={(value) => setNewProfile({ ...newProfile, email: value })} value={newProfile?.email} />
        </Layout>
    );


    //Display a SwitchSelector to choose between norwegian and international bank account. If norwegian, display bank account number input field, if international display a IBAN and BIC field.
    const paymentDetails = (
        <Layout style={{ backgroundColor: 'transparent' }}>
            <Input label={i18n.t('bank_accountno')} style={styles.input} onChangeText={(value) => setNewProfile({ ...newProfile, bankAccount: value })} value={newProfile?.bankAccount} />
            <Input label="BIC (If international bank)" style={styles.input} onChangeText={(value) => setNewProfile({ ...newProfile, bic: value })} value={newProfile?.bic} />
        </Layout>
    );

    const bisoLoginContent = (
        <Layout style={{ backgroundColor: 'transparent' }}>
            <Text>Login lenke til å knytte profil mot BISO-konto. Dette vil tilgjengeliggjøre visse funksjoner som er i bruk for frivillige, blant annet Elections</Text>
        </Layout>
    ); 

    const studentIdContent = (
      <Layout style={{ backgroundColor: 'transparent' }}>
          <Input 
          caption={i18n.t('student_id_cannot_be_changed') + ' ' + i18n.t('contact_campus_management_to_have_it_resolved')}
           label={i18n.t('student_id')} style={styles.input} onChangeText={(value) => setNewProfile({ ...newProfile, studentId: value })} value={newProfile?.studentId} disabled={hasStudentId()} />
      </Layout>
  );
  




  const handleSelectedIndicesChange = async (indice: IndexPath | IndexPath[]) => {
    let selectedIndice: IndexPath;
    
    if (Array.isArray(indice)) {
      selectedIndice = indice[0]; // handle only the first index
    } else {
      selectedIndice = indice;
    }
  
    setSelectedIndice(selectedIndice);
    const selectedCampus = campusNames[selectedIndice.row];
    setSelectedCampus(selectedCampus);
    filterDepartmentsByCampus([selectedCampus]);
  
    // Save selected campus to AsyncStorage
    try {
      const campusSet = await AsyncStorage.setItem('campus', JSON.stringify(selectedCampus));
      console.log("Campus set to " + selectedCampus);
    } catch (error) {
      console.error('Error saving campus to AsyncStorage:', error);
    }
  }
    



    const departmentDetails = (
      <Layout>
        <Select
          placeholder="Select campus"
          selectedIndex={selectedIndice}
          onSelect={(indice) => handleSelectedIndicesChange(indice)}
          value={selectedCampus}
        >
          {campusNames.map((name) => (
            <SelectItem title={name} key={name} />
          ))}
        </Select>
    
        {selectedTags.map((tag) => (
          <Tag
            color="blue"
            content={tag.name}
            onRemove={() => {
              const newTags = selectedTags.filter((t) => t !== tag);
              setSelectedTags(newTags);
            }}
            key={tag.id}
          />
        ))}
    
<Selector
  visible={selectorVisible}
  allData={filteredDepartments}
  enableSearch
  multiSelect
  onSelect={(item: DataItem | DataItem[]) => {
    if (Array.isArray(item)) {
      const newTags = item.map((i) => ({
        id: i.id,
        name: i.name,
        campus: i.campus,
        organisation: i.organisation,
      }));
      setSelectedTags(newTags);
    } else {
      const newSubunit: Subunit = {
        id: item.id,
        name: item.name,
        campus: item.campus,
        organisation: item.organisation,
      };
      setSelectedTags([...selectedTags, newSubunit]);
    }
  }}          
  onClose={() => setSelectorVisible(false)}
/>

    
        <Divider style={{ marginVertical: 10 }} />
    
        <TouchableOpacity
          style={styles.addTagButton}
          onPress={() => setSelectorVisible(true)}
        >
          <Text style={styles.addTagButtonText}>Add units</Text>
        </TouchableOpacity>
      </Layout>
    );
    

    const renderDeleteModal = () => {
      return (
        <Layout style={{ backgroundColor: 'transparent' }}>
          <Text style={styles.modalText}>
            {i18n.t('delete_account_verification')}
          </Text>
          <Button
      style={styles.deleteButton}
      status="danger"
      appearance='outline'
      onPress={() => {
        console.log("Opening delete confirmation dialog");
        setShowDeleteConfirmationDialog(true);
      }}
    >
      {i18n.t('delete_account')}
    </Button>
        <Modal
        visible={showDeleteConfirmationDialog}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setShowDeleteConfirmationDialog(false)}
      >
        <Layout style={styles.modalContainer}>
          <Text style={styles.modalText}>
            {i18n.t('delete_account_verification')}
          </Text>
          <Input
            placeholder={i18n.t('confirm_password')}
            value={confirmPassword}
            onChangeText={(value) => setConfirmPassword(value)}
            secureTextEntry
          />
          <Button
            style={styles.deleteButton}
            status="danger"
            appearance='outline'
            onPress={() => {
              setShowDeleteConfirmationDialog(false);
              deleteAccount(confirmPassword);
            }}
          >
            {i18n.t('delete_account')}
          </Button>
        </Layout>
      </Modal>
        </Layout>
      );
    };
    // Inside your `settings` section of the `Profile` component
const settings = (
  <Layout style={{ backgroundColor: 'transparent' }}>
    <ThemeSwitch />
    <Divider style={{ marginVertical: 15 }} />
    <Accordion
      title={i18n.t('delete_account')}
      content={renderDeleteModal()}
      expandable
    />

  </Layout>
);
    

  return (
    <Layout style={styles.container}>
          <KeyboardAwareScrollView
    resetScrollToCoords={{ x: 0, y: 20 }}
    scrollEnabled={true}
    extraScrollHeight={10} // Optional: Add extra height if necessary
  >
     {/*} <ProfileImage />*/}
        <Accordion
        title={i18n.t('address_details')}
        icon={icon}
        content={addressDetails}
        expandable
        />
        <Accordion
        title={i18n.t('contact_details')}
        icon={icon}
        content={contactDetails}
        expandable
        />
        <Accordion
        title="Student ID"
        icon={icon}
        content={studentIdContent}
        expandable
        />
        <Accordion
        title={i18n.t('payment_details')}
        icon={icon}
        content={paymentDetails}
        expandable
        />
      <Accordion
        title={i18n.t('favorite_units')}
        icon={icon}
        content={departmentDetails}
        expandable
      />
      <Accordion
        title={i18n.t('settings')}
        icon={icon}
        content={settings}
        expandable
      />
    <Button
  onPress={() => {
    if (newProfile) {
      const updatedProfile = { ...newProfile, subunits: selectedTags, campus: selectedCampus };
      updateUserProfile(updatedProfile);
    }
  }}>{i18n.t('save')}</Button>
  <Divider style={{ marginVertical: 10 }} />
  <View style={{ width: '100%' }}>
    <LanguageSwitcher />
  </View>
    </KeyboardAwareScrollView>
    </Layout>

  );
};

const styles = StyleService.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: screenWidth,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: screenWidth,
    },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    },
    addTagButton: {
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 5,
    },
    addTagButtonText: {
        fontSize: 16,
    },
    deleteButton: {
      marginVertical: 10,
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '90%',
      padding: 20,
      borderRadius: 10,
    },
    modalText: {
      marginBottom: 10,
    },
    modalButton: {
      marginVertical: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
});
