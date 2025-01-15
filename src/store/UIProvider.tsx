import React, { ReactNode, useContext } from "react";

// create the context
export const Context = React.createContext<any>(undefined);

type WithChildren = {
  children?: ReactNode
}
// create the context provider, we are using use state to ensure that
// we get reactive values from the context...

export const UIProvider: React.FC<WithChildren> = ({ children }) => {

  // the reactive values
  const [showTabs, setShowTabs] = React.useState(true);


  // the store object
  let state = {
    showTabs,
    setShowTabs,
  };

  // wrap the application in the provider with the initialized context
  return <Context.Provider value={state}>{children}</Context.Provider>;

}

export const useUI = () => {
  return useContext(Context)
}

