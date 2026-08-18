import {
  MoreOutlined,
  SwapOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import type { TeacherStudentRow } from "@/features/classes/types/classStudent.types";
import { formatClassJoinedDate } from "@/features/classes/utils/class.utils";

export function MetricUnavailable() {
  return (
    <span className="teacher-student-list__unavailable">Chưa có dữ liệu</span>
  );
}

export function StudentIdentity({ student }: { student: TeacherStudentRow }) {
  return (
    <div className="teacher-student-list__identity">
      {student.avatarUrl ? (
        <img src={student.avatarUrl} alt="" />
      ) : (
        <span aria-hidden="true">{student.initials}</span>
      )}
      <div>
        <strong>{student.fullName}</strong>
        <small>{student.email}</small>
      </div>
    </div>
  );
}

interface StudentActionsProps {
  student: TeacherStudentRow;
  onOpenChangeClass: (student: TeacherStudentRow) => void;
  onOpenRemoveStudent: (student: TeacherStudentRow) => void;
}

export function StudentRowActions({
  student,
  onOpenChangeClass,
  onOpenRemoveStudent,
}: StudentActionsProps) {
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "change-class",
            icon: <SwapOutlined />,
            label: "Đổi lớp",
            onClick: (info) => {
              info.domEvent.stopPropagation();
              info.domEvent.preventDefault();
              onOpenChangeClass(student);
            },
          },
          {
            key: "remove-student",
            icon: <UserDeleteOutlined />,
            label: "Xóa khỏi lớp",
            danger: true,
            onClick: (info) => {
              info.domEvent.stopPropagation();
              info.domEvent.preventDefault();
              onOpenRemoveStudent(student);
            },
          },
        ],
      }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Button
        type="text"
        className="teacher-student-list__row-action"
        aria-label={`Thao tác với ${student.fullName}`}
        icon={<MoreOutlined />}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      />
    </Dropdown>
  );
}

interface StudentCardProps extends StudentActionsProps {
  onOpen: (studentId: string) => void;
}

export function StudentCard({
  student,
  onOpen,
  onOpenChangeClass,
  onOpenRemoveStudent,
}: StudentCardProps) {
  return (
    <div className="teacher-student-list__grid-card-wrap">
      <button
        type="button"
        className="teacher-student-list__grid-card"
        aria-label={`Xem chi tiết ${student.fullName}`}
        onClick={() => onOpen(student.studentId)}
      >
        <StudentIdentity student={student} />
        <div className="teacher-student-list__grid-meta">
          <span
            className={`teacher-student-list__status teacher-student-list__status--${student.enrollmentStatus.toLowerCase()}`}
          >
            {student.enrollmentLabel}
          </span>
          <span>Tham gia {formatClassJoinedDate(student.joinedAt)}</span>
        </div>
        <div className="teacher-student-list__grid-metrics">
          <span>
            Chuyên cần <MetricUnavailable />
          </span>
          <span>
            Điểm TB <MetricUnavailable />
          </span>
        </div>
      </button>
      <div className="teacher-student-list__grid-card-action">
        <StudentRowActions
          student={student}
          onOpenChangeClass={onOpenChangeClass}
          onOpenRemoveStudent={onOpenRemoveStudent}
        />
      </div>
    </div>
  );
}
