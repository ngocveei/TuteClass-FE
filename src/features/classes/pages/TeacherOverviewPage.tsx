import { TeacherOverviewScreen } from "@/features/classes/components/overview/TeacherOverviewScreen";
import { useTeacherOverview } from "@/features/classes/hooks/useTeacherOverview";

export default function TeacherOverviewPage() {
  const flow = useTeacherOverview();
  return <TeacherOverviewScreen flow={flow} />;
}
