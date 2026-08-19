import { TeamOutlined } from "@ant-design/icons";
import type { TeacherOwnedClass } from "@/features/classes/types/class.types";

const statusLabels = {
  Active: "Đang hoạt động",
  Completed: "Đã hoàn thành",
} as const;

interface ClassCardProps {
  item: TeacherOwnedClass;
  selected: boolean;
  onSelect: (classId: string) => void;
}

export function ClassCard({ item, selected, onSelect }: ClassCardProps) {
  const classes = [
    "teacher-overview-class-card",
    `teacher-overview-class-card--${item.tone}`,
    item.imageUrl ? "teacher-overview-class-card--with-image" : "",
    selected ? "is-selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      onClick={() => onSelect(item.classId)}
      className={classes}
    >
      <span className="teacher-overview-card-pin" />
      <div className="teacher-overview-class-card__details">
        <strong>{item.className}</strong>
        <small>
          <TeamOutlined /> {item.studentCount} học sinh
        </small>
      </div>
      <span
        className={`teacher-overview-class-card__status teacher-overview-class-card__status--${item.status.toLowerCase()}`}
      >
        {statusLabels[item.status]}
      </span>
      {item.imageUrl && (
        <img
          className="teacher-overview-class-card__image"
          src={item.imageUrl}
          alt=""
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}
    </button>
  );
}
