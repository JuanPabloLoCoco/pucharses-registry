import { Router } from "express";
import { DatabaseInterface } from "../../database/types";
import comboController from "./Combos.controller";
import { body, check, param } from "express-validator";

const BASE = "/combos";
const comboRoutes = (database: DatabaseInterface) => {
  const router = Router({});
  const controller = comboController(database);

  router.post(
    BASE,
    body("price")
      .isNumeric()
      .custom((value) => value > 0),
    body("label").not().isEmpty().trim().escape(),
    check("foods").isArray({ min: 1 }),
    check("foods.*.quantity")
      .isNumeric()
      .custom((value) => value > 0),
    check("foods.*.id")
      .notEmpty()
      .custom((value) => {
        return database.getFoodById(value).then((foodFound) => {
          if (foodFound == null) {
            return Promise.reject(`Food with id ${value} is invalid`);
          }
          return Promise.resolve();
        });
      }),

    controller.createCombo
  );

  router.get(BASE, controller.listCombos);

  router.delete(
    "/combos/:id",
    param("id").custom((value) => {
      return database.getComboById(value).then((comboFound) => {
        if (comboFound == null) {
          return Promise.reject(`Combo with id ${value} not found`);
        }
        return Promise.resolve();
      });
    }),
    controller.removeCombo
  );

  router.put(
    "/combos/:id",
    // Validar comboId
    param("id").custom((value) => {
      return database.getComboById(value).then((comboFound) => {
        if (comboFound == null) {
          return Promise.reject(`Combo with id ${value} not found`);
        }
        return Promise.resolve();
      });
    }),
    // validat Price
    body("price")
      .isNumeric()
      .custom((value) => value > 0),
    // Validar label
    body("label").not().isEmpty().trim().escape(),
    // Validar que el array de comidas sea mayor a 0
    check("foods").isArray({ min: 1 }),
    // Validar que las cantidades de comidas sean mayores a 0
    check("foods.*.quantity")
      .isNumeric()
      .custom((value) => value > 0),
    // Validar que los id de comidas sean de comidas existentes
    check("foods.*.id")
      .notEmpty()
      .custom((value) => {
        return database.getFoodById(value).then((foodFound) => {
          if (foodFound == null) {
            return Promise.reject(`Food with id ${value} is invalid`);
          }
          return Promise.resolve();
        });
      }),
    controller.updateCombo
  );

  return router;
};

const router = Router({});
export default comboRoutes;
