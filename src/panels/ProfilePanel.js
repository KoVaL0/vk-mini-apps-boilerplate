import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
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
} from "@vkontakte/vkui";
import {withRouter} from "@happysanta/router";
import {MODAL_PAY, MODAL_SETTINGS, PAGE_MAIN} from "../router";
import "./home.css";
import {Icon12ChevronOutline, Icon20UsersOutline, Icon24BrowserBack} from "@vkontakte/icons";
import logo from "../img/logo.png";
import {setNotifications} from "../store/data/actions";

class Home extends React.Component {
  render() {
    const {id, profile, router, notifications} = this.props;

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
          <img alt='logo' src={logo} height={36} style={{margin: "0 auto"}}/>
        </PanelHeader>
        <Group style={{margin: "0 16px"}}>
          <div className="d-row" style={{margin: "16px 3%"}}>
            <img
              alt="profile_img"
              className="profile__photo"
              src={profile.photo_200}
            />
            <div>
              <Title
                className="profile__name"
                level="1"
                weight="heavy"
              >
                {profile.first_name} {profile.last_name}
              </Title>
              <Text className="profile__link" weight="regular">
                12 баллов
              </Text>
            </div>
          </div>
        </Group>
        <Group
          style={{margin: "0 16px"}}
          header={
            <Header mode="secondary">
              Информация об аккаунте
            </Header>
          }
        >
          <Header
            mode="primary"
            aside={
              <Link
                onClick={() => (router.pushModal(MODAL_SETTINGS))}
                style={{color: "#8f99a4"}}>
                {this.props.profile.country.title}
                <Icon12ChevronOutline/>
              </Link>
            }>
            Страна
          </Header>
          <Header
            mode="primary"
            aside={
              <Link
                onClick={() => (router.pushModal(MODAL_SETTINGS))}
                style={{color: "#8f99a4"}}
              >
                {this.props.profile.city.title}
                <Icon12ChevronOutline/>
              </Link>
            }>
            Город
          </Header>
          <Header
            mode="primary"
            aside={
              <Link
                onClick={() => (router.pushModal(MODAL_SETTINGS))}
                style={{color: "#8f99a4"}}>
                {
                  this.props.profile.sex === 1 ? ("Женский") :
                    (this.props.profile.sex === 2) ? ("Мужской") :
                      ("Пол не указан")
                }
                <Icon12ChevronOutline/>
              </Link>
            }>
            Пол
          </Header>
        </Group>
        <Group
          style={{margin: "0 16px"}}
          header={
            <Header mode="secondary">
              Вывод средств
            </Header>
          }
        >
          <Header
            mode="primary"
            aside={
              <Link
                style={{color: "#8f99a4"}}
                onClick={() => (router.pushModal(MODAL_PAY))}
              >
                Вывести
                <Icon12ChevronOutline/>
              </Link>
            }
          >
            Количество баллов: 12
          </Header>
        </Group>

        <Card className={`history ${notifications ? 'active' : 'disabled'}`}>
          <Div>
            <div className="d-flex align-center">
              {' '}
              <Icon20UsersOutline fill="#fff" width={16} height={16}/>{' '}
              <Caption
                level="2"
                weight="regular"
                style={{color: 'white', marginLeft: 8}}
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
                ? 'Уведомления выключены'
                : 'Уведомления включены'}
            </Text>
            <Button
              size="s"
              stretched={"true"}
              className="action-button"
              onClick={() => {
                this.props.setNotifications(!this.props.notifications)
              }}
            >
              {this.props.notifications ? 'Отключить' : 'Включить'}
            </Button>
          </Div>
        </Card>
      </Panel>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.data.profile,
    notifications: state.data.notifications,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({
      setNotifications,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
