import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
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
  MODAL_HISTORY,
  POPOUT_SPINNER,
  PAGE_PROFILE,
  VIEW_PROFILE,
  MODAL_PAY,
  MODAL_INFO,
  MODAL_SETTINGS,
} from "./router";
import "./App.css";
import { account, auth, polls} from "./api";
import { withRouter } from "@happysanta/router";
import { getUserInfo, isIntroViewed } from "./api/vk/index";
import Confirm from "./components/ConfirmationPopout";
import AboutModalCard from "./components/AboutModalCard";
import HistoryModalPage from "./components/HistoryModalPage";
import {
  Icon28NewsfeedOutline,
  Icon28UserCircleOutline,
} from "@vkontakte/icons";
import { Epic } from "@vkontakte/vkui/dist/components/Epic/Epic";
import Profile from "./views/ProfileView";
import IntroView from "./views/IntroView";
import {
  getProfile,
  setIsOnboardingViewed,
  setNotifications,
  setData,
  setLoading,
  setBalance,
} from "./store/data/actions";
import PayModalCard from "./components/PayModalCard";
import InfoModalCard from "./components/InfoModalCard";
import SettingsModalCard from "./components/SettingsModalCard";

class App extends React.Component {
  popout() {
    const { location } = this.props;
    if (location.getPopupId() === POPOUT_CONFIRM) {
      return <Confirm />;
    } else if (location.getPopupId() === POPOUT_SPINNER) {
      return <ScreenSpinner />;
    }
  }

  async componentDidMount() {
    this.props.setLoading(true);
    getUserInfo().then((user) => {
      this.props.setNotifications(
        +window.location.search
          .split("vk_are_notifications_enabled=")[1]
          .split("")[0],
      );
      auth(window.location.search).then(async( res) => {
        localStorage.setItem( "user_ro", res.data.result.token );
        if (res.data.result.new) {
          await account({
            name: user.first_name,
            surname: user.last_name,
            sex: user.sex,
            city: user.city,
            country: user.country,
            bdate: user.bdate,
            timezone: user.timezone,
            photo: user.photo_100,
          });
        } else {
          await account().then( res => {
            this.props.getProfile({
              name: res.data.result.name,
              surname: res.data.result.surname,
              sex: res.data.result.sex,
              city: res.data.result.city,
              country: res.data.result.country,
              bdate: res.data.result.bdate,
              timezone: res.data.result.timezone,
              photo: res.data.result.photo,
            })
          })
        }
        this.props.setBalance(res.data.result.balance);

        polls()
          .then((res) => {
            this.props.setData(res.data.result.polls);
          })
          .finally(() => this.props.setLoading(false));
      });
    });

    if ((await isIntroViewed()) === "viewed") {
      router.replacePage(PAGE_MAIN);
      this.props.setIsOnboardingViewed(true);
    } else {
      //this.props.setIsOnboardingViewed(false);
    }
  }

  render() {
    const { location, colorScheme, router, snackbar } = this.props;
    const popout = this.popout();
    const modal = (
      <ModalRoot
        onClose={() => router.popPage()}
        activeModal={location.getModalId()}
      >
        <AboutModalCard id={MODAL_ABOUT} />
        <SettingsModalCard id={MODAL_SETTINGS} />
        <PayModalCard id={MODAL_PAY} />
        <InfoModalCard id={MODAL_INFO} />
        <HistoryModalPage onClose={() => router.popPage()} id={MODAL_HISTORY} />
      </ModalRoot>
    );
    return (
      <ConfigProvider isWebView={true} scheme={colorScheme}>
        <Root activeView={this.props.isOnboardingViewed ? "main" : "intro"}>
          <IntroView id="intro" activePanel="intro-1" />
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
                      <Icon28NewsfeedOutline />
                    </TabbarItem>

                    <TabbarItem
                      onClick={() => router.replacePage(PAGE_PROFILE)}
                      selected={VIEW_PROFILE === location.getViewId()}
                      data-story={VIEW_PROFILE}
                      text="Профиль"
                    >
                      <Icon28UserCircleOutline />
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

                <Main
                  activePanel={location.getViewActivePanel(VIEW_MAIN)}
                  history={location.getViewHistory(VIEW_MAIN)}
                  id={VIEW_MAIN}
                  modal={modal}
                  popout={popout}
                />
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
    profile: state.data.profile,
    isOnboardingViewed: state.data.isOnboardingViewed,
    data: state.data.data,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setIsOnboardingViewed,
        getProfile,
        setNotifications,
        setData,
        setLoading,
        setBalance,
      },
      dispatch,
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
