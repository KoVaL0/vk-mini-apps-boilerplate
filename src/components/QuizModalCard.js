import React, {Component} from "react";
import {withRouter} from "@happysanta/router";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Button, Div, Gallery, Group, ModalPage, ModalPageHeader, Text} from "@vkontakte/vkui";
import {state} from "../store/state";

class AboutCard extends Component {

  constructor(props) {
    super(props)
    this.state = state
  }

  handlerClickNext = () => {
    this.setState({slideIndex: this.state.slideIndex + 1})
  }

  render() {
    return (
      <>
        {console.log(this.state.quiz[this.props.index].header)}
        {console.log("this.props.index")}
        <ModalPage
          id={this.props.id}
          header={<ModalPageHeader>{this.state.quiz[this.props.index].header}</ModalPageHeader>}
          onClose={() => this.props.router.popPage()}
        >
          <Div>
            <Gallery
              slideIndex={this.state.slideIndex}
              slideWidth="100%"
              align="right"
              style={{width: '100%', height: '100%'}}
            >
              {this.state.quiz[this.props.index].questions.map((item, i) => (
                <div key={i}>
                  <Text align={"center"}>{item.title}</Text>
                  <Group style={{padding: "20px 40px"}}>
                    {item.answer.map((answer, i) => (
                      <>
                        <Button
                          key={i}
                          size="s"
                          mode={"outline"}
                          stretched
                        >
                          {answer}
                        </Button>
                      </>
                    ))}
                  </Group>
                </div>
              ))}
            </Gallery>
            <Button
              size="s"
              stretched
              style={{margin: '16px auto 0 auto'}}
              onClick={() => this.handlerClickNext()}
            >
              Продолжить
            </Button>
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
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({}, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(AboutCard));