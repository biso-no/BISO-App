import { db } from '../config/firebase';
import { ElectionProps } from '../types';
import { query, getDocs, collection, collectionGroup, where, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

export function setPushKey(uid: string, pushKey: string) {
    const userRef = doc(db, 'users', uid);
    updateDoc(userRef, {
        pushKey: pushKey
    });
}