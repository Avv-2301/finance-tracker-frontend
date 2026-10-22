import { expenseCategories } from "../../data/categories.js";

export const methodChartColors = Object.freeze({
  UPI: "#ccff00",
  "Debit Card": "#4cd7f6",
  "Credit Card": "#d0bcff",
  Cash: "#ff9f6e",
});

export const categoryChartColors = Object.freeze(
  Object.fromEntries(
    expenseCategories.map((category, index) => [
      category,
      `hsl(${Math.round((index * 137.508) % 360)} 74% 62%)`,
    ]),
  ),
);
