import { Router } from "express";
import { DatabaseInterface } from "../../database/types";
import summariesController from "./Summaries.controller";

const summariesRoutes = (database: DatabaseInterface) => {
  const router = Router({});
  const controller = summariesController(database);

  router.get("/summary", controller.getSummary);
  return router;
};

export default summariesRoutes;
