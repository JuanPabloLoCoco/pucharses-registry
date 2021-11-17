import {
  CreateComboQueryParams,
  DatabaseInterface,
  PucharseItem,
  SummaryInterface,
} from "./types";
import FileAsync from "lowdb/adapters/FileAsync";
import lowdb from "lowdb";
import { newUUID } from "../libs/uuid";
import { Combo, Food, Pucharse } from "../models/types";

interface ComboSchema {
  id: string;
  label: string;
  price: number;
  foods: { id: string; quantity: number }[];
}

interface PucharseItemsSchema {
  foodQuantity: {
    [k in string]: number;
  };
  price: number;
  date: Date;
  id: string;
}

type Schema = {
  foods: Food[];
  combos: ComboSchema[];
  pucharseItems: PucharseItemsSchema[];
};

let db: lowdb.LowdbAsync<Schema>;

export const createConnection = async () => {
  const adapter = new FileAsync<Schema>("db.json");
  db = await lowdb(adapter);
  const defaultValue: Schema = { foods: [], combos: [], pucharseItems: [] };
  db.defaults(defaultValue).write();
};

export const getConnection = () => db;

interface FoodQuantity {
  food: Food;
  quantity: number;
}

interface FoodIdQuantity {
  id: string;
  quantity: number;
}

interface EditComboParams extends CreateComboQueryParams {
  id: string;
}

const schemaToObjectsFoods = (params: FoodIdQuantity[]): FoodQuantity[] => {
  const getFoods = getConnection().get("foods").value();
  const foodMap = new Map();

  for (let i = 0; i < getFoods.length; i++) {
    let food = getFoods[i];
    foodMap.set(food.id, food.label);
  }
  const answerFoods: { food: Food; quantity: number }[] = params.map((f) => {
    return {
      food: { id: f.id, label: foodMap.get(f.id) },
      quantity: f.quantity,
    };
  });
  return answerFoods;
};

const getCombosList = (): ComboSchema[] => {
  return getConnection().get("combos").value();
};

const getFoodMap = (): Map<string, Food> => {
  const foodList = getConnection().get("foods").value();
  // const foodMap: {[k in string]: Food} = {}
  const foodMap = new Map<string, Food>();
  for (let j = 0; j < foodList.length; j++) {
    let foodItem = foodList[j];
    foodMap.set(foodItem.id, foodItem);
  }
  return foodMap;
};

