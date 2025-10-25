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
  bookOutline,
  logOutOutline,
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
import ChatDetail from "./pages/chat/detail";
import ChatHeader from "./pages/chat/header";
import QuizPage from "./pages/quiz";
import CreateQuizPage from "./pages/quiz/create";
import TakeQuizPage from "./pages/quiz/take";
import QuizHeader from "./pages/quiz/header";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import SettingsPage from "./pages/settings";
import HomePage from "./pages/home";
import ProtectedRoute from "./components/ProtectedRoute";
import { getAuthState, logout } from "./lib/auth-storage";
import { useHistory } from "react-router-dom";

setupIonicReact();

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <IonApp>
        <IonReactRouter>
          <MainApp />
        </IonReactRouter>
      </IonApp>
    </ThemeProvider>
  );
};

const MainApp: React.FC = () => {
  const history = useHistory();
  const authState = getAuthState();

  const handleLogout = () => {
    logout();
    history.push("/login");
  };

  return (
    <>
      {authState.isAuthenticated && (
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
                <IonItem routerLink="/quiz" routerDirection="none">
                  <div className="flex gap-3 items-center">
                    <IonIcon
                      aria-hidden="true"
                      slot="start"
                      icon={bookOutline}
                    />
                    <IonLabel>Quiz</IonLabel>
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

              <IonMenuToggle autoHide={false}>
                <IonItem button onClick={handleLogout}>
                  <div className="flex gap-3 items-center">
                    <IonIcon
                      aria-hidden="true"
                      slot="start"
                      icon={logOutOutline}
                    />
                    <IonLabel>Logout</IonLabel>
                  </div>
                </IonItem>
              </IonMenuToggle>
            </IonList>
          </IonContent>
        </IonMenu>
      )}

      <IonRouterOutlet id="main-content">
        {/* Public routes */}
        <Route exact path="/login">
          <IonPage>
            <IonContent fullscreen>
              <LoginPage />
            </IonContent>
          </IonPage>
        </Route>

        <Route exact path="/register">
          <IonPage>
            <IonContent fullscreen>
              <RegisterPage />
            </IonContent>
          </IonPage>
        </Route>

        {/* Protected routes */}
        <ProtectedRoute exact path="/chat">
          <IonPage>
            <ChatHeader />
            <IonContent fullscreen>
              <ChatPage />
            </IonContent>
          </IonPage>
        </ProtectedRoute>

        <ProtectedRoute exact path="/chat/:chatId">
          <IonPage>
            <ChatHeader />
            <IonContent fullscreen>
              <ChatDetail />
            </IonContent>
          </IonPage>
        </ProtectedRoute>

        <ProtectedRoute exact path="/quiz">
          <IonPage>
            <QuizHeader />
            <IonContent fullscreen>
              <QuizPage />
            </IonContent>
          </IonPage>
        </ProtectedRoute>

        <ProtectedRoute exact path="/quiz/create">
          <IonPage>
            <QuizHeader />
            <IonContent fullscreen>
              <CreateQuizPage />
            </IonContent>
          </IonPage>
        </ProtectedRoute>

        <ProtectedRoute exact path="/quiz/take/:quizId">
          <IonPage>
            <QuizHeader />
            <IonContent fullscreen>
              <TakeQuizPage />
            </IonContent>
          </IonPage>
        </ProtectedRoute>

        <ProtectedRoute exact path="/home">
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
              <HomePage />
            </IonContent>
          </IonPage>
        </ProtectedRoute>

        <ProtectedRoute exact path="/settings">
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
              <SettingsPage />
            </IonContent>
          </IonPage>
        </ProtectedRoute>

        <Route exact path="/">
          <Redirect to={authState.isAuthenticated ? "/chat" : "/login"} />
        </Route>
      </IonRouterOutlet>
    </>
  );
};

export default App;
