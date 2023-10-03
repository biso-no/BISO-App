import { db } from "../config/firebase";
import { collection, doc, getDoc } from "firebase/firestore";


export const checkForAppUpdates = async (currentVersion: string) => {
    const docRef = doc(db, "appVersions", "appVersion");
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();
    if (docData && docData.versionName !== currentVersion) {
        return false;
    } else {
        return true;
    }
};