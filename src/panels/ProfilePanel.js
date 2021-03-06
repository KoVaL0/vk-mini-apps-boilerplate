import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Title,
  Text,
  Link,
  Div,
  Caption,
  Button,
  Card,
  Header,
  Group,
  PanelSpinner,
} from "@vkontakte/vkui";
import { withRouter } from "@happysanta/router";
import { MODAL_PAY, MODAL_SETTINGS, PAGE_MAIN } from "../router";
import "./home.css";
import {
  Icon12ChevronOutline,
  Icon20UsersOutline,
  Icon24BrowserBack,
} from "@vkontakte/icons";
import logo from "../img/logo.png";
import { setNotifications } from "../store/data/actions";
import { allowVKNotifications } from "../api/vk";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.enableNotifications = this.enableNotifications.bind(this);
  }

  enableNotifications() {
    allowVKNotifications().then((res) => {
      this.props.setNotifications(!this.props.notifications);
    });
  }

  render() {
    const {id, profile, router, notifications} = this.props;
    console.log("red", profile);

    return (
      <Panel id={id}>
        <PanelHeader
          separator={false}
          left={
            <>
              <PanelHeaderButton onClick={() => router.pushPage(PAGE_MAIN)}>
                <Icon24BrowserBack/>
              </PanelHeaderButton>
            </>
          }
        >
          <img alt="logo" src={logo} height={36} style={{margin: "0 auto"}}/>
        </PanelHeader>
        {!this.props.loading ? (
          <React.Fragment>
            <Group>
              <div className="d-row" style={{margin: "0 16px"}}>
                <img
                  alt="profile_img"
                  className="profile__photo"
                  src={profile.photo}
                />
                <div>
                  <Title className="profile__name" level="1" weight="heavy">
                    {profile.name} {profile.surname}
                  </Title>
                  <Text className="profile__link" weight="regular">
                    {this.props.balance} баллов
                  </Text>
                </div>
              </div>
            </Group>
            <Group
              header={<Header mode="secondary">Информация об аккаунте</Header>}
            >
              <Header
                mode="primary"
                aside={
                  <Link
                    onClick={() => router.pushModal(MODAL_SETTINGS)}
                    style={{color: "#8f99a4"}}
                  >
                    {this.props.profile.country.title}
                    <Icon12ChevronOutline/>
                  </Link>
                }
              >
                Страна
              </Header>
              <Header
                mode="primary"
                aside={
                  <Link
                    onClick={() => router.pushModal(MODAL_SETTINGS)}
                    style={{color: "#8f99a4"}}
                  >
                    {this.props.profile.city.title}
                    <Icon12ChevronOutline/>
                  </Link>
                }
              >
                Город
              </Header>
              <Header
                mode="primary"
                aside={
                  <Link
                    onClick={() => router.pushModal(MODAL_SETTINGS)}
                    style={{color: "#8f99a4"}}
                  >
                    {+this.props.profile.sex === 1
                      ? "Женский"
                      : +this.props.profile.sex === 2
                        ? "Мужской"
                        : "Пол не указан"}
                    <Icon12ChevronOutline/>
                  </Link>
                }
              >
                Пол
              </Header>
            </Group>
            <Group header={<Header mode="secondary">Вывод средств</Header>}>
              <Header
                mode="primary"
                aside={
                  <Link
                    style={{color: "#8f99a4"}}
                    onClick={() => router.pushModal(MODAL_PAY)}
                  >
                    Вывести
                    <Icon12ChevronOutline/>
                  </Link>
                }
              >
                {this.props.balance} баллов
              </Header>
            </Group>
            <Div>
              {" "}
              <Card className={`history ${notifications ? "active" : "disabled"}`}>
                <Div>
                  <div className="d-flex align-center">
                    {" "}
                    <Icon20UsersOutline fill="#fff" width={16} height={16}/>{" "}
                    <Caption
                      level="2"
                      weight="regular"
                      style={{color: "white", marginLeft: 8}}
                    >
                      УВЕДОМЛЕНИЯ
                    </Caption>
                  </div>
                  <Text
                    className="history__count history-action"
                    weight="medium"
                    style={{color: "#fff", margin: "8px 0"}}
                  >
                    {!this.props.notifications
                      ? "Включите уведомления, чтобы проходить опросы одними из первых, и зарабатывать больше баллов!"
                      : "Уведомления включены"}
                  </Text>
                  <Button
                    size="s"
                    stretched={"true"}
                    className="action-button"
                    onClick={this.enableNotifications}
                  >
                    {this.props.notifications ? "Отключить" : "Включить"}
                  </Button>
                </Div>
              </Card>
            </Div>
          </React.Fragment>
        ) : (
          <PanelSpinner/>
        )}
      </Panel>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.data.profile,
    notifications: state.data.notifications,
    balance: state.data.balance,
    loading: state.data.loading,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setNotifications,
      },
      dispatch,
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
