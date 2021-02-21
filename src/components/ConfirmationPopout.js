import {Alert, Button, Caption, Card, Div, Text} from '@vkontakte/vkui';
import React from 'react';
import {useRouter} from '@happysanta/router';
import {connect} from 'react-redux';
import {Icon20UsersOutline} from "@vkontakte/icons";
import {bindActionCreators} from "redux";
import {setNotifications} from "../store/data/actions";

function Confirm(props) {

  const router = useRouter();
  const handlerClick = () => {
    router.replacePopup(null)
    router.popPage()
  }

  return (
    <Alert
      actions={[
        {
          title: 'Закрыть',
          autoclose: true,
          mode: 'cancel',
        },
      ]}
      onClose={() => handlerClick()}
    >
      <h2>Вы ещё не подписаны на уведомления!</h2>
      <Card className={`history ${props.notifications ? 'active' : 'disabled'}`}>
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
            {!props.notifications
              ? 'Уведомления выключены'
              : 'Уведомления включены'}
          </Text>
          <Button
            size="s"
            stretched={"true"}
            className="action-button"
            onClick={() => {
              props.setNotifications(!props.notifications)
              handlerClick()
            }}
          >
            {props.notifications ? 'Отключить' : 'Включить'}
          </Button>
        </Div>
      </Card>
    </Alert>
  );
}

const mapStateToProps = (state) => {
  return {
    notifications: state.data.notifications,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({
      setNotifications,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Confirm);
