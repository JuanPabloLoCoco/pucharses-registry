import cors from "cors";
import express from "express";
import morgan from "morgan";
import { DatabaseInterface } from "./database/types";
import comboRoutes from "./routes/Combos/Combos.routes";
import foodRoutes from "./routes/Food/Food.routes";
import pucharseRouter from "./routes/Pucharses/Pucharses.routes";
import summariesRoutes from "./routes/Summaries/Summaries.routes";

export default function makeApp(database: DatabaseInterface) {
  const app = express();

  app.use(morgan("dev"));
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(foodRoutes(database));
  app.use(comboRoutes(database));
  app.use(pucharseRouter(database));
  app.use(summariesRoutes(database));
  return app;
}
