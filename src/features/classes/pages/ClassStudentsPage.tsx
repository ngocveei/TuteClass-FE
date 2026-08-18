import { TeacherStudentListScreen } from "@/features/classes/components/students/TeacherStudentListScreen";
import { useClassStudents } from "@/features/classes/hooks/useClassStudents";

export default function ClassStudentsPage() {
  return <TeacherStudentListScreen flow={useClassStudents()} />;
}
