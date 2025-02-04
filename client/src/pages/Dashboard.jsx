import { useEffect } from "react";
import { useAuth } from "../components/authProvider"; // Assuming you have an authProvider
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = useAuth(); // Destructure loading from useAuth
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login"); 
    }
  }, [user, loading, navigate]); // Add loading to dependencies

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching user data
  }

  if (!user) {
    return null; // Prevent rendering the dashboard if there's no user
  }

  return (
    <div>
      {user.role === "admin" && <AdminDashboard />}
      {user.role === "teacher" && <TeacherDashboard />}
    </div>
  );
};

export default Dashboard;
