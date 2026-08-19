import { useParams } from "react-router-dom";
import { ClassSettingsScreen } from "@/features/classes/components/settings/ClassSettingsScreen";
import { useClassSettings } from "@/features/classes/hooks/useClassSettings";

export default function ClassSettingsPage() {
  const { classId } = useParams<{ classId: string }>();
  return <ClassSettingsScreen flow={useClassSettings(classId)} />;
}
