import { db } from "../config/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";

export const getNotice = async () => {
  const q = query(collection(db, "notice"), where("isActive", "==", true));
  const querySnapshot = await getDocs(q);
  const notice = querySnapshot.docs.map((doc) => doc.data());
  return notice;
};