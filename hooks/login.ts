import React from 'react';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, sendPasswordResetEmail  } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const login = async (email: string, password: string) => {
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
};


const register = async (email: string, password: string, profile?: any) => {
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
        postcode: profile?.postcode,
        newFeatures: true
    });
    return user;
};

const logOut = async () => {
    return signOut(auth);
};

const sendPasswordResetEmailToUser = async (email: string) => {
    return sendPasswordResetEmail(auth, email);
};

export { login, register, logOut, sendPasswordResetEmailToUser };