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
        const bankAccount = await getSecureStore('bankAccount') ?? undefined;
        const address = await getSecureStore('address') ?? undefined;
        const city = await getSecureStore('city') ?? undefined;
        const zip = await getSecureStore('zip') ?? undefined;        

        setProfile({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          bankAccount,
          address,
          city,
          zip,
          subunits: userData.subunits,
        });
      }
    };

    fetchUserProfile();
  }, [user]);

  const updateUserProfile = async (updatedFields: Partial<UserProfile>) => {
    if (!user) return;

    const secureFields = {
      bankAccount: updatedFields.bankAccount,
      address: updatedFields.address,
      city: updatedFields.city,
      zip: updatedFields.zip,
    };

    for (const [key, value] of Object.entries(secureFields)) {
      if (value !== undefined) {
        await saveToSecureStore(key, value);
      }
    }

    const firebaseFields = { ...updatedFields };
    delete firebaseFields.bankAccount;
    delete firebaseFields.address;
    delete firebaseFields.city;
    delete firebaseFields.zip;

    try {
      await updateDoc(doc(db, 'users', user.uid), firebaseFields);
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
