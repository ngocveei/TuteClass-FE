import { CloseOutlined, FilterOutlined } from "@ant-design/icons";
import { ClassList } from "@/features/classes/components/class-list/ClassList";
import type {
  TeacherClassFilterController,
  TeacherOwnedClass,
} from "@/features/classes/types/class.types";
import "./teacherClassSelector.css";
import "./teacherClassFilter.css";
import "./teacherClassStatus.css";

interface TeacherClassSelectorProps {
  heading: string;
  selectedClass: TeacherOwnedClass;
  classes: TeacherOwnedClass[];
  filter?: TeacherClassFilterController;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (classId: string) => void;
}

const filterLabels = {
  All: "Tất cả lớp",
  Active: "Đang hoạt động",
  Completed: "Đã hoàn thành",
} as const;

export function TeacherClassSelector({
  heading,
  selectedClass,
  classes,
  filter,
  isOpen,
  onOpen,
  onClose,
  onSelect,
}: TeacherClassSelectorProps) {
  const displayedClasses = filter?.classes ?? classes;

  return (
    <>
      <button
        className="teacher-overview-title-switch"
        type="button"
        onClick={onOpen}
        aria-expanded={isOpen}
        aria-controls="teacher-class-drawer"
      >
        <h1>
          {heading} <strong>{selectedClass.className}</strong>
        </h1>
        <span className="teacher-overview-title-chevron" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <button
          type="button"
          className="teacher-overview-drawer-overlay"
          aria-label="Đóng danh sách lớp"
          onClick={onClose}
        />
      )}
      <aside
        id="teacher-class-drawer"
        className={`teacher-overview-drawer ${isOpen ? "is-open" : ""}`}
        aria-hidden={!isOpen}
      >
        <header>
          <h2>Lớp của tôi</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng danh sách lớp"
          >
            <CloseOutlined />
          </button>
        </header>
        {filter && (
          <button
            type="button"
            className="teacher-overview-class-filter"
            onClick={filter.cycleStatus}
            aria-label={`Lọc lớp: ${filterLabels[filter.status]}`}
          >
            <FilterOutlined /> {filterLabels[filter.status]}
          </button>
        )}
        <ClassList
          classes={displayedClasses}
          selectedClassId={selectedClass.classId}
          status={filter?.status}
          isLoading={filter?.isLoading}
          error={filter?.error}
          onRetry={filter?.retry}
          onSelect={onSelect}
        />
      </aside>
    </>
  );
}
