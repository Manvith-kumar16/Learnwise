import { StudentDashboard } from "@/components/StudentDashboard";
import { Navigation } from "@/components/Navigation";

const Dashboard = () => {
  const studentData = {
    name: "Shriraksha P Acharya",
    totalQuestions: 0,
    streak: 0,
    level: "Advanced"
  };

  const userData = {
    name: "Shriraksha P Acharya", 
    role: "student" as const,
    notifications: 0
  };

  return (
    <>
      <Navigation user={userData} />
      <StudentDashboard student={studentData} />
    </>
  );
};

export default Dashboard;