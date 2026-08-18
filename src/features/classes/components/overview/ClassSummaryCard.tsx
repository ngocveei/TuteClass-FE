import {
  AppstoreOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  CreditCardOutlined,
  StarOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import type {
  TeacherOverviewKpi,
  TeacherOverviewTone,
} from "@/features/classes/types/classOverview.types";

interface ClassSummaryCardProps {
  item: TeacherOverviewKpi;
  onClick?: () => void;
}

export function OverviewToneIcon({
  tone,
  icon,
}: {
  tone: TeacherOverviewTone;
  icon?: ReactNode;
}) {
  const icons: Record<TeacherOverviewTone, ReactNode> = {
    green: <StarOutlined />,
    amber: <CreditCardOutlined />,
    rose: <CheckSquareOutlined />,
    blue: <CalendarOutlined />,
    violet: <AppstoreOutlined />,
  };

  return (
    <span className={`teacher-overview-icon teacher-overview-icon--${tone}`}>
      {icon ?? icons[tone]}
    </span>
  );
}

export function ClassSummaryCard({ item, onClick }: ClassSummaryCardProps) {
  const isInvitation = item.label === "Mã mời vào lớp";

  return (
    <button
      className={`teacher-overview-kpi${isInvitation ? " teacher-overview-kpi--invite" : ""}`}
      type="button"
      onClick={onClick}
    >
      <div className="teacher-overview-kpi-top">
        <OverviewToneIcon tone={item.tone} />
        <span
          className={`teacher-overview-badge teacher-overview-badge--${item.tone}`}
        >
          {item.badge}
        </span>
      </div>
      <span>{item.label}</span>
      <strong>{item.value}</strong>
    </button>
  );
}
