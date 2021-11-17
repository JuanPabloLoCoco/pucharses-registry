import { Combo, Food } from "../models/types";

export type CreateFoodQueryParams = Omit<Food, "id">;

export type CreateComboQueryParams = {
  label: string;
  price: number;
  foods: { id: string; quantity: number }[];
};

export interface PucharseItem {
  id: Combo["id"];
  quantity: number;
}

export interface SummaryInterface {
  gain: number;
  foods: {
    [k in string]: { food: Food; quantity: number };
  };
}

export interface DatabaseInterface {
  createFood: (params: CreateFoodQueryParams) => Promise<Food>;
  editFood: (params: Food) => Promise<Food>;
  listFood: () => Promise<Food[]>;
  getFoodById: (id: string) => Promise<Food | null>;
  removeFood: (id: string) => Promise<Food>;
  createCombo: (params: CreateComboQueryParams) => Promise<Combo>;
  listCombos: () => Promise<Combo[]>;
  getComboById: (id: string) => Promise<Combo | null>;
  removeCombo: (id: string) => Promise<string>;
  editCombo: (
    params: CreateComboQueryParams,
    comboId: string
  ) => Promise<string>;
  createPucharse: (params: PucharseItem[]) => Promise<string>;
  getSummary: () => Promise<SummaryInterface>;
}
