import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Enquetes from "./pages/Enquetes";
import { AuthProvider, useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }: any) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/enquetes" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/enquetes"
            element={
              <ProtectedRoute>
                <Enquetes />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/enquetes" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
