import React from 'react';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, sendPasswordResetEmail  } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

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


const register = async (email: string, password: string, profile?: any) => {
    try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const uid = user.uid;
    await setDoc(doc(db, 'users', user.uid), {
        uid,
        email,
        firstname: profile?.firstname,
        lastname: profile?.lastname,
        phoneNumber: profile?.phone,
        bankAccountNumber: profile?.bankAccount,
        address: profile?.address,
        city: profile?.city,
        studentId: profile?.studentId,
        postcode: profile?.postcode,
        newFeatures: true
    });
    return user;
    }
    catch (error) {
        return (error as Error).message; // return error message if there is an error
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