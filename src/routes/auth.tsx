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
}

const AuthRoute: React.FC<AuthRouteProps> = ({
  component: Component,
  title,
  customHeader,
  rightSlot,
  ...rest
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
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
              <PageContainer>
                <Component {...props} />
              </PageContainer>
            </IonContent>
          </IonPage>
        ) : (
          <LoginPage />
        )
      }
    />
  );
};

export default AuthRoute;
