import React, { createContext, useContext, useState } from 'react';

const TokenContext = createContext();

export const TokenProvider = ({ c }) => {
  const [authToken, setAuthToken] = useState(null);

  return (
    <TokenContext.Provider value={{ authToken, setAuthToken }}>
      {c}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  return useContext(TokenContext);
};
