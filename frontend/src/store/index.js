'use client';
import { createContext, useReducer, useContext } from 'react';
import { initialState, reducer } from './reducers';

// Create context
const StateContext = createContext();

let globalState = null;
let globalDispatch = null;

// Create the provider component
export function StateProvider({ children }) {
  // const [state, dispatch] = useReducer(reducer, initialState);
  const [state, dispatch] = useReducer((state, action) => {
    const newState = reducer(state, action);

    // Notify all subscribers about the state update
    globalState = newState;
    // subscribers.forEach((callback) => callback(newState));

    return newState;
  }, initialState);

 globalState = state;
 globalDispatch = dispatch;

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
}

// Custom hook for consuming the context
export const useStateContext = () => useContext(StateContext);
export const getStateAndDispatch = () => ({ getState:  () => globalState, dispatch: globalDispatch });
