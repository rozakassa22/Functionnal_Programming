import { produce } from 'immer';

// Initial dataStore
const initialState = {
  cart: [],
  user: null,
};

// To keep track of the history for undo and redo actions
let pastStates = [];
let futureStates = [];

// EventReducer to handle state updates
const EventReducer = (dataStore, event) => {
  return produce(dataStore, draft => {
    switch (event.type) {
      case 'ADD_ITEM_TO_CART':
        draft.cart.push(event.payload.item);
        break;
      case 'USER_LOGIN':
        draft.user = event.payload.user;
        break;
      default:
        break;
    }
  });
};

// Dispatch function to forward events to the reducer and log actions
const dispatchEvent = (event) => {
  logActions(event);

  pastStates.push(currentState); // Save current state for undo
  if (pastStates.length > 10) {
    pastStates.shift(); // Limit the history size to 10
  }
  futureStates = []; // Clear future states as new action invalidates them

  currentState = EventReducer(currentState, event);
};

// Curried logActions function
const logActions = (event) => {
  console.log('Event Dispatched:', event);
};

// Undo action function
const undoAction = () => {
  if (pastStates.length > 0) {
    futureStates.push(currentState); // Save current state for redo
    currentState = pastStates.pop(); // Restore last state
  } else {
    console.log('No actions to undo');
  }
};

// Redo action function
const redoAction = () => {
  if (futureStates.length > 0) {
    pastStates.push(currentState); // Save current state for undo
    currentState = futureStates.pop(); // Restore next state
  } else {
    console.log('No actions to redo');
  }
};

// Initialize the dataStore
let currentState = initialState;

// Example events
const addItemEvent = {
  type: 'ADD_ITEM_TO_CART',
  payload: {
    item: { id: 1, name: 'Apple', quantity: 3 }
  }
};

const userLoginEvent = {
  type: 'USER_LOGIN',
  payload: {
    user: { id: 1, name: 'John Doe' }
  }
};

// Dispatch example events
dispatchEvent(addItemEvent);
dispatchEvent(userLoginEvent);

// Undo and redo actions
undoAction();
redoAction();
