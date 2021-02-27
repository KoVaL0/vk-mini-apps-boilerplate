import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
  ConfigProvider,
  ScreenSpinner,
  Root,
  ModalRoot,
  View,
  Tabbar,
  TabbarItem,
  Panel,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import Main from "./views/MainView";
import {
  router,
  VIEW_MAIN,
  MODAL_ABOUT,
  POPOUT_CONFIRM,
  PAGE_MAIN,
  PAGE_INTRO,
  MODAL_HISTORY,
  POPOUT_SPINNER,
  PAGE_PROFILE,
  VIEW_PROFILE,
  MODAL_PAY,
  MODAL_INFO,
  MODAL_QUIZ,
  MODAL_SETTINGS,
} from "./router";
import "./App.css";
import {auth, poll} from "./api";
import {withRouter} from "@happysanta/router";
import {getUserInfo, isIntroViewed} from "./api/vk/index";
import Confirm from "./components/ConfirmationPopout";
import AboutModalCard from "./components/AboutModalCard";
import HistoryModalPage from "./components/HistoryModalPage";
import {
  Icon28NewsfeedOutline,
  Icon28UserCircleOutline,
} from "@vkontakte/icons";
import {Epic} from "@vkontakte/vkui/dist/components/Epic/Epic";
import Profile from "./views/ProfileView";
import IntroView from "./views/IntroView";
import {
  getProfile,
  setIsOnboardingViewed,
  setNotifications,
  setData,
} from "./store/data/actions";
import PayModalCard from "./components/PayModalCard";
import InfoModalCard from "./components/InfoModalCard";
import SettingsModalCard from "./components/SettingsModalCard";
import {polls} from "./api/rest/polls";

class App extends React.Component {
  popout() {
    const {location} = this.props;
    if (location.getPopupId() === POPOUT_CONFIRM) {
      return <Confirm/>;
    } else if (location.getPopupId() === POPOUT_SPINNER) {
      return <ScreenSpinner/>;
    }
  }

  async componentDidMount() {
    getUserInfo().then((res) => {
      this.props.getProfile(res);
    });
    console.log(window.location.search)
    auth(window.location.search)
      .then((res) => {
        localStorage.setItem("user_ro", res.data.result.token);
        polls()
          .then((res) => {
            this.props.setData(res.data.result.polls)
          })
          .catch((e) => (console.log(e)));
      })
      .catch((e) => (console.log(e, "Auth")));

    if ((await isIntroViewed()) === "viewed") {
      router.replacePage(PAGE_MAIN);
    } else {
      router.replacePage(PAGE_INTRO);
    }
  }

  updateQuiz = (id) => {

  }

  render() {
    const {location, colorScheme, router, snackbar} = this.props;
    const popout = this.popout();
    const modal = (
      <ModalRoot
        onClose={() => router.popPage()}
        activeModal={location.getModalId()}
      >
        <AboutModalCard id={MODAL_ABOUT}/>
        <SettingsModalCard id={MODAL_SETTINGS}/>
        <PayModalCard id={MODAL_PAY}/>
        <InfoModalCard id={MODAL_INFO}/>
        <HistoryModalPage onClose={() => router.popPage()} id={MODAL_HISTORY}/>
      </ModalRoot>
    );
    return (
      <ConfigProvider isWebView={true} scheme={colorScheme}>
        <Root activeView={this.props.isOnboardingViewed ? "main" : "intro"}>
          <IntroView id="intro" activePanel="intro-1"/>
          <View id="main" activePanel="main-1">
            <Panel id="main-1">
              <Epic
                activeStory={location.getViewId()}
                tabbar={
                  <Tabbar>
                    <TabbarItem
                      onClick={() => router.replacePage(PAGE_MAIN)}
                      selected={VIEW_MAIN === location.getViewId()}
                      data-story={VIEW_MAIN}
                      text="Опросы"
                    >
                      <Icon28NewsfeedOutline/>
                    </TabbarItem>

                    <TabbarItem
                      onClick={() => router.replacePage(PAGE_PROFILE)}
                      selected={VIEW_PROFILE === location.getViewId()}
                      data-story={VIEW_PROFILE}
                      text="Профиль"
                    >
                      <Icon28UserCircleOutline/>
                    </TabbarItem>
                  </Tabbar>
                }
              >
                <Profile
                  activePanel={location.getViewActivePanel(VIEW_PROFILE)}
                  history={location.getViewHistory(VIEW_PROFILE)}
                  id={VIEW_PROFILE}
                  modal={modal}
                  popout={popout}
                />

                {this.props.data.quiz.length>0 &&<Main
                  updateQuiz={(id) => this.updateQuiz(id)}
                  activePanel={location.getViewActivePanel(VIEW_MAIN)}
                  history={location.getViewHistory(VIEW_MAIN)}
                  id={VIEW_MAIN}
                  modal={modal}
                  popout={popout}
                />}
              </Epic>
              {snackbar}
            </Panel>
          </View>
        </Root>
      </ConfigProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    snackbar: state.data.snackbar,
    colorScheme: state.data.colorScheme,
    isOnboardingViewed: state.data.isOnboardingViewed,
    data: state.data.data,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators(
      {setIsOnboardingViewed, getProfile, setNotifications, setData},
      dispatch,
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
