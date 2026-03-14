import { createContext, useState, useContext } from "react";
import { UserContext, validRoles } from "./UserContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { users ,fetchUsers} = useContext(UserContext); 
  const [currentUser, setCurrentUser] = useState(null);

  const login = (username, password) => {
    fetchUsers();
    if (!users) return null;
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser) {
      if (!validRoles.includes(foundUser.role)) return null;
      setCurrentUser(foundUser);
      return foundUser.role;
    }
    return null;
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