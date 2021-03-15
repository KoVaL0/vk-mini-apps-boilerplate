import React, { Component } from "react";
import { withRouter } from "@happysanta/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ModalCard,} from "@vkontakte/vkui";

class InfoCard extends Component {
  render() {
    return (
      <ModalCard
        id={this.props.id}
        onClose={() => this.props.router.popPage()}
        header="О приложении"
        subheader="Росопрос - приложение созданное для сбора статистики ответов населения на интересующие нас вопросы.
        Проходя опросы, вы можете получать баллы, которые в последствии можно выводить в реальные рубли.
        Помогайте улучшать вашу жизнь и получайте за это деньги!"
      >
      </ModalCard>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
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
)(withRouter(InfoCard));
