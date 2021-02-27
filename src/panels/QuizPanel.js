import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Title,
  Button,
  Div,
  CardGrid,
  ScreenSpinner,
  Placeholder,
} from "@vkontakte/vkui";
import {withRouter} from "@happysanta/router";
import {PAGE_MAIN, PAGE_QUIZ_CARD, POPOUT_SPINNER} from "../router";
import "./quiz.css";
import {
  Icon24BrowserBack,
  Icon56ErrorOutline,
  Icon56InfoOutline,
  Icon56RecentOutline
} from "@vkontakte/icons";
import logo from "../img/logo.png";
import {poll} from "../api";
import {setData} from "../store/data/actions";

class QuizPanel extends React.Component {

  constructor(props) {
    super(props);
    this.id = window.location.hash.split("/")[2].split("?")[0]
    this.quiz = this.props.data.quiz[this.id]
    this.state = {
      loading: false
    }
    this.error = false
    this.emptyArr = false
  }

  componentDidMount() {
    this.props.router.replacePopup(POPOUT_SPINNER)
    poll(+(this.id + 1))
      .then(async (res) => {
        console.log(res)
        if (!res.data.result.polls[this.id]?.questions) {
          this.emptyArr = true
          this.props.router.replacePopup(null)
          return
        }
        if (!this.state.loading) {
          this.props.setData(res.data.result.polls)
          this.props.router.replacePopup(null)
          this.setState({loading: true})
        }
      })
      .catch((e) => {
        console.log(e)
        this.error = true
        this.props.router.replacePopup(null)
      });
  }

  render() {
    const {id, router,} = this.props;
    const popout = (() => {
      if (router.getPopupId() === POPOUT_SPINNER) {
        return <ScreenSpinner/>
      }
    })

    return (
      <Panel id={id}>
        <PanelHeader
          style={{textAlign: "center"}}
          separator={false}
          popout={popout}
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
        {this.state.loading ?
          <div>
            <div>
              <CardGrid size="l" className={"quiz-image"}
                        style={{backgroundImage: `url(${this.quiz.cover})`}}>
              </CardGrid>
              <Div>
                <Title level="2" weight={"bold"}>
                  {this.quiz.title}
                </Title>
              </Div>
              <Div style={{display: "flex", justifyContent: "space-around"}}>
                <div style={{display: "flex", alignItems: "center", fontSize: "14px"}}>
                  <Icon56InfoOutline width={18} height={18} style={{marginRight: "8px"}}/>
                  {this.quiz?.questions?.length} вопросов
                </div>
                <div style={{display: "flex", alignItems: "center", fontSize: "14px"}}>
                  <Icon56RecentOutline width={18} height={18} style={{marginRight: "8px"}}/>
                  {this.quiz.time / 60} мин.
                </div>
              </Div>
              <Div>
                {this.quiz.description}
              </Div>
            </div>
            <Div align={"center"}>
              <Button
                stretched={"true"}
                size="l"
                mode={"commerce"}
                onClick={() => {
                  router.pushPage(PAGE_QUIZ_CARD)
                }}>
                Начать опрос
              </Button>
            </Div>
          </div>
          : null}
        {this.error &&
          <Placeholder icon={<Icon56ErrorOutline />} header="Ошибка">
          Что-то пошло не так, попробуйте обновить.
          </Placeholder>
        }
        {this.emptyArr &&
        <Placeholder icon={<Icon56ErrorOutline />} header="Ошибка">
          Нет элементов
        </Placeholder>
        }
      </Panel>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    activeQuiz: state.data.activeQuiz,
    data: state.data.data,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({
      setData
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QuizPanel));
