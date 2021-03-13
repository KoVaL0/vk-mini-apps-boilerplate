import axios from "../interceptor";
/**
 * @param {number} type - 1=телефон, 2=qiwi, 3=банковская карта
 * @param {string} details - номер телефона / кошелька
 */
export const withdrawal = (type, details) => {
  return axios.post("", {
    method: "withdraw.add",
    params: { type, details },
  });
};
