import { StudentDashboard } from "@/components/StudentDashboard";
import { Navigation } from "@/components/Navigation";

const Dashboard = () => {
  const studentData = {
    name: "Alex Johnson",
    totalQuestions: 342,
    streak: 7,
    level: "Advanced"
  };

  const userData = {
    name: "Alex Johnson", 
    role: "student" as const,
    notifications: 3
  };

  return (
    <>
      <Navigation user={userData} />
      <StudentDashboard student={studentData} />
    </>
  );
};

export default Dashboard;