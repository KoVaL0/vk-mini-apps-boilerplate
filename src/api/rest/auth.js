import axios from "../interceptor";

export const auth = (url) => {
  return axios.post("", { method: "account.auth", params: { url } });
};
