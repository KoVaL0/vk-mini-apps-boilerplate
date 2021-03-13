import axios from "../interceptor";
/**
 * @param {number} poll - id опроса
 * @param {number} question - id вопроса
 * @param {number | Array.number | string} result - id ответа ИЛИ массив с id ответов ИЛИ строка-ответ
 * @param {string} file - имя файла
 */
export const answer = (poll, question, result, file) => {
  return axios.post("", {
    method: "polls.answer",
    params: { poll, question, answer: result, file },
  });
};
