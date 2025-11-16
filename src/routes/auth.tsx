import { Route } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import {
  IonButtons,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import { IonContent } from "@ionic/react";
import PageContainer from "@/components/page-container";
import LoginPage from "@/pages/auth/login";
import TabTitle from "@/components/tab-title";

interface AuthRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
  title?: React.ReactNode | string;
  customHeader?: React.ReactNode;
  rightSlot?: React.ReactNode;
  requiredRole?: string; // Add role-based guard
}

const AuthRoute: React.FC<AuthRouteProps> = ({
  component: Component,
  title,
  customHeader,
  rightSlot,
  requiredRole,
  ...rest
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Check role if required
  const hasAccess = !requiredRole || user?.role === requiredRole;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          hasAccess ? (
            <IonPage>
              {customHeader ? (
                customHeader
              ) : (
                <IonHeader>
                  <IonToolbar>
                    <IonButtons slot="start">
                      <IonMenuButton />
                    </IonButtons>
                    {typeof title === "string" ? (
                      <TabTitle title={title} />
                    ) : (
                      title
                    )}
                    {rightSlot && <IonButtons slot="end">{rightSlot}</IonButtons>}
                  </IonToolbar>
                </IonHeader>
              )}
              <IonContent fullscreen>
                <Component {...props} />
              </IonContent>
            </IonPage>
          ) : (
            <IonPage>
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonMenuButton />
                  </IonButtons>
                  <TabTitle title="Không có quyền truy cập" />
                </IonToolbar>
              </IonHeader>
              <IonContent fullscreen>
                <PageContainer>
                  <div className="flex flex-col items-center justify-center h-full py-12">
                    <h2 className="text-2xl font-bold mb-4">Không có quyền truy cập</h2>
                    <p className="text-muted-foreground text-center mb-6">
                      Bạn không có quyền truy cập trang này. Chỉ dành cho chuyên gia tâm lý.
                    </p>
                  </div>
                </PageContainer>
              </IonContent>
            </IonPage>
          )
        ) : (
          <LoginPage />
        )
      }
    />
  );
};

export default AuthRoute;
