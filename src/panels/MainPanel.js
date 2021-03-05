import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
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
  Placeholder,
  PanelSpinner,
} from "@vkontakte/vkui";
import {
  setActiveQuiz,
  setNotifications,
  setBlockView,
  removeQuiz,
} from "../store/data/actions";
import { withRouter } from "@happysanta/router";
import { MODAL_INFO, PAGE_QUIZ } from "../router";
import "./home.css";
import {
  Icon20UsersOutline,
  Icon24Info,
  Icon56ErrorOutline,
} from "@vkontakte/icons";
import logo from "../img/logo.png";
import { allowVKNotifications } from "../api/vk";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.data;

    this.enableNotifications = this.enableNotifications.bind(this);
  }

  removeItem = (id) => {
    this.setState({
      quiz: this.props.data.quiz,
      ...(this.props.data.quiz[id].show = !this.props.data.quiz[id].show),
    });
    setTimeout(() => this.props.removeQuiz(1), 1000);
  };

  enableNotifications() {
    allowVKNotifications().then((res) => {
      this.props.setNotifications(!this.props.notifications);
      setTimeout(() => {
        this.props.setBlockView(false);
      }, 1000);
    });
  }

  componentDidMount() {}

  render() {
    const { id, router, notifications } = this.props;

    return (
      <Panel id={id}>
        <PanelHeader
          style={{ textAlign: "center", marginBottom: 0 }}
          separator={false}
          left={
            <PanelHeaderButton onClick={() => router.pushModal(MODAL_INFO)}>
              <Icon24Info />
            </PanelHeaderButton>
          }
        >
          <img alt="logo" src={logo} height={36} style={{ margin: "0 auto" }} />
        </PanelHeader>
        {Boolean(!this.props.notifications) && (
          <Div className={`notification ${!notifications ? "show" : "hide"}`}>
            <Card
              className={`history ${notifications ? "active" : "disabled"}`}
            >
              <Div>
                <div className="d-flex align-center">
                  {" "}
                  <Icon20UsersOutline fill="#fff" width={16} height={16} />{" "}
                  <Caption
                    level="2"
                    weight="regular"
                    style={{ color: "white", marginLeft: 8 }}
                  >
                    УВЕДОМЛЕНИЯ
                  </Caption>
                </div>
                <Text
                  className="history__count history-action"
                  weight="medium"
                  style={{ color: "#fff", margin: "8px 0" }}
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
        )}
        {!this.props.loading ? (
          <Group
            mode="plain"
            header={
              <Title
                mode="secondary"
                style={{ margin: "0 16px", color: "grey" }}
              >
                Доступные опросы
              </Title>
            }
          >
            {this.props.data.quiz.length > 0 ? (
              <CardGrid size="l">
                {this.props.data.quiz.map((quiz, id) => (
                  <div key={id} style={{ width: "100%", margin: "8px 0" }}>
                    {quiz.type === "reusable" ? (
                      <ContentCard
                        image={quiz.cover}
                        height={`${window.innerWidth / 2}`}
                        header={quiz.title}
                        text={"Ваше мнение очень важно"}
                        onClick={() => {
                          this.props.setActiveQuiz(quiz.id);
                          router.pushPage(PAGE_QUIZ, { id: quiz.id });
                        }}
                      />
                    ) : (
                      <Card
                        className={`single-question ${
                          this.state.quiz[id].show ? "show" : "hide"
                        }`}
                      >
                        <Title
                          level={"3"}
                          weight="bold"
                          style={{ padding: "10px 20px" }}
                        >
                          {quiz.text}
                        </Title>
                        <Div>
                          <Button
                            size="s"
                            stretched={"true"}
                            style={{
                              margin: "0px auto 16px auto",
                              minHeight: "36px",
                            }}
                            onClick={() => this.removeItem(quiz.id)}
                          >
                            {quiz.firstAnswer}
                          </Button>
                          <Button
                            size="s"
                            stretched={"true"}
                            style={{
                              margin: "0px auto 16px auto",
                              minHeight: "36px",
                            }}
                            onClick={() => this.removeItem(quiz.id)}
                          >
                            {quiz.secondAnswer}
                          </Button>
                          <Button
                            size="s"
                            stretched={"true"}
                            style={{
                              margin: "0px auto 16px auto",
                              minHeight: "36px",
                            }}
                            onClick={() => this.removeItem(quiz.id)}
                          >
                            {quiz.thirdAnswer}
                          </Button>
                        </Div>
                      </Card>
                    )}
                  </div>
                ))}
              </CardGrid>
            ) : (
              <Placeholder icon={<Icon56ErrorOutline />} header="Внимание!">
                {!this.props.notifications
                  ? "Опросов пока нет, включите уведомления чтобы быть в курсе появления новых опросов!"
                  : "Опросов пока нет, ожидайте уведомления о появления новых опросов!"}
              </Placeholder>
            )}
          </Group>
        ) : (
          <PanelSpinner />
        )}
      </Panel>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notifications: state.data.notifications,
    data: state.data.data,
    blockView: state.data.blockView,
    loading: state.data.loading,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setActiveQuiz,
        setNotifications,
        setBlockView,
        removeQuiz,
      },
      dispatch,
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
