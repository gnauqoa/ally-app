import { Route } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import HomePage from "@/pages/home";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import PageContainer from "@/components/page-container";
import TabTitle from "@/components/tab-title";

interface GuestRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
}

const GuestRoute: React.FC<GuestRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? (
          <Component {...props} />
        ) : (
          <IonPage>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonMenuButton />
                </IonButtons>
                <TabTitle title="Home" />
              </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
              <PageContainer className="px-4">
                <HomePage />
              </PageContainer>
            </IonContent>
          </IonPage>
        )
      }
    />
  );
};

export default GuestRoute;
