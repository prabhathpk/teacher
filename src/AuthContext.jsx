import { createContext, useState, useContext } from "react";
import { UserContext, validRoles } from "./UserContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { users } = useContext(UserContext); 
  const [currentUser, setCurrentUser] = useState(null);

  const login = (username, password) => {
    if (!users) return false;
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser) {
      // only allow users with valid roles
      if (!validRoles.includes(foundUser.role)) return false;
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider
      value={{ currentUser, user: currentUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};