import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const base: string = "http://127.0.0.1:5001/";

export interface Food {
  label: string;
  id: string;
}

export interface Combo {
  id: string;
  price: number;
  label: string;
  foods: { food: Food; quantity: number }[];
}

export interface GetFoodsResponse {
  foods: Food[];
}

interface SummaryFoodItem {
  food: Food;
  quantity: number;
}

export interface SummaryResponse {
  summary: {
    gain: number;
    foods: SummaryFoodItem[];
  };
}

interface CreateComboFoodsRequest {
  id: string;
  quantity: number;
}

export interface CreateComboRequest {
  price: number;
  label: string;
  foods: CreateComboFoodsRequest[];
}

interface CreatePucharseRequest {
  combos: { id: string; quantity: number }[];
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: base,
  }),
  tagTypes: ["foods", "combos", "summary", "pucharses"],
  endpoints: (builder) => ({
    getFoods: builder.query<GetFoodsResponse, void>({
      query: () => "foods",
      transformResponse: (res: GetFoodsResponse) => {
        return Promise.resolve(res);
      },
      providesTags: (result, error) => [{ type: "foods", id: "List" }],
      keepUnusedDataFor: 60 * 60 * 24,
    }),
    createFood: builder.mutation<
      { message: string; food: Food },
      { label: string }
    >({
      query(body) {
        return {
          url: "foods",
          method: "POST",
          body,
        };
      },
      invalidatesTags: (result, error) => [{ type: "foods", id: "List" }],
    }),
    editFood: builder.mutation<{ message: string }, { food: Food }>({
      query(data) {
        const id = data.food.id;
        return {
          url: "foods/" + id,
          method: "PUT",
          body: { label: data.food.label },
        };
      },
    }),
    // removeFood: builder.mutation<{ message: string }, { food: Food }>({
    //   query(data) {
    //     const { id } = data.food;
    //     return {
    //       url: "foods/" + id,
    //       method: "DELETE",
    //     };
    //   },
    //   invalidatesTags: (result, error) => [{ type: "foods", id: "List" }],
    // }),
    getCombos: builder.query<{ combos: Combo[] }, void>({
      query: () => "combos",
      providesTags: (result, error) => [{ type: "combos", id: "List" }],
      keepUnusedDataFor: 60 * 5,
    }),
    getSummary: builder.query<SummaryResponse, void>({
      query: () => "summary",
      transformResponse: (res: SummaryResponse) => {
        return Promise.resolve(res);
      },
      providesTags: (result, error) => [{ type: "summary", id: "List" }],
      keepUnusedDataFor: 60 * 30,
    }),
    createCombo: builder.mutation<
      { message: string; combo: Combo },
      CreateComboRequest
    >({
      query(body) {
        return {
          url: "combos",
          method: "POST",
          body,
        };
      },
      invalidatesTags: (result, error) => [{ type: "combos", id: "List" }],
    }),
    editCombo: builder.mutation<
      { message: string },
      { body: CreateComboRequest; id: string }
    >({
      query(params) {
        return {
          url: "combos/" + params.id,
          method: "PUT",
          body: params.body,
        };
      },
      invalidatesTags: (result, error) => [{ type: "combos", id: "List" }],
    }),
    deleteCombo: builder.mutation<{ message: string }, string>({
      query(id) {
        return {
          url: "combos/" + id,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error) => [{ type: "combos", id: "List" }],
    }),
    createPucharse: builder.mutation<
      { message: string },
      CreatePucharseRequest
    >({
      query(body) {
        return {
          url: "pucharses",
          method: "POST",
          body,
        };
      },
      invalidatesTags: (result, error) => [
        { type: "pucharses", id: "List" },
        { type: "summary", id: "List" },
      ],
    }),
  }),
});
