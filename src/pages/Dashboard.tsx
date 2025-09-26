import { StudentDashboard } from "@/components/StudentDashboard";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <>
      <Navigation user={user ? { name: user.name, role: user.role, notifications: 0 } : undefined} />
      <StudentDashboard />
    </>
  );
};

export default Dashboard;
