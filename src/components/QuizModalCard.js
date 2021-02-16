import React, {Component} from "react";
import {withRouter} from "@happysanta/router";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {setSnackbar, setActiveAnswer} from "../store/data/actions"
import {
  Button,
  Div,
  Gallery,
  Group,
  ModalPage,
  ModalPageHeader,
  Text,
  Input,
  Checkbox,
  File,
} from "@vkontakte/vkui";
import {Snackbar} from "@vkontakte/vkui/dist/index"
import {state} from "../store/state";
import axios from "axios";
import {POPOUT_CONFIRM, POPOUT_SPINNER,} from "../router";
import {Icon24Document} from "../../node_modules/@vkontakte/icons"
import {Icon16ErrorCircleFill} from "@vkontakte/icons";


class AboutCard extends Component {

  constructor(props) {
    super(props)
    this.state = state
    this.quiz = this.state.quiz[window.location.hash.split("/")[2].split("?")[0]]
    this.answer = null
    this.data = {
      answer: {}
    }
    this.input = ""
    this.single = ""
    this.file = null
    this.answerMulti = {
      first: false,
      second: false,
      third: false,
    }
  }

  snackBar = (text) => {
    return (
      <Snackbar
        onClose={() => (this.props.setSnackbar(null))}
        duration={2500}
        before={<Icon16ErrorCircleFill width={24} height={24}/>}
        onClick={() => (this.props.setSnackbar(null))}
      >
        {text}
      </Snackbar>
    )
  }

  zeroing = () => {
    this.answer = null
    this.answerMulti = {
      first: false,
      second: false,
      third: false,
    }
    this.input = ""
    this.file = ""
    this.single = ""
  }

  responseAnswer = (type, i) => {
    switch (type) {
      case ("single"): {
        return this.data.answer[i] = this.single
      }
      case ("input"): {
        return this.data.answer[i] = this.input
      }
      case ("file"): {
        return this.data.answer[i] = this.file
      }
      case ("multi"): {
        return this.data.answer[i] = {...this.answerMulti}
      }
      default: {
        return console.log(`Неверно указан тип ответов!(single, multi, input, file) Ваш тип ${type}`)
      }
    }
  }

  checkAnswer = (i, type) => {
    if (type === "multi" && (this.answerMulti.first || this.answerMulti.second || this.answerMulti.third)) {
      this.responseAnswer("multi", i)
      this.setState({slideIndex: this.state.slideIndex + 1})
    } else if (type !== "multi") {
      this.setState({slideIndex: this.state.slideIndex + 1})
      this.responseAnswer(type, i)
    } else return console.log("Нет ответа!")
  }

  handlerClickNext = (i, type) => {
    if (this.quiz.questions.length - 1 > i && this.answer === true) {
      this.props.setActiveAnswer(null)
      this.checkAnswer(i, type)
      this.zeroing()
    } else if (this.quiz.questions.length - 1 === i && this.answer === true) {
      this.checkAnswer(i, type)
      this.props.setActiveAnswer(null)
      this.zeroing()
      console.log(this.data)
      console.log("this.data")
      axios.post("", this.data) // Указать url отправки ответа
        .then(() => {
          this.props.router.replacePopup(POPOUT_SPINNER)
        })
        .catch((err) => {
          console.log(err, "Error!")
        })
        .finally(() => {
          this.props.router.replacePopup(POPOUT_CONFIRM)
        })
    } else {
      switch (type) {
        case ("single"): {
          return this.props.setSnackbar(this.snackBar("Выберите один из вариантов ответа!"))
        }
        case ("multi"): {
          return this.props.setSnackbar(this.snackBar("Выберите один, либо несколько вариатов ответа!"))
        }
        case ("input"): {
          return this.props.setSnackbar(this.snackBar("Введите текст!"))
        }
        case ("file"): {
          return this.props.setSnackbar(this.snackBar("Выберите файл!"))
        }
        default: {
          return console.log("Неверно указан тип ответов!(single, multi, input, file)")
        }
      }
    }
  }

