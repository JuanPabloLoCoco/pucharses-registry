import { RequestHandler } from "express";
import { DatabaseInterface } from "../../database/types";
import { Food } from "../../models/types";
import { InjectedComponent } from "../types";

export interface SummariesControllerMethods {
  getSummary: RequestHandler;
}

interface FoodItem {
  food: Food;
  quantity: number;
}

const summariesController: InjectedComponent<SummariesControllerMethods> = (
  database: DatabaseInterface
) => {
  return {
    getSummary: (req, res) => {
      return database
        .getSummary()
        .then((summary) => {
          let answer: { foods: FoodItem[]; gain: number } = {
            foods: [],
            gain: summary.gain,
          };
          let foods: FoodItem[] = [];
          let foodIds = Object.keys(summary.foods);
          for (let i = 0; i < foodIds.length; i++) {
            let foodId = foodIds[i];
            let element = summary.foods[foodId];
            foods.push(element);
          }
          answer.foods = foods;
          return res.status(200).json({
            summary: answer,
          });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({
            message: "Internal server error",
            messageError: err.message,
          });
        });
    },
  };
};

export default summariesController;
