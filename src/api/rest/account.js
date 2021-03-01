import axios from "../interceptor";

export const account = (obj) => {
  return axios.post("", { method: "account.edit", params: { ...obj } });
};
