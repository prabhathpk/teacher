import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const validRoles = ["admin", "manager", "teacher"];

const API_URL = "https://cac527a5057585eabfd9.free.beeceptor.com";

const initialUsers = [
  { id: "1", username: "admin", password: "123", role: "admin" },
  { id: "2", username: "manager", password: "123", role: "manager" },
  { id: "3", username: "teacher", password: "123", role: "teacher" },
];

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      const data = await response.json();
      // Only update if we have valid data, otherwise keep initialUsers
      if (data && Array.isArray(data) && data.length > 0) {
        setUsers(data);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.message);
      // Keep initialUsers as fallback on error
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (user) => {
    if (!validRoles.includes(user.role)) {
      throw new Error(`Cannot add user with invalid role "${user.role}"`);
    }
    try {
      const id = Date.now().toString();
      const newUser = { id, ...user };
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      setUsers((prevUsers) => [...prevUsers, newUser]);
    } catch (err) {
      console.error("Failed to add user:", err);
      throw err;
    }
  };

  const deleteUserById = async (id) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      setUsers(users.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      throw err;
    }
  };

  const updateUser = async (user) => {
    if (user.role && !validRoles.includes(user.role)) {
      throw new Error(`Cannot update user to invalid role "${user.role}"`);
    }
    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      setUsers((s) => s.map((t) => (t.id === user.id ? { ...t, ...user } : t)));
    } catch (err) {
      console.error("Failed to update user:", err);
      throw err;
    }
  };
 
  return (
    <UserContext.Provider value={{ users, updateUser, addUser, deleteUserById, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};