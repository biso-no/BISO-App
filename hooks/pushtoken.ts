import { db } from '../config/firebase';
import { query, getDocs, collection, collectionGroup, where, doc, getDoc, updateDoc } from 'firebase/firestore';

export function getUserPushToken(userId: string) {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = getDoc(userRef).then((doc) => {
            if (doc.exists()) {
                return doc.data().pushToken;
            } else {
                return null;
            }
        }).catch((error) => {
            console.log(error);
        }
        );
        return userDoc;
    }
    catch (error) {
        console.log(error);
    }
}

export async function setUserPushToken(userId: string, pushToken: string) {
    try {
        //Check if user's document exists
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            await updateDoc(userRef, {
                pushToken: pushToken
            });
        }
        else {
            console.log("User does not exist");
        }
    }
    catch (error) {
        console.log(error);
    }
}
