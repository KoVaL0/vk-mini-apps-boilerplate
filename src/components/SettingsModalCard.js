import {
  Alert,
  Button,
  Select,
  FormItem,
  SelectMimicry,
  FormLayout,
  Group,
  ModalCard,
  Div,
} from "@vkontakte/vkui";
import React, { Component } from "react";
import { useRouter, withRouter } from "@happysanta/router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setCountry, setCity, setSex } from "../store/data/actions";
import { account } from "./../api/rest/account";

class SettingsModalCard extends Component {
  constructor(props) {
    super(props);
    this.city = this.props.profile.city.title;
    this.country = this.props.profile.country.title;
    this.sex = this.props.profile.sex;
  }

  handlerClick = () => {
    try {
      const data = {
        name: this.props.profile.first_name,
        surname: this.props.profile.last_name,
        bdate: this.props.profile.bdate,
        photo: this.props.profile.photo_200,
        tamezone: this.props.profile.timezone,
        city: this.props.profile.city,
        country: this.props.profile.country,
        sex: this.props.profile.sex,
      };
      this.props.setCity(this.city);
      this.props.setCountry(this.country);
      this.props.setSex(this.sex);
      console.log(data);
      account(data).catch((e) => {
        this.props.router.popPage();
      });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <ModalCard
        id={this.props.id}
        onClose={() => this.props.router.popPage()}
        header="Настройки профиля"
      >
        <FormLayout>
          <FormItem top="Страна">
            <Select
              onChange={(e) => {
                this.country = { id: 0, title: e.target.value };
              }}
              placeholder="Выберите страну"
              options={[
                {
                  value: "Россия",
                  label: "Россия",
                },
                {
                  value: "Беларусь",
                  label: "Беларусь",
                },
              ]}
            />
          </FormItem>
          <FormItem top="Город">
            <Select
              onChange={(e) => (this.city = { id: 0, title: e.target.value })}
              placeholder="Выберите город"
              options={this.props.cities}
            />
          </FormItem>
          <FormItem top="Пол" style={{ marginBottom: "5px" }}>
            <Select
              onChange={(e) => {
                this.sex = {
                  id: e.target.value,
                  title: e.target.value === 1 ? "Женский" : "Мужской",
                };
              }}
              placeholder="Выберите пол"
              options={[
                {
                  value: 2,
                  label: "Мужской",
                },
                {
                  value: 1,
                  label: "Женский",
                },
              ]}
            />
          </FormItem>
          <FormItem>
            <Button
              stretched={"true"}
              size={"m"}
              onClick={() => {
                this.handlerClick();
              }}
            >
              Потвердить
            </Button>
          </FormItem>
        </FormLayout>
      </ModalCard>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.data.profile,
    cities: state.data.cities,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators(
      {
        setCountry,
        setCity,
        setSex,
      },
      dispatch,
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(SettingsModalCard));
