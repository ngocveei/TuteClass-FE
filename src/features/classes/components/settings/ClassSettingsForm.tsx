import { ClassDangerZone } from "@/features/classes/components/settings/ClassDangerZone";
import { ClassGeneralSettings } from "@/features/classes/components/settings/ClassGeneralSettings";
import type { ClassSettingsFlowController } from "@/features/classes/types/classSettings.types";

interface ClassSettingsFormProps {
  flow: ClassSettingsFlowController;
  subjectName: string;
}

export function ClassSettingsForm({
  flow,
  subjectName,
}: ClassSettingsFormProps) {
  return (
    <form onSubmit={flow.handleSubmit}>
      <ClassGeneralSettings flow={flow} subjectName={subjectName} />
      <ClassDangerZone flow={flow} />
    </form>
  );
}
