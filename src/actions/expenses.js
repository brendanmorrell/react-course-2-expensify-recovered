// PRIOR TO ADDING FIREBASE (NON-ASYN VERSION)
// component calls action generator
// action generator returns an object
// component dispatches object
// redux store changes

// ASYNCHRONOUS VERSION (AFTER FIREBASE INTEGRATION)
// component calls action generator
// action generator returns FUNCTION (not an object)
// component dispatches FUNCTION (not object)
// funciton runs (has the ability to dispatch other actions and do whatever it wants)
// (by defual, redux does not allow you to dispatch functions. need to set up a piece of redux middleware, 'redux-thunk', and grab 'applyMiddleware' from redux on the file you use to configure your store')


import database from '../firebase/firebase';


// ADD_EXPENSE
export const addExpense = (expense) => ({
  type: 'ADD_EXPENSE',
  expense,
});

export const startAddExpense = (expenseData = {}) => {
  return (dispatch, getState) => { // this is the function we will be sending now that we have redux-thunk as opposed to just sending the object we originally sent
    const { uid } = getState().auth;
    const {
      description = '',
      note = '',
      amount = 0,
      createdAt = 0,
    } = expenseData;
    const expense = { description, note, amount, createdAt };

    return database.ref(`users/${uid}/expenses`).push(expense).then((ref) => { // the return is for promise chaining in the test file
      dispatch(addExpense({
        id: ref.key,
        ...expense,
      }));
    });
  };
};

// REMOVE_EXPENSE
export const removeExpense = id => ({
  type: 'REMOVE_EXPENSE',
  id,
});


export const startRemoveExpense = id => {
  return (dispatch, getState) => {
    const { uid } = getState().auth;
    return database.ref(`users/${uid}/expenses/${id}`).remove().then(() => {
      dispatch(removeExpense(id));
    });
  };
};

// EDIT_EXPENSE
export const editExpense = (id, updates) => ({
  type: 'EDIT_EXPENSE',
  id,
  updates,
});

export const startEditExpense = (id, updates) => {
  return (dispatch, getState) => {
    const { uid } = getState().auth;
    return database.ref(`users/${uid}/expenses/${id}`)
      .update(updates)
      .then(() => {
        return dispatch(editExpense(id, updates));
      });
  };
};

// SET_EXPENSES
export const setExpenses = (expenses) => ({
  type: 'SET_EXPENSES',
  expenses,
});

// START_SET_EXPENSES
export const startSetExpenses = () => {
  return (dispatch, getState) => {
    const { uid } = getState().auth;
    return database.ref(`users/${uid}/expenses`).once('value').then((snapshot) => {
      const expenses = [];

      snapshot.forEach((childSnapshot) => {
        expenses.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      dispatch(setExpenses(expenses));
    });
  };
};
