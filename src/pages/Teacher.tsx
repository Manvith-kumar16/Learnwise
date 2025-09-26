import { TeacherDashboard } from "@/components/TeacherDashboard";
import { ensureDefaultClass, getClassOverview } from "@/lib/store";

const Teacher = () => {
  ensureDefaultClass();
  const overview = getClassOverview();
  const classData = {
    name: "Placement preparation",
    totalStudents: overview.totalStudents,
    activeStudents: overview.activeStudents,
    avgProgress: overview.avgProgress,
  };

  return <TeacherDashboard classData={classData} />;
};

export default Teacher;
