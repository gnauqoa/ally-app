import { ROUTE_PATHS } from "@/lib/constant";
import { IonButton } from "@ionic/react";
import { Plus } from "lucide-react";

const AddChatButton = () => {
  return (
    <IonButton routerLink={ROUTE_PATHS.NEW_CHAT}>
      <Plus color="var(--color-primary)" />
    </IonButton>
  );
};

export default AddChatButton;
