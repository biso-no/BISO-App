import { query, collectionGroup, where, getDocs, startAfter, limit, orderBy, getDoc, collection, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Expense } from "../types";

const getExpenses = async (uid: string, queryLimit: number = 10, lastDocument: any = null): Promise<{ expenses: Expense[], lastDocument: any }> => {
  try {
      let q = query(
          collection(db, 'users', uid, 'expenses'),
          orderBy('date', 'desc'),
          limit(queryLimit)
      );

      if (lastDocument) {
          q = query(
              collection(db, 'users', uid, 'expenses'),
              orderBy('date', 'desc'),
              startAfter(lastDocument),
              limit(queryLimit)
          );
      }

      const querySnapshot = await getDocs(q);
      const expenses: Expense[] = [];
      querySnapshot.forEach((doc) => {
          expenses.push({ ...doc.data(), id: doc.id } as Expense);
      });

      // Set the last document if there are expenses
     let lastFetchedDoc = null;
        if (expenses.length > 0) {
            lastFetchedDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        }

        return { expenses, lastDocument: lastFetchedDoc };
    } catch (error) {
        console.log('Error in getExpenses:', error);
        return { expenses: [], lastDocument: null };
    }
};





const getExpense = async (uid: string, expenseId: string): Promise<Expense> => {
  const docRef = doc(db, 'users', uid, 'expenses', expenseId);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as Expense;
};

export { getExpenses, getExpense };