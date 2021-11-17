export interface Food {
  label: string;
  id: string;
}

export interface Combo {
  foods: { food: Food; quantity: number }[];
  price: number;
  label: string;
  id: string;
}

export interface Pucharse {
  combos: { combo: Combo; quantity: number };
  id: string;
}
