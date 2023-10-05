import React from 'react';
import { onAuthStateChanged, User, deleteUser as deleteFirebaseUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { getDoc, doc, collection, where, addDoc, deleteDoc, query, getDocs } from 'firebase/firestore';
import { UserProfile, Expense } from '../types';

// Basic useAuth provided by firebase.
export function useAuthentication() {
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);


  const fetchProfile = async (uid: string) => {
    const profileRef = doc(db, 'users', uid);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      setProfile(profileSnap.data() as UserProfile);
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  };

  const deleteAccount = async (password: string) => {
    if (!user) return; // No user is authenticated
  
    try {
      // Prompt the user for reauthentication (e.g., password)
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
  
      // Delete user account
      await deleteFirebaseUser(user);
  
      // Delete user data from Firestore
      const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(userQuery);
      
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
  
      // Sign out the user
      setUser(null);
    } catch (error) {
      // Handle errors (e.g., reauthentication failed or user deletion failed)
      console.error('Error deleting user account:', error);
    }
  };
  

  React.useEffect(() => {
    const unsubscribeFromAuthStateChanged = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchProfile(authUser.uid);
      } else {
        setUser(null);
      }
      setLoading(false);  // <-- Set loading to false here
    });
 
    return unsubscribeFromAuthStateChanged;
 }, []);
 

  return {
    user,
    profile,
    deleteAccount,
    loading
  };
}
