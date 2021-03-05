import React, { Component } from "react";
import { withRouter } from "@happysanta/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Div, ModalCard, Text } from "@vkontakte/vkui";

class PayModalCard extends Component {
  render() {
    return (
      <ModalCard
        id={this.props.id}
        onClose={() => this.props.router.popPage()}
        header="Вывод средств"
      >
        <Div>
          <Text style={{ marginBottom: "20px" }}>
            К выводу доступно {this.props.balance} баллов. Вывод средств будет
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
