import { useState, useMemo } from "react";

const useAuth = (userData: tokenType) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useMemo(() => {
    if (userData && userData.user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [userData]);

  return {
    isAuthenticated: isAuthenticated,
    user: userData && userData.user ? userData.user : null,
  };
};

export default useAuth;