  handlerChangeInput = (e) => {
    if (Boolean(e.trim()) === true) {
      this.answer = true
      this.input = e
    } else {
      this.answer = null
    }
  }


  handlerChangeSingle = (i, answer) => {
    this.props.setActiveAnswer(i)
    this.answer = true
    this.single = answer
  }

  handlerChangeMulti = (checked, id) => {
    this.answer = true
    if (checked) {
      if (id === 0) {
        this.answerMulti.first = true
      } else if (id === 1) {
        this.answerMulti.second = true
      } else if (id === 2) {
        this.answerMulti.third = true
      }
    } else {
      if (id === 0) {
        this.answerMulti.first = false
      } else if (id === 1) {
        this.answerMulti.second = false
      } else if (id === 2) {
        this.answerMulti.third = false
      }
    }
  }

  handlerChangeFile = (e) => {
    if (e) {
      this.answer = true
      this.file = e
    }
  }

  render() {
    return (
      <>
        <ModalPage
          id={this.props.id}
          header={<ModalPageHeader>{this.quiz.header}</ModalPageHeader>}
          onClose={() => this.props.router.popPage()}
        >
          <Div>
            <Gallery
              slideIndex={this.state.slideIndex}
              slideWidth="100%"
              align="right"
              style={{width: '100%', height: '100%'}}
            >
              {this.quiz.questions.map((item, quest_number) => (
                <div key={quest_number}>
                  <Text align={"center"}>{item.title}</Text>
                  {this.props.snackbar}
                  <Group style={{padding: "20px 0"}}>
                    {item.answer.map((answer, i) => (
                      <React.Fragment key={i}>
                        {(item.type === "single") ? (
                          <Button
                            size="s"
                            mode={(this.props.activeAnswer === i) ? "commerce" : "outline"}
                            stretched={"true"}
                            style={{marginBottom: "10px", minHeight: "36px"}}
                            onClick={() => (this.handlerChangeSingle(i, answer))}
                          >
                            {answer}
                          </Button>
                        ) : (item.type === "multi") ? (
                          <Checkbox
                            stretched={"true"}
                            style={{
                              marginBottom: "10px",
                              minHeight: "36px",
                              border: "1px solid #4986cc",
                              borderRadius: "10px"
                            }}
                            onChange={(e) => (this.handlerChangeMulti(e.target.checked, i))}
                          >
                            {answer}
                          </Checkbox>
                        ) : (item.type === "input") ? (
                          <Input
                            size="s"
                            stretched={"true"}
                            style={{marginBottom: "10px", minHeight: "36px"}}
                            onChange={(e) => (this.handlerChangeInput(e.target.value))}
                            placeholder={answer}
                          />
                        ) : (item.type === "file") ? (
                          <File
                            before={<Icon24Document/>}
                            stretched={"true"}
                            size="s"
                            mode={(this.props.activeAnswer === i) ? "commerce" : "outline"}
                            style={{marginBottom: "10px", minHeight: "36px"}}
                            onChange={(e) => (this.handlerChangeFile(e.target.files[0]))}
                          >
                            {answer}
                          </File>
                        ) : null}
                      </React.Fragment>
                    ))}
                  </Group>
                  <Button
                    size="s"
                    stretched={"true"}
                    onClick={() => this.handlerClickNext(quest_number, item.type)}
                    style={{minHeight: "36px"}}
                  >
                    {(this.quiz.questions.length - 1 > quest_number) ? "Продолжить" : "Завершить"}
                  </Button>
                </div>

              ))}
            </Gallery>
          </Div>
        </ModalPage>
        ))}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    index: state.data.activeQuiz,
    activeAnswer: state.data.activeAnswer,
    snackbar: state.data.snackbar,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({setActiveAnswer, setSnackbar}, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(AboutCard));
