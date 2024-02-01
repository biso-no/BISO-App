import { db } from '../config/firebase';
import { ElectionProps } from '../types';
import { query, collection, collectionGroup, where, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

//Get the following doc and return its value from the "disabled" field.
//Doc: /featureToggle/vippsbutton, field "disabled"
export const isMembershipPurchaseActive = async () => {
    const docRef = doc(db, 'featureToggle', 'vippsbutton');
    const docSnapshot = await getDoc(docRef);
    return docSnapshot.exists() ? docSnapshot.data().disabled : true;
}