import { CreateClassScreen } from "@/features/classes/components/create/CreateClassScreen";
import { useCreateClassFlow } from "@/features/classes/hooks/useCreateClassFlow";

export default function CreateClassPage() {
  return <CreateClassScreen flow={useCreateClassFlow()} />;
}
