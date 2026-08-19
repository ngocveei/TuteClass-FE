import { SettingOutlined } from "@ant-design/icons";
import {
  MetricUnavailable,
  StudentIdentity,
  StudentRowActions,
} from "@/features/classes/components/students/StudentCard";
import type { TeacherStudentRow } from "@/features/classes/types/classStudent.types";
import { formatClassJoinedDate } from "@/features/classes/utils/class.utils";

interface StudentTableProps {
  students: TeacherStudentRow[];
  onOpen: (studentId: string) => void;
  onOpenChangeClass: (student: TeacherStudentRow) => void;
  onOpenRemoveStudent: (student: TeacherStudentRow) => void;
}

export function StudentTable({
  students,
  onOpen,
  onOpenChangeClass,
  onOpenRemoveStudent,
}: StudentTableProps) {
  const openOnKeyboard = (
    event: React.KeyboardEvent<HTMLTableRowElement>,
    studentId: string,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onOpen(studentId);
  };

  return (
    <div className="teacher-student-list__table-wrap">
      <table>
        <thead>
          <tr>
            <th>Học viên</th>
            <th>Trạng thái</th>
            <th>Ngày tham gia</th>
            <th>Chuyên cần</th>
            <th>Điểm TB</th>
            <th>Bài tập</th>
            <th>Học phí</th>
            <th>Insight</th>
            <th
              className="teacher-student-list__actions-column"
              aria-label="Thao tác"
            >
              <SettingOutlined aria-hidden="true" />
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr
              key={student.studentId}
              tabIndex={0}
              role="button"
              aria-label={`Xem chi tiết ${student.fullName}`}
              onClick={() => onOpen(student.studentId)}
              onKeyDown={(event) => openOnKeyboard(event, student.studentId)}
            >
              <td>
                <StudentIdentity student={student} />
              </td>
              <td>
                <span
                  className={`teacher-student-list__status teacher-student-list__status--${student.enrollmentStatus.toLowerCase()}`}
                >
                  {student.enrollmentLabel}
                </span>
              </td>
              <td>{formatClassJoinedDate(student.joinedAt)}</td>
              <td>
                <MetricUnavailable />
              </td>
              <td>
                <MetricUnavailable />
              </td>
              <td>
                <MetricUnavailable />
              </td>
              <td>
                <MetricUnavailable />
              </td>
              <td>
                <MetricUnavailable />
              </td>
              <td className="teacher-student-list__actions-column">
                <StudentRowActions
                  student={student}
                  onOpenChangeClass={onOpenChangeClass}
                  onOpenRemoveStudent={onOpenRemoveStudent}
                />
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={9}>
                <div className="teacher-student-list__empty">
                  Không có học viên phù hợp với bộ lọc hiện tại.
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