const database: DatabaseInterface = {
  createFood: (params) => {
    const newFood: Food = { label: params.label, id: newUUID() };
    return Promise.resolve(
      getConnection().get("foods").push(newFood).write()
    ).then(() => Promise.resolve(newFood));
  },
  listFood: () => {
    return Promise.resolve(getConnection().get("foods").value());
  },
  getFoodById: (id: string) => {
    let value = getConnection().get("foods").find({ id: id }).value();
    if (value == null) {
      return Promise.resolve(null);
    }
    return Promise.resolve(value);
  },
  editFood: function (params: Food): Promise<Food> {
    const value = getConnection()
      .get("foods")
      .find({ id: params.id })
      .assign(params)
      .write();
    return Promise.resolve(params);
  },
  removeFood: function (id: string): Promise<Food> {
    const deletedTask = getConnection().get("foods").remove({ id: id }).write();
    return Promise.resolve(deletedTask[0]);
  },
  createCombo: function (params: CreateComboQueryParams): Promise<Combo> {
    const answerFoods = schemaToObjectsFoods(params.foods);
    const newCombo: ComboSchema = { id: newUUID(), ...params };

    let ansCombo: Combo = {
      foods: answerFoods,
      label: newCombo.label,
      id: newCombo.id,
      price: newCombo.price,
    };

    return Promise.resolve(
      getConnection().get("combos").push(newCombo).write()
    ).then(() => {
      return Promise.resolve(ansCombo);
    });
  },
  listCombos: function (): Promise<Combo[]> {
    const comboList: Combo[] = getCombosList().map((combo) => {
      return {
        ...combo,
        foods: schemaToObjectsFoods(combo.foods),
      };
    });
    return Promise.resolve(comboList);
  },
  getComboById: function (id: string): Promise<Combo | null> {
    const value = getConnection().get("combos").find({ id: id }).value();
    if (value == null) {
      return Promise.resolve(null);
    }
    return Promise.resolve({
      ...value,
      foods: schemaToObjectsFoods(value.foods),
    });
  },
  editCombo: function (
    params: CreateComboQueryParams,
    comboId: string
  ): Promise<string> {
    const comboEdited: ComboSchema = {
      label: params.label,
      price: params.price,
      id: comboId,
      foods: params.foods.map((food) => {
        return {
          quantity: food.quantity,
          id: food.id,
        };
      }),
    };
    const value = getConnection()
      .get("combos")
      .find({ id: comboId })
      .assign(comboEdited)
      .write();

    return Promise.resolve(comboId);
  },
  removeCombo: function (id: string): Promise<string> {
    const deletedCombo = getConnection()
      .get("combos")
      .remove({ id: id })
      .write();
    return Promise.resolve(id);
  },
  createPucharse: function (params: PucharseItem[]): Promise<string> {
    const combosMap = new Map<string, ComboSchema>();
    const combos = getCombosList();
    for (let i = 0; i < combos.length; i++) {
      let comboIterator: ComboSchema = combos[i];
      combosMap.set(comboIterator.id, comboIterator);
    }

    // {key: foodId, number: quantity}
    const itemQuantity = new Map<string, number>();
    let price = 0;
    for (let i = 0; i < params.length; i++) {
      // id es de combo, quantity es del pedido
      let pucharseItem = params[i];
      let comboSelected: ComboSchema | undefined = combosMap.get(
        pucharseItem.id
      );
      if (comboSelected) {
        price = price + comboSelected.price * pucharseItem.quantity;
        for (let j = 0; j < comboSelected.foods.length; j++) {
          // id. es id de food, quantity es de quantity de combo
          let comboFood = comboSelected.foods[j];
          itemQuantity.set(
            comboFood.id,
            itemQuantity.get(comboFood.id) ||
              0 + comboFood.quantity * pucharseItem.quantity
          );
        }
      }
    }

    let foodItemsMap: {
      [k in string]: number;
    } = {};

    for (let [key, value] of itemQuantity) {
      foodItemsMap[key] = value;
    }

    let pucharseToSave: PucharseItemsSchema = {
      date: new Date(),
      id: newUUID(),
      price: price,
      foodQuantity: foodItemsMap,
    };
    return Promise.resolve(
      getConnection().get("pucharseItems").push(pucharseToSave).write()
    ).then(() => {
      return Promise.resolve(pucharseToSave.id);
    });
  },
  getSummary: function (): Promise<SummaryInterface> {
    const pucharseList = getConnection().get("pucharseItems").value();
    let gain: number = pucharseList.reduce((acc, curr) => {
      return acc + curr.price;
    }, 0);

    const foodMap = getFoodMap();

    const foodAnswerMap = new Map<string, number>();
    // const foodAnswerMap: { [k in string]: { food: Food; quantity: number } } =
    //   {};

    for (let i = 0; i < pucharseList.length; i++) {
      let pucharseItem = pucharseList[i];
      const pucharseFoodsId = Object.keys(pucharseItem.foodQuantity);

      for (let j = 0; j < pucharseFoodsId.length; j++) {
        let foodId = pucharseFoodsId[j];
        foodAnswerMap.set(
          foodId,
          (foodAnswerMap.get(foodId) || 0) +
            (pucharseItem.foodQuantity[foodId] || 0)
        );
      }
    }

    let finalFoodAnswers: { [k in string]: { food: Food; quantity: number } } =
      {};
    for (let [foodKey, foodQuantity] of foodAnswerMap) {
      if (foodMap.has(foodKey)) {
        finalFoodAnswers[foodKey] = {
          quantity: foodQuantity,
          food: foodMap.get(foodKey)!,
        };
      }
    }

    // Id foods es el id de food. value: food + quantity
    return Promise.resolve({
      foods: finalFoodAnswers,
      gain: gain,
    });
  },
};

export default database;
