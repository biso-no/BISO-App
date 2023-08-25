import { query, collectionGroup, where, getDocs, startAfter, limit, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import { Expense } from "../types";

const getExpenses = async (uid: string, queryLimit: number, lastDocument?: any): Promise<Expense[]> => {
  const passedLimit = queryLimit ? queryLimit : 10;

  //If no lastDocument is passed, it is undefined and the query will return the first 5 documents.
    const lastDoc = lastDocument ? lastDocument : '';

  let q = query(
    collectionGroup(db, 'expenses'),
    where('uid', '==', uid),
    orderBy('date', 'desc'), // Replace 'timestamp' with your actual timestamp field name
    limit(passedLimit),
    startAfter(lastDoc)
  );
  
  if (lastDocument) {
    q = query(q, startAfter(lastDocument));
  }

  const querySnapshot = await getDocs(q);
  const expenses: Expense[] = [];
  querySnapshot.forEach((doc) => {
    expenses.push(doc.data() as Expense);
  });
  return expenses;
};

const getExpense = async (uid: string, expenseId: string): Promise<Expense> => {
  const q = query(
    collectionGroup(db, 'expenses'),
    where('uid', '==', uid),
    where('id', '==', expenseId)
  );

  const querySnapshot = await getDocs(q);
  const expenses: Expense[] = [];
  querySnapshot.forEach((doc) => {
    expenses.push(doc.data() as Expense);
  });
  return expenses[0];
};


export { getExpenses, getExpense };
