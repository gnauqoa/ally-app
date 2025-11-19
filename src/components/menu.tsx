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
  journalOutline,
  peopleOutline,
  personAddOutline,
  briefcaseOutline,
} from "ionicons/icons";
import { logoutThunk } from "@/redux/slices/auth";
import { useAppDispatch } from "@/redux/hooks";
import { ROUTE_PATHS } from "@/lib/constant";
import { useAppSelector } from "@/redux/hooks";
import { UserRole } from "@/@types/auth";

const Menu = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logoutThunk());
  };
  const isPsychologist = user?.role === UserRole.PSYCHOLOGIST;

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
            Bạn có cảm thấy thế nào hôm nay?
          </p>
          {isPsychologist ? (
            <>
              <IonMenuToggle autoHide={false}>
                <IonItem routerLink={ROUTE_PATHS.HOME} routerDirection="none">
                  <div className="flex gap-3 items-center">
                    <IonIcon
                      aria-hidden="true"
                      slot="start"
                      icon={homeOutline}
                    />
                    <IonLabel>Trang chủ</IonLabel>
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
                    <IonLabel>Trò chuyện</IonLabel>
                  </div>
                </IonItem>
              </IonMenuToggle>

              <IonMenuToggle autoHide={false}>
                <IonItem
                  routerLink={ROUTE_PATHS.JOURNAL}
                  routerDirection="none"
                >
                  <div className="flex gap-3 items-center">
                    <IonIcon
                      aria-hidden="true"
                      slot="start"
                      icon={journalOutline}
                    />
                    <IonLabel>Nhật ký cảm xúc</IonLabel>
                  </div>
                </IonItem>
              </IonMenuToggle>

              <IonMenuToggle autoHide={false}>
                <IonItem routerLink={ROUTE_PATHS.QUIZ} routerDirection="none">
                  <div className="flex gap-3 items-center">
                    <IonIcon
                      aria-hidden="true"
                      slot="start"
                      icon={bookOutline}
                    />
                    <IonLabel>Đánh giá tâm lý</IonLabel>
                  </div>
                </IonItem>
              </IonMenuToggle>

              <IonMenuToggle autoHide={false}>
                <IonItem
                  routerLink={ROUTE_PATHS.RESULT_HISTORY}
                  routerDirection="none"
                >
                  <div className="flex gap-3 items-center">
                    <IonIcon
                      aria-hidden="true"
                      slot="start"
                      icon={timeOutline}
                    />
                    <IonLabel>Kết quả đánh giá</IonLabel>
                  </div>
                </IonItem>
              </IonMenuToggle>
              <IonMenuToggle autoHide={false}>
                <IonItem
                  routerLink={ROUTE_PATHS.FIND_PSYCHOLOGIST}
                  routerDirection="none"
                >
                  <div className="flex gap-3 items-center">
                    <IonIcon
                      aria-hidden="true"
                      slot="start"
                      icon={personAddOutline}
                    />
                    <IonLabel>Tìm chuyên gia</IonLabel>
                  </div>
                </IonItem>
              </IonMenuToggle>

              <IonMenuToggle autoHide={false}>
                <IonItem
                  routerLink={ROUTE_PATHS.MY_PSYCHOLOGISTS}
                  routerDirection="none"
                >
                  <div className="flex gap-3 items-center">
                    <IonIcon
                      aria-hidden="true"
                      slot="start"
                      icon={peopleOutline}
                    />
                    <IonLabel>Chuyên gia của tôi</IonLabel>
                  </div>
                </IonItem>
              </IonMenuToggle>
            </>
          ) : (
            <IonMenuToggle autoHide={false}>
              <IonItem
                routerLink={ROUTE_PATHS.PSYCHOLOGIST_DASHBOARD}
                routerDirection="none"
              >
                <div className="flex gap-3 items-center">
                  <IonIcon
                    aria-hidden="true"
                    slot="start"
                    icon={briefcaseOutline}
                  />
                  <IonLabel>Bảng điều khiển</IonLabel>
                </div>
              </IonItem>
            </IonMenuToggle>
          )}

          <IonMenuToggle autoHide={false}>
            <IonItem button onClick={handleLogout}>
              <div className="flex gap-3 items-center">
                <IonIcon aria-hidden="true" slot="start" icon={logOutOutline} />
                <IonLabel>Đăng xuất</IonLabel>
              </div>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
