import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Combo } from "../../services/apiService";
import ComboCounter from "../ComboCounter";

interface PucharseFormProps {
  combos: Combo[];
  loading: boolean;
  onCreate: (pucharse: { combos: FoodQuantity[] }) => void;
}

interface FoodQuantity {
  id: string;
  quantity: number;
}

interface PucharseFormState {
  combos: FoodQuantity[];
}

const PucharseForm: React.FC<PucharseFormProps> = (
  props: PucharseFormProps
) => {
  const [state, setState] = useState<PucharseFormState>(() => {
    return {
      combos: [],
    };
  });

  if (props.combos.length === 0) {
    return <div>No hay combos para registrar compras</div>;
  }

  const resetForm = () => {
    setState({
      ...state,
      combos: [],
    });
  };

  const handleComboChange = (combo: Combo, newValue: number) => {
    const index = state.combos.findIndex((c) => c.id === combo.id);
    let newArr: FoodQuantity[] = [];
    if (index < 0) {
      newArr = [...state.combos, { id: combo.id, quantity: newValue }];
    } else {
      newArr = [
        ...state.combos.slice(0, index),
        { id: combo.id, quantity: newValue },
        ...state.combos.slice(index + 1),
      ];
    }
    setState({ ...state, combos: newArr.filter((c) => c.quantity > 0) });
  };

  const totalPrice = state.combos.reduce((acc, curr) => {
    let comboFound = props.combos.filter((c) => c.id === curr.id);
    return acc + comboFound[0].price * curr.quantity;
  }, 0);

  return (
    <>
      <Box
        sx={{
          backgroundColor: "lightcyan",
          padding: ".5em",
          borderRadius: "8px",
          display: "inline-block",
        }}
      >
        <Box
          sx={{
            margin: "1em",
          }}
        >
          {props.combos.map((combo) => {
            return (
              <ComboCounter
                combo={combo}
                onChange={(value) => {
                  handleComboChange(combo, value);
                }}
                value={state.combos.find((x) => x.id === combo.id)?.quantity}
              />
            );
          })}
        </Box>
        <div>
          <Typography variant="h5">Total $ {totalPrice}</Typography>
        </div>
        <div>
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
              {"Reiniciar"}
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                if (props.onCreate) {
                  props.onCreate({ combos: state.combos });
                  resetForm();
                }
              }}
              disabled={state.combos.length === 0 || props.loading}
            >
              {props.loading ? <CircularProgress /> : "Comprar"}
            </Button>
          </Stack>
        </div>
      </Box>
    </>
  );
};

export default PucharseForm;
