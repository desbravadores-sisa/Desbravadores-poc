import { COLUMN_TITLES } from "../constants";

export function createEmptyBoard() {
  return COLUMN_TITLES.reduce((accumulator, title) => {
    accumulator[title] = [];
    return accumulator;
  }, {});
}

export function normalizeBoardData(data = {}) {
  return COLUMN_TITLES.reduce((accumulator, title) => {
    accumulator[title] = Array.isArray(data[title]) ? data[title] : [];
    return accumulator;
  }, {});
}
