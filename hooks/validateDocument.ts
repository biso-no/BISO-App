import { db } from "../config/firebase";
import { getDoc, doc, collection } from "firebase/firestore";

//This is a helper function to check if a specific document exists in a collection. If it does not exist, it will return null
export const validateDocument = async (docPath: string, docName: string) => {
    const docRef = doc(db, docPath, docName);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        return null;
    }
    return docSnap.data();
};

