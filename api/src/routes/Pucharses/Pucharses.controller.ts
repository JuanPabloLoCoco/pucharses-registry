import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { PucharseItem } from "../../database/types";
import { InjectedComponent } from "../types";

export interface PucharseControllerMethods {
  createPucharse: RequestHandler;
}

const pucharseController: InjectedComponent<PucharseControllerMethods> = (
  database
) => {
  return {
    createPucharse: (req, res) => {
      const body = req.body || {};
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let pucharseCombos: PucharseItem[] = body["combos"];
      return Promise.resolve(database.createPucharse(pucharseCombos))
        .then((newId) => {
          return res.status(200).json({
            message: `Pucharse with id ${newId} was created`,
          });
        })
        .catch((err: Error) => {
          return res.status(500).json({
            message: "Internal Server Error",
            messageError: err.message,
          });
        });
    },
  };
};

export default pucharseController;
