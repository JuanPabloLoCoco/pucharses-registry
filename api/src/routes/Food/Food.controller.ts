import { RequestHandler } from "express";
import { InjectedComponent } from "../types";

export interface FoodControllerMethods {
  createFood: RequestHandler;
  listFood: RequestHandler;
  updateFoodById: RequestHandler;
}

const foodController: InjectedComponent<FoodControllerMethods> = (database) => {
  return {
    createFood: (req, res) => {
      let foodName: string = req.body["label"] || "";
      if (foodName === "") {
        return res.status(400).json({
          message: "label is required",
        });
      }
      return database
        .createFood({ label: foodName })
        .then((createdFood) => {
          return res.json({
            message: "Food created",
            food: createdFood,
          });
        })
        .catch((err) => {
          return res.status(500).json({
            message: err.message,
            messageCode: "internal error",
          });
        });
    },
    listFood: (req, res) => {
      return database.listFood().then((foods) => {
        return res.json({
          foods: foods,
        });
      });
    },
    updateFoodById: (req, res) => {
      const id = req.params.id;
      let foodName: string = req.body["label"] || "";
      if (foodName === "") {
        return res.status(400).json({
          message: "label is required",
        });
      }
      return database.getFoodById(id).then((foodFound) => {
        if (foodFound == null) {
          return res.status(400).json({
            message: "Food not found",
          });
        }
        return database.editFood({ label: foodName, id: id }).then(() => {
          return res.json({
            message: `Food was updated`,
          });
        });
      });
    },
  };
};

export default foodController;
