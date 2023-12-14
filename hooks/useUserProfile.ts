import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuthentication } from './useAuthentication';
import { UserProfile } from '../types';
import { saveToSecureStore, getSecureStore } from './secureStore';

export function useUserProfile() {
  const { user } = useAuthentication();
  const [profile, setProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (!user) {
      setProfile({})
      setLoading(false)
      return;
    }

  
    const fetchUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        console.log('userData', userData);

        if (userData) {
          // If userData contains a studentId, handle secure store logic
          if (userData.studentId) {
            const studentId = await getSecureStore('studentId');
            if (!studentId || studentId !== userData.studentId) {
              await saveToSecureStore('studentId', userData.studentId);
            }
          }

          // Set user profile from userData
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
          subunits: userData.subunits,
        });
      }
      }
      catch (error) {
        console.error('Error fetching user profile', error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchUserProfile();
  }
  , [user]);

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
    loading,
  };
}