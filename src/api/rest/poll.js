import axios from "../interceptor";

export const poll = (id) => {
  return axios.post("", { method: "polls.get", params: { id } });
};
