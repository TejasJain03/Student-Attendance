import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddTeacher from "./pages/AddTeacher";
import ClassDetails from "./pages/ClassDetails";
import TakeAttendance from "./pages/TakeAttendance";
import AttendanceReport from "./pages/AttendanceReport";
import { AuthProvider } from "./components/authProvider"; // Named import for AuthProvider

const App = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />
            }
          />
          {/* Login Page Route */}
          <Route path="/login" element={<LoginPage />} />
          {/* Protected Admin Dashboard Route */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="/admin/add-teacher"
            element={<ProtectedRoute element={<AddTeacher />} />}
          />
          <Route
            path="/class-details/:classNumber"
            element={<ProtectedRoute element={<ClassDetails />} />}
          />
          <Route
            path="/class-attendance/:classNumber"
            element={<ProtectedRoute element={<TakeAttendance />} />}
          />
          <Route
            path="/class-attendance-report/:classNumber"
            element={<ProtectedRoute element={<AttendanceReport />} />}
          />
        </Routes>

        {/* Toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </AuthProvider>
  );
};

export default App;
