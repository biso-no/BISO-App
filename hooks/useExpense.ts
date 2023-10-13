import { useState } from 'react';
import { Expense } from '../types';

const useExpense = (initialExpense: Expense) => {
  const [expenseDetails, setExpenseDetails] = useState(initialExpense);

  const updateExpense = (updatedFields: Partial<Expense> | ((prevDetails: Expense) => Expense)) => {
    setExpenseDetails((prevDetails) => {
      if (typeof updatedFields === 'function') {
        return updatedFields(prevDetails);
      } else {
        return {
          ...prevDetails,
          ...updatedFields,
        };
      }
    });
  };

  const resetExpense = () => {
    setExpenseDetails(initialExpense);
  };

  return {
    expenseDetails,
    updateExpense,
    resetExpense,
  };
};

export default useExpense;