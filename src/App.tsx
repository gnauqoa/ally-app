import {
  IonApp,
  IonButton,
  IonIcon,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { useAppSelector } from "@/redux/hooks";
import AuthRoutes from "@/routes/auth";
import GuestRoutes from "@/routes/guest";
import Menu from "@/components/menu";
import { IonReactRouter } from "@ionic/react-router";
import HomePage from "@/pages/home";
import ChatPage from "@/pages/chat";
import ChatDetail from "@/pages/chat/detail";
import TakeQuizPage from "@/pages/quiz/take";
import SettingsPage from "@/pages/settings";
import JournalPage from "@/pages/journal";
import WriteJournalPage from "@/pages/journal/write";
import ViewJournalPage from "@/pages/journal/view";
import ResultDetailPage from "@/pages/result-history/detail";
import PsychologistDashboard from "@/pages/psychologist/dashboard";
import PatientProfile from "@/pages/psychologist/patient-profile";
import FindPsychologist from "@/pages/patient/find-psychologist";
import MyPsychologist from "@/pages/patient/my-psychologist";

import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
// import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

import "@/styles/app.css";
import "@/styles/override.css";
import RegisterPage from "./pages/auth/register";
import LoginPage from "./pages/auth/login";
import { ROUTE_PATHS } from "./lib/constant";
import TabTitle from "./components/tab-title";
import QuizTaskHeader from "./components/quiz/header";
import QuizPage from "./pages/quiz";
import { useEffect } from "react";
import { getProfileThunk } from "./redux/slices/auth";
import { useAppDispatch } from "./redux/hooks";
import ResultHistoryPage from "./pages/result-history";
import ChatDetailHeader from "./components/chat/detail-header";
import AddChatButton from "./components/chat/add-button";
setupIonicReact();

const App: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfileThunk());
    }
  }, []);

  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main-content">
            {isAuthenticated && <Menu />}
            <IonRouterOutlet id="main-content">
              <Route
                exact
                path="/"
                render={() => <Redirect to={ROUTE_PATHS.HOME} />}
              />
              <GuestRoutes
                exact
                path={ROUTE_PATHS.LOGIN}
                component={LoginPage}
              />
              <GuestRoutes
                exact
                path={ROUTE_PATHS.REGISTER}
                component={RegisterPage}
              />
              <AuthRoutes
                exact
                path={ROUTE_PATHS.HOME}
                component={HomePage}
                title={<TabTitle title="Trang chủ" />}
              />

              <AuthRoutes
                exact
                path={ROUTE_PATHS.CHAT}
                component={ChatPage}
                title="Trò chuyện"
                rightSlot={<AddChatButton />}
              />

              <AuthRoutes
                exact
                path={ROUTE_PATHS.CHAT_DETAIL}
                component={ChatDetail}
                customHeader={<ChatDetailHeader />}
              />

              <AuthRoutes
                exact
                path={ROUTE_PATHS.QUIZ}
                component={QuizPage}
                title="Đánh giá tâm lý"
              />

              <AuthRoutes
                exact
                path={ROUTE_PATHS.QUIZ_TAKE}
                component={TakeQuizPage}
                title={<QuizTaskHeader />}
              />

              <AuthRoutes
                exact
                path={ROUTE_PATHS.RESULT_HISTORY}
                component={ResultHistoryPage}
                title="Kết quả đánh giá"
              />

              <AuthRoutes
                exact
                path={ROUTE_PATHS.RESULT_DETAIL}
                component={ResultDetailPage}
                title="Chi tiết kết quả"
              />

              <AuthRoutes
                exact
                path={ROUTE_PATHS.JOURNAL}
                component={JournalPage}
                title="Nhật ký cảm xúc"
              />

              <AuthRoutes
                exact
                path={ROUTE_PATHS.JOURNAL_WRITE}
                component={WriteJournalPage}
              />

              <AuthRoutes
                exact
                path={ROUTE_PATHS.JOURNAL_VIEW}
                component={ViewJournalPage}
              />

              <AuthRoutes
                exact
                path={ROUTE_PATHS.PSYCHOLOGIST_DASHBOARD}
                component={PsychologistDashboard}
                title="Bảng điều khiển"
                requiredRole="PSYCHOLOGIST"
              />

              <AuthRoutes
                exact
                path={ROUTE_PATHS.PSYCHOLOGIST_PATIENT}
                component={PatientProfile}
                title="Hồ sơ bệnh nhân"
                requiredRole="PSYCHOLOGIST"
              />

              <AuthRoutes
                exact
                path={ROUTE_PATHS.FIND_PSYCHOLOGIST}
                component={FindPsychologist}
                title="Tìm chuyên gia"
              />

              <AuthRoutes
                exact
                path={ROUTE_PATHS.MY_PSYCHOLOGISTS}
                component={MyPsychologist}
                title="Chuyên gia của tôi"
              />

              <AuthRoutes
                exact
                path={ROUTE_PATHS.SETTINGS}
                component={SettingsPage}
                title="Cài đặt"
              />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </ThemeProvider>
  );
};

export default App;
