import React, { Component } from "react";
import { withRouter } from "@happysanta/router";
import { connect } from "react-redux";
import {
  setBalance,
  setSnackbar,
} from "../store/data/actions";
import { bindActionCreators} from "redux";
import { Button, Div, FormItem, Input, ModalCard, Radio, Snackbar, Text } from "@vkontakte/vkui";
import { Icon20CheckCircleFillGreen, Icon16ErrorCircleFill } from "@vkontakte/icons";
import { withdrawal } from "../api/rest/withdrawal";

class PayModalCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeValue: "phone",
      phone: "",
      card: "",
      month: "",
      year: "",
    }
  }

  snackBar = (text) => {
    return (
      <Snackbar
        onClose={() => this.props.setSnackbar(null)}
        duration={2500}
        before={<Icon16ErrorCircleFill width={24} height={24}/>}
        onClick={() => this.props.setSnackbar(null)}
      >
        {text}
      </Snackbar>
    );
  };

  pay = (type, detail) => {
    withdrawal(type, detail)
      .then(() => {
        this.props.setBalance(0);
        this.props.setSnackbar(
          <Snackbar
            onClose={() => this.props.setSnackbar(null)}
            duration={2500}
            before={<Icon20CheckCircleFillGreen width={24} height={24}/>}
            onClick={() => this.props.setSnackbar(null)}
          >
            Поздравляем! Баллы успешно выведены!
          </Snackbar>
        );
      })
      .catch(e => console.log(e));
  }

  handlerChangePhone = (e) => {
    if (/[0-9]|-|\(|\)|\+$/.test(e)) {
      if (e.length > this.state.phone.length) {
        if (/^$/.test(this.state.phone))
          return this.setState({phone: "+"})
        if (e.length === 2)
          return this.setState({phone: e + "("})
        if (e.length === 5)
          return this.setState({phone: e + ")-"})
        if (e.length === 10)
          return this.setState({phone: e + "-"})
        if (e.length === 13)
          return this.setState({phone: e + "-"})
        this.setState({phone: e});
      } else {
        this.setState({phone: e});
      }
    }
  }

  handlerChangeCard = (e) => {
    if (/\d*$/.test(e)) {
      if (e.length > this.state.card.length) {
        if (e.length === 4)
          return this.setState({card: e + "-"})
        if (e.length === 9)
          return this.setState({card: e + "-"})
        if (e.length === 14)
          return this.setState({card: e + "-"})
        this.setState({card: e});
      } else {
        this.setState({card: e});
      }
    }
  }

  handlerSubmit = () => {
    if (this.props.balance > 0) {
      if (this.state.activeValue === "phone") {
        if (/^\+\d\(\d{2}\)-\d{3}-\d{2}-\d{2}$/.test(this.state.phone)) {
          this.pay(1, this.state.phone)
          this.props.router.popPage();
        } else {
          this.props.setSnackbar(
            this.snackBar("Введите номер телефона в формате +7(xx)-xxx-xx-xx"),
          );
        }
      } else if (this.state.activeValue === "card") {
        if (/\d{4}-\d{4}-\d{4}-\d{4}$/.test(this.state.card)) {
          this.pay(3, this.state.card)
          this.props.router.popPage();
        } else {
          this.props.setSnackbar(
            this.snackBar("Введите номер карты в формате xxxx-xxxx-xxxx-xxxx"),
          );
        }
      } else if (this.state.activeValue === "qiwi") {
        if (/\d{4}-\d{4}-\d{4}-\d{4}$/.test(this.state.phone)) {
          this.pay(2, this.state.phone)
          this.props.router.popPage();
        } else {
          this.props.setSnackbar(
            this.snackBar("Введите номер кошелька в формате +7(xx)-xxx-xx-xx"),
          );
        }
      }
    } else {
      this.props.setSnackbar(
        this.snackBar("Не хватает для вывода средств!")
      );
    }
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
            <Radio name="radio" value="phone" defaultChecked onClick={(e) => this.setState({activeValue: e.target.value})}>Телефон</Radio>
            <Radio name="radio" value="qiwi" onClick={(e) => this.setState({activeValue: e.target.value})}>QIWI</Radio>
            <Radio name="radio" value="card" onClick={(e) => this.setState({activeValue: e.target.value})} style={{marginBottom: "20px"}}>Номер карты</Radio>
            {this.state.activeValue === "phone" ?
              <Input
                type="text"
                value={this.state.phone}
                maxLength="16"
                placeholder={"Введите номер телефона"}
                onChange={(e) => this.handlerChangePhone(e.target.value)}
              />
               : (this.state.activeValue === "qiwi") ? <Input
                  type="text"
                  maxLength="16"
                  value={this.state.phone}
                  placeholder={"Введите номер кошелька"}
                  onChange={(e) => this.handlerChangePhone(e.target.value)}
                /> : <Input
                type="text"
                maxLength="19"
                value={this.state.card}
                placeholder={"Введите номер карты"}
                onChange={(e) => this.handlerChangeCard(e.target.value)}
              />

            }
          </FormItem>
          <Text style={{marginBottom: "20px"}}>
            Вывод средств будет
            реализован через несколько месяцев. Все баллы за пройденные опросы
            сохраняются, обменять их можно будет совсем скоро.
          </Text>
          <Button stretched onClick={() => this.handlerSubmit()}>
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
    ...bindActionCreators({
      setSnackbar,
      setBalance,
    }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(PayModalCard));
