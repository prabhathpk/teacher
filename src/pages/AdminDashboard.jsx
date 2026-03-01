import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { UserContext, validRoles } from "../UserContext";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const { users, updateUser, addUser, deleteUserById } = useContext(UserContext);
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState(validRoles[0] || "");
  const [error, setError] = useState("");


  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPwd, setEditPwd] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editError, setEditError] = useState("");

  const handleAddUser = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Username is required");
      return;
    }

    if (!pwd.trim()) {
      setError("Password is required");
      return;
    }

    try {
      addUser({ username: name, password: pwd, role });
      setName("");
      setPwd("");
      setRole(validRoles[0] || "");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditName(user.username);
    setEditPwd(user.password);
    setEditRole(user.role);
    setEditError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPwd("");
    setEditRole("");
    setEditError("");
  };

  const handleUpdateUser = () => {
    setEditError("");

    if (!editName.trim()) {
      setEditError("Username is required");
      return;
    }

    if (!editPwd.trim()) {
      setEditError("Password is required");
      return;
    }

    try {
      updateUser({
        id: editingId,
        username: editName,
        password: editPwd,
        role: editRole,
      });
      cancelEdit();
    } catch (err) {
      setEditError(err.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard - User Management</h1>
        <div className="header-actions">
          <span className="user-info">Welcome, {currentUser?.username}!</span>
          <button onClick={handleLogout} className="btn btn-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="admin-container">
        <section className="section add-user-section">
          <h2>Add New User</h2>
          <form onSubmit={handleAddUser} className="form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="e.g., john_doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                {validRoles.map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Add User
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        </section>


        <section className="section users-section">
          <h2>Manage Users</h2>
          {users.length === 0 ? (
            <p>No users available.</p>
          ) : (
            <div className="table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className={editingId === user.id ? "editing" : ""}>
                      <td>
                        {editingId === user.id ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="edit-input"
                          />
                        ) : (
                          user.username
                        )}
                      </td>
                      <td>
                        {editingId === user.id ? (
                          <input
                            type="password"
                            value={editPwd}
                            onChange={(e) => setEditPwd(e.target.value)}
                            className="edit-input"
                          />
                        ) : (
                          "••••••••"
                        )}
                      </td>
                      <td>
                        {editingId === user.id ? (
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="edit-input"
                          >
                            {validRoles.map((r) => (
                              <option key={r} value={r}>
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="role-badge">{user.role}</span>
                        )}
                      </td>
                      <td className="actions-cell">
                        {editingId === user.id ? (
                          <>
                            <button
                              onClick={handleUpdateUser}
                              className="btn btn-success btn-small"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="btn btn-secondary btn-small"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(user)}
                              className="btn btn-info btn-small"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteUserById(user.id)}
                              className="btn btn-danger btn-small"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {editError && <p className="error">{editError}</p>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}