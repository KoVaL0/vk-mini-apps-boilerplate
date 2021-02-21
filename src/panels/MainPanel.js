import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Title,
  Text,
  Button,
  Group,
  Div,
  Card,
  CardGrid,
  ContentCard,
  Caption,
} from "@vkontakte/vkui";
import {
  setActiveQuiz, setNotifications, setBlockView
} from '../store/data/actions';
import {withRouter} from "@happysanta/router";
import {MODAL_INFO, PAGE_QUIZ} from "../router";
import "./home.css";
import {
  Icon20UsersOutline,
  Icon24Info,
} from "@vkontakte/icons";
import logo from "../img/logo.png";

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = this.props.data
  }

  removeItem = id => {
    this.setState({quiz: this.state.quiz, ...this.state.quiz[id].show = !this.state.quiz[id].show})
    setTimeout(() => (this.setState({quiz: this.state.quiz.filter(el => el.id !== id)})), 1000)
  }

  render() {
    const {id, profile, router, notifications, ...rest} = this.props;
    if (!notifications) {
      this.state.blockView = true
    }

    return (
      <Panel id={id}>
        <PanelHeader
          style={{textAlign: "center", marginBottom: 0}}
          separator={false}
          left={
            <PanelHeaderButton
              onClick={() =>
                router.pushModal(MODAL_INFO)
              }
            >
              <Icon24Info/>
            </PanelHeaderButton>
          }
        >
          <img alt='logo' src={logo} height={36} style={{margin: "0 auto"}}/>
        </PanelHeader>
        {this.props.blockView &&
        <Div className={`notification ${!notifications ? "show" : "hide"}`}>
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
                  setTimeout(() => {this.props.setBlockView(false)}, 1000)
                }}
              >
                {this.props.notifications ? 'Отключить' : 'Включить'}
              </Button>
            </Div>
          </Card>
        </Div>}
        <Group
          mode="plain"
          header={
            <Title mode="secondary" style={{margin: "0 16px", color: "grey"}}>
              Доступные опросы
            </Title>
          }>
          <CardGrid size="l">
            {
              this.state.quiz.map((quiz, id) => (
                <div key={id} style={{width: "100%", margin: "8px 0"}}>
                  {(quiz.type === "reusable") ? (
                    <ContentCard
                      image={quiz.image}
                      height={`${window.innerWidth / 4}`}
                      header={quiz.header}
                      text={quiz.text}
                      onClick={() => {
                        this.props.setActiveQuiz(quiz.id)
                        router.pushPage(PAGE_QUIZ, {id: quiz.id})
                      }}
                    />
                  ) : (
                    <Card
                      className={`single-question ${this.state.quiz[id].show ? "show" : "hide"}`}
                    >
                      <Title level={"3"} weight="bold" style={{padding: "10px 20px"}}>
                        {quiz.text}
                      </Title>
                      <Div>
                        <Button
                          size="s"
                          stretched={"true"}
                          style={{margin: '0px auto 16px auto', minHeight: "36px"}}
                          onClick={() => (this.removeItem(id))}
                        >
                          {quiz.firstAnswer}
                        </Button>
                        <Button
                          size="s"
                          stretched={"true"}
                          style={{margin: '0px auto 16px auto', minHeight: "36px"}}
                          onClick={() => (this.removeItem(id))}
                        >
                          {quiz.secondAnswer}
                        </Button>
                        <Button
                          size="s"
                          stretched={"true"}
                          style={{margin: '0px auto 16px auto', minHeight: "36px"}}
                          onClick={() => (this.removeItem(id))}
                        >
                          {quiz.thirdAnswer}
                        </Button>
                      </Div>
                    </Card>
                  )}
                </div>
              ))
            }
          </CardGrid>
        </Group>
      </Panel>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.data.profile,
    notifications: state.data.notifications,
    index: state.data.activeQuiz,
    data: state.data.data,
    blockView: state.data.blockView,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({
      setActiveQuiz,
      setNotifications,
      setBlockView,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
