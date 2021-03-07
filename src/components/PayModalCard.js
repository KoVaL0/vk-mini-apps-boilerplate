import React, { Component } from "react";
import { withRouter } from "@happysanta/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {Button, Div, FormItem, Input, ModalCard, SliderSwitch, Text} from "@vkontakte/vkui";

class PayModalCard extends Component {

  constructor(props) {
    super(props);
    this.state = {activeValue: "phone"}
  }

  render() {
    return (
      <ModalCard
        id={this.props.id}
        onClose={() => this.props.router.popPage()}
        header="Вывод средств"
      >
        <Div>
          <Text>
            К выводу доступно {this.props.balance} баллов.
          </Text>
          <FormItem top="Тип вывода">
            <SliderSwitch
              style={{marginBottom: "20px"}}
              activeValue={this.state.activeValue}
              onSwitch={value => this.setState({activeValue: value})}
              options={[
                {
                  name: 'Телефон',
                  value: 'phone',
                },
                {
                  name: 'Номер карты',
                  value: 'card',
                },
              ]}
            />
            {this.state.activeValue === "phone" ?
            <Input
              type="text"
              placeholder={"Введите номер телефона"}
            />
            : <div>
                <Input
                type="text"
                placeholder={"Введите номер карты"}
                style={{marginBottom: "20px"}}
              />
              <div style={{display: "flex", width: "100px", marginLeft: "auto"}}>
                <Input
                  type="text"
                  placeholder={"М"}
                  align={"center"}
                />
                <Text style={{margin: "auto 5px"}} weight={"semibold"}>/</Text>
                <Input
                  type="text"
                  placeholder={"Г"}
                  align={"center"}
                />
              </div>

            </div>

            }
          </FormItem>
          <Text style={{ marginBottom: "20px" }}>
            Вывод средств будет
            реализован через несколько месяцев. Все баллы за пройденные опросы
            сохраняются, обменять их можно будет совсем скоро.
          </Text>
          <Button stretched onClick={() => this.props.router.popPage()}>
            Понятно
          </Button>
        </Div>
      </ModalCard>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    balance: state.data.balance,
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
)(withRouter(PayModalCard));
