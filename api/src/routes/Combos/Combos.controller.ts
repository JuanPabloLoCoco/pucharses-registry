import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { CreateComboQueryParams } from "../../database/types";
import { Combo } from "../../models/types";
import { InjectedComponent } from "../types";

export interface ComboControllerMethods {
  createCombo: RequestHandler;
  listCombos: RequestHandler;
  removeCombo: RequestHandler;
  updateCombo: RequestHandler;
}

interface CreateComboRequestParams {
  foods: { id: string; quantity: number }[];
  price: number;
  label: string;
}

const comboController: InjectedComponent<ComboControllerMethods> = (
  database
) => {
  return {
    createCombo: (req, res) => {
      let body = req.body || {};
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const comboToCreate: CreateComboRequestParams = {
        foods: body["foods"],
        price: body["price"],
        label: body["label"],
      };
      return database
        .createCombo(comboToCreate)
        .then((comboCreated) => {
          return res.json({ message: "Combo created", combo: comboCreated });
        })
        .catch((err) => {
          return res.status(500).json({
            messageCode: "Internal Server error",
            message: err.message,
          });
        });
    },
    listCombos: (req, res) => {
      return database.listCombos().then((combos) => {
        return res.json({
          combos: combos,
        });
      });
    },
    removeCombo: (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let id: string = req.params.id;
      return database
        .removeCombo(id)
        .then((value) => {
          return res.status(200).json({
            message: `Combo with id ${id} was deleted`,
          });
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).json({
            message: "Internal server error",
            messageError: error.message,
          });
        });
    },
    updateCombo: (req, res) => {
      const errors = validationResult(req);
      let body = req.body || {};
      let comboId = req.params.id;
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const comboToEdit: CreateComboQueryParams = {
        foods: body["foods"],
        price: body["price"],
        label: body["label"],
      };
      return database
        .editCombo(comboToEdit, comboId)
        .then((value) => {
          return res.status(200).json({
            message: `Combo with id ${comboId} was updated`,
          });
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).json({
            message: "Internal server error",
            messageError: error.message,
          });
        });
    },
  };
};

export default comboController;
