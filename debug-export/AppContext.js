import React, { createContext, useContext } from 'react';

export const AppContext = createContext({
  userProfile: {},
  updateUserProfile: () => {},
  preferences: {},
  updatePreferences: () => {},
  logOut: async () => {},
});

export const useAppContext = () => useContext(AppContext);
