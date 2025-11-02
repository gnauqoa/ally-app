import { IonContent, IonHeader } from "@ionic/react";
import { IonPage } from "@ionic/react";
import { IonToolbar } from "@ionic/react";
import { IonButtons } from "@ionic/react";
import { IonMenuButton } from "@ionic/react";
import clsx from "clsx";
import TabTitle from "./tab-title";

const PageContainer = ({
  children,
  className,
  headerTitle,
}: {
  children: React.ReactNode;
  className?: string;
  headerTitle?: string | React.ReactNode;
}) => {
  if (!headerTitle)
    return (
      <div
        className={clsx(
          "flex flex-col h-full overflow-y-auto pb-[100px] px-4",
          className
        )}
      >
        {children}
      </div>
    );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          {typeof headerTitle === "string" ? (
            <TabTitle title={headerTitle} />
          ) : (
            headerTitle
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div
          className={clsx(
            "flex flex-col h-full overflow-y-auto pb-[100px] px-4",
            className
          )}
        >
          {children}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PageContainer;
