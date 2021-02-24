import axios from "../interceptor";
/**
 * @param {number} poll - id опроса
 * @param {number} question - id вопроса
 * @param {number | Array.number | string} result - id ответа ИЛИ массив с id ответов ИЛИ строка-ответ
 */
export const answer = (poll, question, result) => {
  return axios.post("", {
    method: "polls.answer",
    params: { poll, question, result },
  });
};
