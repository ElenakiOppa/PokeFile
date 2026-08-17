import React, { createContext, useContext } from 'react';

export const AppContext = createContext({
  userProfile: {},
  updateUserProfile: () => {},
  preferences: {},
  updatePreferences: () => {},
});

export const useAppContext = () => useContext(AppContext);

