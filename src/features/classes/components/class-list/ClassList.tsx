import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ClassCard } from "@/features/classes/components/class-list/ClassCard";
import type {
  ClassStatusFilter,
  TeacherOwnedClass,
} from "@/features/classes/types/class.types";

const emptyMessages: Record<ClassStatusFilter, string> = {
  All: "Bạn chưa có lớp nào.",
  Active: "Không có lớp nào đang hoạt động.",
  Completed: "Chưa có lớp nào đã hoàn thành.",
};

interface ClassListProps {
  classes: TeacherOwnedClass[];
  selectedClassId: string;
  status?: ClassStatusFilter;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onSelect: (classId: string) => void;
}

export function ClassList({
  classes,
  selectedClassId,
  status = "All",
  isLoading = false,
  error,
  onRetry,
  onSelect,
}: ClassListProps) {
  let content: React.ReactNode;
  if (isLoading) {
    content = (
      <div className="teacher-overview-class-filter-state">
        <LoadingOutlined /> Đang tải lớp...
      </div>
    );
  } else if (error) {
    content = (
      <div className="teacher-overview-class-filter-state">
        <span>Không thể tải danh sách lớp.</span>
        {onRetry && (
          <button type="button" onClick={onRetry}>
            Thử lại
          </button>
        )}
      </div>
    );
  } else if (classes.length === 0) {
    content = (
      <div className="teacher-overview-class-filter-state">
        {emptyMessages[status]}
      </div>
    );
  } else {
    content = classes.map((item) => (
      <ClassCard
        key={item.classId}
        item={item}
        selected={item.classId === selectedClassId}
        onSelect={onSelect}
      />
    ));
  }

  return (
    <div className="teacher-overview-class-list">
      {content}
      <Link to="/classes/new" className="teacher-overview-add-class">
        <PlusOutlined /> Thêm lớp
      </Link>
    </div>
  );
}
