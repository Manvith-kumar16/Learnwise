import { TeacherDashboard } from "@/components/TeacherDashboard";

const Teacher = () => {
  const classData = {
    name: "Placement preparation",
    totalStudents: 15,
    activeStudents: 15,
    avgProgress: 0
  };

  return <TeacherDashboard classData={classData} />;
};

export default Teacher;