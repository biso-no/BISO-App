import React from 'react';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, sendPasswordResetEmail  } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserProfile } from '../types';

const login = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
            const userProfile = await getDoc(doc(db, 'users', userCredential.user.uid));

            if (userProfile.exists()) {
                if (!userProfile.data().newFeatures) {
                    await updateDoc(doc(db, 'users', userCredential.user.uid), {
                        newFeatures: true
                    });
                }
            }
        });
        return "Success"
    } catch (error) {
        return (error as any).code; // return error code if there is an error
    }
};


const register = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Assuming createUserWithEmailAndPassword() resolves successfully if user is created
        return "Success"; // Return "Success" string instead of user object
    } catch (error) {
        // Return error message if there is an error
        return (error as Error).message;
    }
};



const logOut = async () => {
    return signOut(auth);
};

const sendPasswordResetEmailToUser = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return 'Password reset email sent successfully'; // return success message
    }
    catch (error) {
        return (error as Error).message; // return error message if there is an error
    }
}

export { login, register, logOut, sendPasswordResetEmailToUser };