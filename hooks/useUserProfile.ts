import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'; // Import setDoc
import { db } from '../config/firebase';
import { useAuthentication } from './useAuthentication';
import { UserProfile } from '../types';
import { saveToSecureStore, getSecureStore } from './secureStore';

export function useUserProfile() {
  const { user } = useAuthentication();
  const [profile, setProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile({})
      setLoading(false)
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();

        if (userData) {
          if (userData.studentId) {
            const studentId = await getSecureStore('studentId');
            if (!studentId || studentId !== userData.studentId) {
              await saveToSecureStore('studentId', userData.studentId);
            }
          }

          setProfile({
            firstName: userData.firstName,
            lastName: userData.lastName,
            studentId: userData.studentId || null,
            email: userData.email,
            phone: userData.phone,
            bankAccount: userData.bankAccount,
            address: userData.address,
            city: userData.city,
            zip: userData.zip,
            campus: userData.campus,
            subunits: userData.subunits,
          });
        }
      } catch (error) {
        console.error('Error fetching user profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [user]);

  const updateUserProfile = async (updatedFields: Partial<UserProfile>) => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);

    try {
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If the document does not exist, create a new document
        await setDoc(userDocRef, updatedFields);
        console.log('User profile created successfully!');
      } else {
        // If the document exists, update the existing document
        await updateDoc(userDocRef, updatedFields);
        console.log('User profile updated successfully!');
      }
      
      setProfile((prevProfile) => ({ ...prevProfile, ...updatedFields }));
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return { profile, loading, updateUserProfile };
}
