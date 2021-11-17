import { Router } from "express";
import { check } from "express-validator";
import { DatabaseInterface } from "../../database/types";
import pucharseController from "./Pucharses.controller";

const pucharseRouter = (database: DatabaseInterface) => {
  const router = Router({});
  const controller = pucharseController(database);

  router.post(
    "/pucharses",
    check("combos").isArray({ min: 1 }),
    check("combos.*.quantity")
      .isNumeric()
      .custom((value) => value > 0),
    check("combos.*.id")
      .notEmpty()
      .custom((value) => {
        return database.getComboById(value).then((comboFound) => {
          if (comboFound == null) {
            return Promise.reject(`Combo with id ${value} is invalid`);
          }
          return Promise.resolve();
        });
      }),
    controller.createPucharse
  );
  return router;
};

export default pucharseRouter;
