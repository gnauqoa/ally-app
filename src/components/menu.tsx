import {
  IonIcon,
  IonItem,
  IonList,
  IonMenu,
  IonLabel,
  IonMenuToggle,
  IonContent,
} from "@ionic/react";
import {
  chatbubbleEllipsesOutline,
  bookOutline,
  homeOutline,
  logOutOutline,
  timeOutline,
} from "ionicons/icons";
import { logoutThunk } from "@/redux/slices/auth";
import { useAppDispatch } from "@/redux/hooks";
import { ROUTE_PATHS } from "@/lib/constant";
import { useAppSelector } from "@/redux/hooks";

const Menu = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <IonMenu menuId="main-menu" contentId="main-content">
      <IonContent>
        <IonList
          style={{
            paddingTop: "env(safe-area-inset-top)",
          }}
        >
          <p className="text-2xl font-bold pl-4 pt-[1rem]">Hi, {user?.name}</p>
          <p className="text-sm text-muted-foreground pl-4">
            How are you today?
          </p>
          <IonMenuToggle autoHide={false}>
            <IonItem routerLink={ROUTE_PATHS.HOME} routerDirection="none">
              <div className="flex gap-3 items-center">
                <IonIcon aria-hidden="true" slot="start" icon={homeOutline} />
                <IonLabel>Home</IonLabel>
              </div>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle autoHide={false}>
            <IonItem routerLink={ROUTE_PATHS.CHAT} routerDirection="none">
              <div className="flex gap-3 items-center">
                <IonIcon
                  aria-hidden="true"
                  slot="start"
                  icon={chatbubbleEllipsesOutline}
                />
                <IonLabel>Chat</IonLabel>
              </div>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle autoHide={false}>
            <IonItem routerLink={ROUTE_PATHS.QUIZ} routerDirection="none">
              <div className="flex gap-3 items-center">
                <IonIcon aria-hidden="true" slot="start" icon={bookOutline} />
                <IonLabel>Tests</IonLabel>
              </div>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle autoHide={false}>
            <IonItem
              routerLink={ROUTE_PATHS.RESULT_HISTORY}
              routerDirection="none"
            >
              <div className="flex gap-3 items-center">
                <IonIcon aria-hidden="true" slot="start" icon={timeOutline} />
                <IonLabel>Test Histories</IonLabel>
              </div>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle autoHide={false}>
            <IonItem button onClick={handleLogout}>
              <div className="flex gap-3 items-center">
                <IonIcon aria-hidden="true" slot="start" icon={logOutOutline} />
                <IonLabel>Logout</IonLabel>
              </div>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
