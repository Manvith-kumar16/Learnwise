import { TeacherDashboard } from "@/components/TeacherDashboard";

const Teacher = () => {
  const classData = {
    name: "Mathematics Grade 10A",
    totalStudents: 28,
    activeStudents: 24,
    avgProgress: 73
  };

  return <TeacherDashboard classData={classData} />;
};

export default Teacher;