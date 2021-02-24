import axios from "../interceptor";

export const polls = () => {
  return axios.post("", { method: "polls.get", params: {} });
};
