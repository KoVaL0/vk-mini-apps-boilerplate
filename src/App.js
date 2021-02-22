import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  ConfigProvider,
  ScreenSpinner,
  Root,
  ModalRoot,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import Intro from "./views/IntroView";
import Main from "./views/MainView";
import {
  router,
  VIEW_INTRO,
  VIEW_MAIN,
  MODAL_ABOUT,
  POPOUT_CONFIRM,
  PAGE_MAIN,
  PAGE_INTRO,
  MODAL_HISTORY,
  POPOUT_SPINNER,
  MODAL_INFO,
  MODAL_QUIZ,
  MODAL_PAY,
} from "./router";
import "./App.css";
import { auth } from "./api";
import { withRouter } from "@happysanta/router";
import { getUserInfo, isIntroViewed, STORAGE_KEYS } from "./api/vk/index";
import Confirm from "./components/ConfirmationPopout";
import AboutModalCard from "./components/AboutModalCard";
import HistoryModalPage from "./components/HistoryModalPage";
import InfoModalCard from "./components/InfoModalCard";
import { saveCredentials } from "./services";
import { getProfile, setNotifications } from "./store/data/actions";
import QuizModalCard from "./components/QuizModalCard";
import PayModalCard from "./components/PayModalCard";

class App extends React.Component {
  popout() {
    const { location } = this.props;
    if (location.getPopupId() === POPOUT_CONFIRM) {
      return <Confirm />;
    } else if (location.getPopupId() === POPOUT_SPINNER) {
      return <ScreenSpinner />;
    }
  }

  componentDidMount() {
    getUserInfo().then((res) => {
      console.log(res);
      this.props.getProfile(res);
    });

    auth(window.location.search)
      .then(async (resp) => {
        saveCredentials(resp);
        if ((await isIntroViewed()) === "viewed") {
          router.replacePage(PAGE_MAIN);
        } else {
          router.replacePage(PAGE_INTRO);
        }
      })
      .finally(() => {});
  }

  render() {
    const { location, colorScheme, router } = this.props;
    const popout = this.popout();
    const modal = (
      <ModalRoot
        onClose={() => router.popPage()}
        activeModal={location.getModalId()}
      >
        <AboutModalCard onClose={() => router.popPage()} id={MODAL_ABOUT} />
        <PayModalCard onClose={() => router.popPage()} id={MODAL_PAY} />
        <InfoModalCard onClose={() => router.popPage()} id={MODAL_INFO} />
        <QuizModalCard onClose={() => router.popPage()} id={MODAL_QUIZ} />
        <HistoryModalPage onClose={() => router.popPage()} id={MODAL_HISTORY} />
      </ModalRoot>
    );
    return (
      <ConfigProvider isWebView={true} scheme={colorScheme}>
        <Root activeView={location.getViewId()}>
          <Intro
            popout={popout}
            activePanel={location.getViewActivePanel(VIEW_INTRO)}
            id={VIEW_INTRO}
          />
          <Main
            activePanel={location.getViewActivePanel(VIEW_MAIN)}
            history={location.getViewHistory(VIEW_MAIN)}
            id={VIEW_MAIN}
            modal={modal}
            popout={popout}
          />
        </Root>
      </ConfigProvider>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    colorScheme: state.data.colorScheme,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ getProfile, setNotifications }, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
