import { StudentDashboard } from "@/components/StudentDashboard";

const Dashboard = () => {
  const studentData = {
    name: "Alex Johnson",
    totalQuestions: 342,
    streak: 7,
    level: "Advanced"
  };

  return <StudentDashboard student={studentData} />;
};

export default Dashboard;