import { DatabaseInterface } from "../database/types";

export type InjectedComponent<T> = (database: DatabaseInterface) => T;
