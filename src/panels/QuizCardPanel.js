import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Text,
  Button,
  Group,
  Div,
  Gallery,
  Checkbox,
  Input,
  File,
  Snackbar,
  Title,
  PanelSpinner,
  Header,
} from "@vkontakte/vkui";
import {
  setActiveAnswer,
  setSnackbar,
  removeQuiz,
  setBalance,
} from "../store/data/actions";
import { withRouter } from "@happysanta/router";
import { PAGE_MAIN, POPOUT_CONFIRM, POPOUT_SPINNER } from "../router";
import "./home.css";
import {
  Icon16ErrorCircleFill,
  Icon24ArrowRightOutline,
  Icon24BrowserBack,
  Icon24Document,
} from "@vkontakte/icons";
import logo from "../img/logo.png";
import moneyBag from "../img/money-bag.png";
import "./home.css";
import { answer } from "../api";

class QuizCardPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.data;
    this.answer = null;
    this.data = {
      answer: {},
    };
    this.input = "";
    this.single = "";
    this.file = null;
    this.answerMulti = {
      first: false,
      second: false,
      third: false,
    };
  }

  snackBar = (text) => {
    return (
      <Snackbar
        onClose={() => this.props.setSnackbar(null)}
        duration={2500}
        before={<Icon16ErrorCircleFill width={24} height={24} />}
        onClick={() => this.props.setSnackbar(null)}
      >
        {text}
      </Snackbar>
    );
  };

  handlerEnd = async () => {
    this.props.setBalance(this.props.balance + this.props.quiz.award);
    if (!this.props.notifications) {
      await this.props.router.replacePopup(POPOUT_CONFIRM);
      this.props.removeQuiz(this.props.quiz.id);
    } else {
      await this.props.router.replacePage(PAGE_MAIN);
      this.props.removeQuiz(this.props.quiz.id);
    }
  };

  zeroing = () => {
    this.answer = null;
    this.answerMulti = {
      first: false,
      second: false,
      third: false,
    };
    this.input = "";
    this.file = null;
    this.single = "";
  };

  answerMultiArr = () => {
    const arr = [];
    for (let key in this.answerMulti) {
      if (this.answerMulti[key]) {
        switch (key) {
          case "first": {
            arr.push(1);
            break;
          }
          case "second": {
            arr.push(2);
            break;
          }
          case "third": {
            arr.push(3);
            break;
          }
        }
      }
    }
    return arr;
  };

  responseAnswer = (type, i) => {
    switch (type) {
      case "single": {
        return [this.single];
      }
      case "input" || "text": {
        return [this.input];
      }
      case "file": {
        return [this.file.data.split("base64,")[1], this.file.name];
      }
      case "multi": {
        return [this.answerMultiArr()];
      }
      default: {
        return console.log(
          `Неверно указан тип ответов!(single, multi, input, file) Ваш тип ${type}`,
        );
      }
    }
  };

  checkAnswer = (i, type) => {
    if (
      type === "multi" &&
      (this.answerMulti.first ||
        this.answerMulti.second ||
        this.answerMulti.third)
    ) {
      this.responseAnswer("multi", i);
      this.setState({ slideIndex: this.state.slideIndex + 1 });
    } else if (type !== "multi") {
      this.setState({ slideIndex: this.state.slideIndex + 1 });
      this.responseAnswer(type, i);
    } else return console.log("Нет ответа!");
  };

  handlerClickNext = (i, type) => {
    if (this.props.quiz.questions.length > i && this.answer === true) {
      this.checkAnswer(i, type);
      this.props.setActiveAnswer(null);
      answer(
        this.props.index,
        this.props.quiz.questions[i].id,
        ...this.responseAnswer(type, i),
      )
        .then(() => {
          this.props.router.replacePopup(POPOUT_SPINNER);
        })
        .catch((err) => {
          console.log(err, "Error!");
        })
        .finally(() => {
          this.props.router.replacePopup(null);
        });
      this.zeroing();
    } else {
      switch (type) {
        case "single": {
          return this.props.setSnackbar(
            this.snackBar("Выберите один из вариантов ответа!"),
          );
        }
        case "multi": {
          return this.props.setSnackbar(
            this.snackBar("Выберите один, либо несколько вариатов ответа!"),
          );
        }
        case "input" || "text": {
          return this.props.setSnackbar(this.snackBar("Введите текст!"));
        }
        case "file": {
          return this.props.setSnackbar(this.snackBar("Выберите файл!"));
        }
        default: {
          return console.log(
            "Неверно указан тип ответов!(single, multi, input, file)",
          );
        }
      }
    }
  };

  handlerChangeInput = (e) => {
    if (Boolean(e.trim()) === true) {
      this.answer = true;
      this.input = e;
    } else {
      this.answer = null;
    }
  };

  handlerChangeSingle = (i, answer) => {
    this.props.setActiveAnswer(i);
    this.answer = true;
    this.single = answer.id;
  };

  handlerChangeMulti = (checked, id) => {
    this.answer = true;
    if (checked) {
      if (id === 0) {
        this.answerMulti.first = true;
      } else if (id === 1) {
        this.answerMulti.second = true;
      } else if (id === 2) {
        this.answerMulti.third = true;
      }
    } else {
      if (id === 0) {
        this.answerMulti.first = false;
      } else if (id === 1) {
        this.answerMulti.second = false;
      } else if (id === 2) {
        this.answerMulti.third = false;
      }
    }
  };

  handlerChangeFile = (e) => {
    if (e) {
      this.answer = true;
      this.props.setActiveAnswer(0);
      let reader = new FileReader();
      reader.onloadend = () => {
        this.file = { data: reader.result, name: e.name };
      };
      reader.readAsDataURL(e);
    }
  };

  render() {
    const { id, router } = this.props;
    return (
      <Panel id={id}>
        <PanelHeader
          style={{ textAlign: "center", marginBottom: 0 }}
          separator={false}
          left={
            <PanelHeaderButton onClick={() => router.pushPage(PAGE_MAIN)}>
              <Icon24BrowserBack />
            </PanelHeaderButton>
          }
        >
          <img alt="logo" src={logo} height={36} style={{ margin: "0 auto" }} />
        </PanelHeader>
        {!this.props.loading ? (
          <div
            style={{
              background: `linear-gradient(
              rgba(0, 0, 0, 0.2), 
              rgba(0, 0, 0, 0.2)
            )`,
            }}
          >
            <Gallery
              slideIndex={this.state.slideIndex}
              slideWidth="100%"
              align="right"
              style={{ height: "100%", width: "100%" }}
            >
              {this.props.quiz.questions.map((item, quest_number) => (
                <div key={quest_number}>
                  <div
                    className={"quiz-image"}
                    style={{
                      backgroundImage: `linear-gradient(
              rgba(0, 0, 0, 0.3), 
              rgba(0, 0, 0, 0.3)
            ), url(${
              this.props.quiz?.questions[this.state.slideIndex]?.cover ===
                undefined ||
              this.props.quiz.questions[this.state.slideIndex].cover === ""
                ? this.props.quiz.cover
                : "https://rospoll.online/load/opt/" +
                  this.props.quiz.questions[this.state.slideIndex].cover
            })`,
                    }}
                  >
                    <Title
                      level={"2"}
                      weight={"heavy"}
                      align={"center"}
                      style={{
                        color: "white",
                        padding: "10px",
                      }}
                    >
                      {item.title}
                    </Title>
                  </div>

                  <Group header={<Header mode="secondary">Ответ</Header>}>
                    <Div>
                      {item.type === "single" ? (
                        item.answers.map((answer, i) => (
                          <React.Fragment key={i}>
                            <Button
                              size="s"
                              mode={
                                this.props.activeAnswer === i
                                  ? "commerce"
                                  : "overlay_primary"
                              }
                              stretched={"true"}
                              style={{
                                marginBottom: "10px",
                                minHeight: "36px",
                                border: "1px #4986cc",
                                color: "#000000",
                              }}
                              onClick={() =>
                                this.handlerChangeSingle(i, answer)
                              }
                            >
                              <Text>{answer.answer}</Text>
                            </Button>
                          </React.Fragment>
                        ))
                      ) : item.type === "multi" ? (
                        item.answers.map((answer, i) => (
                          <React.Fragment key={i}>
                            <Checkbox
                              stretched={"true"}
                              mode={
                                this.props.activeAnswer === i
                                  ? "commerce"
                                  : "overlay_primary"
                              }
                              style={{
                                marginBottom: "10px",
                                minHeight: "36px",
                                border: "1px solid #4986cc",
                                borderRadius: "10px",
                              }}
                              onChange={(e) =>
                                this.handlerChangeMulti(e.target.checked, i)
                              }
                            >
                              <Text>{answer.answer}</Text>
                            </Checkbox>
                          </React.Fragment>
                        ))
                      ) : item.type === "input" || item.type === "text" ? (
                        <Input
                          size="s"
                          stretched={"true"}
                          style={{
                            marginBottom: "10px",
                            minHeight: "36px",
                            color: "#000000",
                          }}
                          onChange={(e) =>
                            this.handlerChangeInput(e.target.value)
                          }
                          placeholder={item.title}
                        />
                      ) : item.type === "file" ? (
                        <File
                          before={<Icon24Document />}
                          stretched={"true"}
                          size="s"
                          mode={
                            this.props.activeAnswer === 0
                              ? "commerce"
                              : "overlay_primary"
                          }
                          style={{
                            marginBottom: "10px",
                            minHeight: "36px",
                            color: "#000000",
                          }}
                          onChange={(e) =>
                            this.handlerChangeFile(e.target.files[0])
                          }
                        >
                          <Text>Загрузите файл</Text>
                        </File>
                      ) : item.type === "end" ? (
                        <Title
                          level={"3"}
                          weight={"heavy"}
                          align={"center"}
                          style={{
                            color: "black",
                            background: "#fff",
                            margin: "0 80px",
                            padding: "10px 0",
                            borderRadius: "10px",
                          }}
                        >
                          {item.answer}
                        </Title>
                      ) : null}
                      <Button
                        size="s"
                        stretched={"true"}
                        onClick={() =>
                          this.handlerClickNext(quest_number, item.type)
                        }
                        style={{
                          minHeight: "36px",
                          marginBottom: "16px",
                          marginTop: "16px",
                        }}
                      >
                        <div className="d-flex align-center">
                          Продолжить{" "}
                          <Icon24ArrowRightOutline
                            style={{ marginLeft: "8px" }}
                          />
                        </div>
                      </Button>
                    </Div>
                  </Group>
                </div>
              ))}
              <Div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <img
                  alt={"coin"}
                  src={moneyBag}
                  style={{ width: "100px", margin: "20px" }}
                />
                <Title
                  level={"1"}
                  align={"center"}
                  style={{ color: "#ffffff" }}
                >
                  {this.props.quiz.outro}
                </Title>
                <Title
                  level={"3"}
                  align={"center"}
                  style={{ color: "#ffffff", margin: "20px" }}
                >
                  Ваша награда {this.props.quiz.award} баллов
                </Title>

                <Button
                  size="s"
                  className="quiz__end-button"
                  stretched={"true"}
                  onClick={() => this.handlerEnd()}
                >
                  Забрать награду
                </Button>
                <Button
                  size="s"
                  className="quiz__end-button"
                  stretched={"true"}
                  onClick={() => this.handlerEnd()}
                >
                  Завершить
                </Button>
              </Div>
            </Gallery>
          </div>
        ) : (
          <PanelSpinner />
        )}
      </Panel>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    index: state.data.activeQuiz,
    data: state.data.data,
    quiz: state.data.quiz[0],
    activeAnswer: state.data.activeAnswer,
    snackbar: state.data.snackbar,
    notifications: state.data.notifications,
    profile: state.data.profile,
    balance: state.data.balance,
    loading: state.data.loading,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setActiveAnswer,
        setSnackbar,
        removeQuiz,
        setBalance,
      },
      dispatch,
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(QuizCardPanel));
