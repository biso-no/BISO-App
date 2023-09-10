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

const fetchExpense = async (uid: string, id: string) => {
  try {
    const expenseRef = doc(db, `users/${uid}/expenses/${id}`);
    const expenseDoc = await getDoc(expenseRef);
    if (expenseDoc.exists()) {
      const expenseData = expenseDoc.data() as Expense;
      return expenseData;
    } else {
      // Handle case when expense is not found
      console.log("Expense not found");
    }
  } catch (error) {
    // Handle any errors that occurred during fetching
    console.error("Error fetching expense:", error);
  }
};


export { getExpenses, fetchExpense };