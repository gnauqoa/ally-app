import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  chatbubbleEllipsesOutline,
  homeOutline,
  settingsOutline,
} from "ionicons/icons";

import "./App.css";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
// import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import { ThemeProvider } from "./components/theme-provider";
import ChatPage from "./pages/chat";
import ChatDetail from "./pages/chat/chat-detail";
import { Plus } from "lucide-react";
import ChatHeader from "./pages/chat/header";

setupIonicReact();

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <IonApp>
        <IonReactRouter>
          <IonMenu menuId="main-menu" contentId="main-content">
            <IonHeader>
              <IonToolbar>
                <IonTitle>Menu</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonList>
                <IonMenuToggle autoHide={false}>
                  <IonItem routerLink="/chat" routerDirection="none">
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
                  <IonItem routerLink="/home" routerDirection="none">
                    <div className="flex gap-3 items-center">
                      <IonIcon
                        aria-hidden="true"
                        slot="start"
                        icon={homeOutline}
                      />
                      <IonLabel>Home</IonLabel>
                    </div>
                  </IonItem>
                </IonMenuToggle>

                <IonMenuToggle autoHide={false}>
                  <IonItem routerLink="/settings" routerDirection="none">
                    <div className="flex gap-3 items-center">
                      <IonIcon
                        aria-hidden="true"
                        slot="start"
                        icon={settingsOutline}
                      />
                      <IonLabel>Settings</IonLabel>
                    </div>
                  </IonItem>
                </IonMenuToggle>
              </IonList>
            </IonContent>
          </IonMenu>

          {/* main router outlet */}
          <IonRouterOutlet id="main-content">
            <Route exact path="/chat">
              <IonPage>
                <ChatHeader />
                <IonContent fullscreen>
                  <ChatPage />
                </IonContent>
              </IonPage>
            </Route>

            <Route exact path="/chat/:chatId">
              <IonPage>
                <ChatHeader />
                <IonContent fullscreen>
                  <ChatDetail />
                </IonContent>
              </IonPage>
            </Route>

            <Route exact path="/home">
              <IonPage>
                <IonHeader>
                  <IonToolbar>
                    <IonButtons slot="start">
                      <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Home</IonTitle>
                  </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                  <div className="p-4">
                    <h1>Welcome to Ally</h1>
                    <p>This is the home page.</p>
                  </div>
                </IonContent>
              </IonPage>
            </Route>

            <Route exact path="/settings">
              <IonPage>
                <IonHeader>
                  <IonToolbar>
                    <IonButtons slot="start">
                      <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Settings</IonTitle>
                  </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                  <div className="p-4">
                    <h1>Settings</h1>
                    <p>Configure your preferences here.</p>
                  </div>
                </IonContent>
              </IonPage>
            </Route>

            <Route exact path="/">
              <Redirect to="/chat" />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </ThemeProvider>
  );
};

export default App;
