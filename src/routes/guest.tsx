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
import { UserRole } from "@/@types/auth";
import PsychologistDashboard from "@/pages/psychologist/dashboard";

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
  const { user } = useAppSelector((state) => state.auth);
  const isPsychologist = user?.role === UserRole.PSYCHOLOGIST;

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
                {isPsychologist ? <PsychologistDashboard /> : <HomePage />}
              </PageContainer>
            </IonContent>
          </IonPage>
        )
      }
    />
  );
};

export default GuestRoute;
