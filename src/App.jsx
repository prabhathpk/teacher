import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";
import { SlotProvider } from "./SlotContext";
import PrivateRoute from "./PrivateRoute";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

function App() {
  return (
    <UserProvider>
      <AuthProvider>
        <SlotProvider>
          <BrowserRouter>
          <Routes>
          <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/manager"
            element={
              <PrivateRoute allowedRoles={["manager"]}>
                <ManagerDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/teacher"
            element={
              <PrivateRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </PrivateRoute>
            }
          />

          <Route path="/unauthorized" element={<h2>Unauthorized</h2>} />
        </Routes>
      </BrowserRouter>
        </SlotProvider>
    </AuthProvider>
  </UserProvider>
  );
}

export default App;