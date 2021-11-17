import { Router } from "express";
import { DatabaseInterface } from "../../database/types";
import foodController from "./Food.controller";

const foodRouter = (database: DatabaseInterface) => {
  const router = Router({});
  const controller = foodController(database);

  router.post("/foods", controller.createFood);
  router.get("/foods", controller.listFood);
  router.put("/foods/:id", controller.updateFoodById);
  // router.delete(
  //   "/foods/:id",
  //   param("id").custom((value) => {
  //     return database.getFoodById(value).then((foodFound) => {
  //       if (foodFound == null) {
  //         return Promise.reject("food not found");
  //       }
  //       return Promise.resolve();
  //     });
  //   }),
  //   controller.removeFoodById
  // );

  return router;
};

export default foodRouter;
