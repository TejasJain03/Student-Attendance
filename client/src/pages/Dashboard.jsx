import { useAuth } from "../components/authProvider"; // Assuming you have an authProvider
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div>
      {user.role === "admin" && <AdminDashboard />}
      {user.role === "teacher" && <TeacherDashboard />}
    </div>
  );
};

export default Dashboard;
