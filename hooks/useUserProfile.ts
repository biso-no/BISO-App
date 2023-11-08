import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuthentication } from './useAuthentication';
import { UserProfile } from '../types';
import { saveToSecureStore, getSecureStore } from './secureStore';

export function useUserProfile() {
  const { user } = useAuthentication();
  const [profile, setProfile] = useState<UserProfile>({});

  useEffect(() => {
    if (!user) return;
  
    const fetchUserProfile = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      if (userData) {
        setProfile({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          bankAccount: userData.bankAccount,
          address: userData.address,
          city: userData.city,
          zip: userData.zip,
          subunits: userData.subunits,
        });
      }
    };
  
    fetchUserProfile();
  }, [user]);

  const updateUserProfile = async (updatedFields: Partial<UserProfile>) => {
    if (!user) return;
  
    try {
      await updateDoc(doc(db, 'users', user.uid), updatedFields);
      setProfile((prevProfile) => ({ ...prevProfile, ...updatedFields }));
      console.log('User profile updated successfully!');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return {
    profile,
    updateUserProfile,
  };
}
