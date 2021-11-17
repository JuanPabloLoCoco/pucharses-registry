import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Combo, Food } from "../../services/apiService";
import FoodCounter from "../FoodCounter";

interface ComboFormProps {
  foods: Food[];
  value: Combo | null;
  onEdit: (editCombo: ComboFormState) => void;
  onCreate: (newCombo: Omit<ComboFormState, "id">) => void;
  onReset: () => void;
  loading: boolean;
}

interface FoodQuantity {
  id: string;
  quantity: number;
}

export interface ComboFormState {
  label: string;
  price: number;
  foods: FoodQuantity[];
  id: string;
}

const ComboForm: React.FC<ComboFormProps> = (props: ComboFormProps) => {
  const setInitialState = () => {
    if (props.value == null) {
      return {
        label: "",
        price: 0,
        foods: [],
        id: "",
      };
    }
    return {
      label: props.value.label,
      price: props.value.price,
      id: props.value.id,
      foods: props.value.foods.map((food) => {
        return {
          id: food.food.id,
          quantity: food.quantity,
        };
      }),
    };
  };

  const [state, setState] = useState<ComboFormState>(() => {
    return setInitialState();
  });

  const resetForm = () => {
    setState({
      foods: [],
      label: "",
      price: 0,
      id: "",
    });
    props.onReset();
  };

  useEffect(() => {
    setState(setInitialState());
  }, [props.value, setInitialState]);

  const handleComboCreation = () => {
    if (props.onCreate) {
      props.onCreate({
        label: state.label,
        price: state.price,
        foods: state.foods,
      });
    }
    resetForm();
  };

  const handleComboEdition = () => {
    if (props.onEdit) {
      props.onEdit({
        label: state.label,
        price: state.price,
        foods: state.foods,
        id: state.id,
      });
    }
    resetForm();
  };

  const handleFoodCountChange = (food: Food, newValue: number) => {
    const index = state.foods.findIndex((element) => element.id === food.id);
    let newArr = [];
    if (index < 0) {
      newArr = [...state.foods, { id: food.id, quantity: newValue }];
    } else {
      newArr = [
        ...state.foods.slice(0, index),
        { id: food.id, quantity: newValue },
        ...state.foods.slice(index + 1),
      ];
    }
    setState({ ...state, foods: newArr.filter((p) => p.quantity > 0) });
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setState({ ...state, label: newValue });
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setState({ ...state, price: parseInt(newValue || "") });
  };

  return (
    <Box
      sx={{
        backgroundColor: "lightcyan",
        padding: "1.5em",
        borderRadius: "8px",
        display: "inline-block",
      }}
    >
      <div>
        {props.foods.length ? (
          <>
            <Box marginBottom=".5em">
              {props.foods.map((f) => {
                return (
                  <FoodCounter
                    food={f}
                    onChange={(value) => {
                      handleFoodCountChange(f, value);
                    }}
                    key={"fc" + f.label}
                    value={state.foods.find((x) => x.id === f.id)?.quantity}
                  />
                );
              })}
            </Box>
            <Divider sx={{ marginBottom: ".5em" }} />
          </>
        ) : (
          "No hay comida para crear Combos"
        )}

        <Stack
          direction="row"
          spacing={1}
          alignContent={"center"}
          alignItems={"center"}
          justifyContent="space-between"
          marginBottom=".75em"
        >
          <Typography>Nombre Combo</Typography>
          <TextField
            size="small"
            value={state.label}
            onChange={handleLabelChange}
          ></TextField>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignContent={"center"}
          alignItems={"center"}
          justifyContent="space-between"
          marginBottom=".75em"
        >
          <Typography>Precio $</Typography>
          <TextField
            size="small"
            type="number"
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            value={state.price}
            onChange={handlePriceChange}
          ></TextField>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignContent={"center"}
          alignItems={"center"}
          justifyContent="space-evenly"
          marginBottom=".75em"
        >
          <Button
            variant="contained"
            onClick={() => {
              resetForm();
            }}
          >
            {props.value != null ? "Cancelar" : "Resetear"}
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              if (props.value == null) {
                handleComboCreation();
                return;
              }
              handleComboEdition();
            }}
            disabled={
              state.foods.length === 0 ||
              state.price === 0 ||
              state.label === "" ||
              props.loading
            }
          >
            {props.loading ? (
              <CircularProgress />
            ) : props.value == null ? (
              "Crear combo"
            ) : (
              "Editar"
            )}
          </Button>
        </Stack>
      </div>
    </Box>
  );
};

export default ComboForm;
