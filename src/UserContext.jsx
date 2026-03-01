import { createContext, useState } from "react";

export const UserContext = createContext();

export const validRoles = ["admin", "manager", "teacher"];

const usersList = [
  { id: "1", username: "admin", password: "123", role: "admin" },
  { id: "2", username: "manager", password: "123", role: "manager" },
  { id: "3", username: "teacher", password: "123", role: "teacher" },
];

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(usersList);

  const addUser = (user) => {
    if (!validRoles.includes(user.role)) {
      throw new Error(`Cannot add user with invalid role "${user.role}"`);
    }
    const id = Date.now().toString();
    setUsers((prevUsers) => [...prevUsers, { id, ...user }]);
  };
  const deleteUserById = (id) => {
    setUsers(users.filter((i) => i.id !== id));
  };
  const updateUser = (user) => {
    if (user.role && !validRoles.includes(user.role)) {
      throw new Error(`Cannot update user to invalid role "${user.role}"`);
    }
    setUsers((s) => s.map((t) => (t.id === user.id ? { ...t, ...user } : t)));
  };
 
  return (
    <UserContext.Provider value={{ users, updateUser, addUser, deleteUserById }}>
      {children}
    </UserContext.Provider>
  );
};