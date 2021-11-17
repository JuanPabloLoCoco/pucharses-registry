import { Alert, Box, Grid, Snackbar, Typography } from "@mui/material";
import React, { useState } from "react";
import { api, Food } from "../../services/apiService";
import NewFood from "../../components/NewFood";
import FoodItem from "../../components/FoodItem";
interface FoodPageProps {}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "error";
}

const FoodPage: React.FC<FoodPageProps> = () => {
  const { data, isLoading } = api.useGetFoodsQuery();
  const [createFood] = api.useCreateFoodMutation();

  const [editFood] = api.useEditFoodMutation();

  const [snackbarState, setSnackbarState] = useState<SnackbarState>(() => {
    return {
      open: false,
      message: "",
      severity: "success",
    };
  });

  const handleCreateFood = (newFoodName: string) => {
    createFood({ label: newFoodName })
      .unwrap()
      .then((response) => {
        setSnackbarState({
          message: "Comida creada",
          open: true,
          severity: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setSnackbarState({
          message: "Error creando Comida",
          open: true,
          severity: "error",
        });
      });
  };

  const handleEditFood = (editedFood: Food) => {
    editFood({ food: editedFood })
      .unwrap()
      .then((response) => {
        setSnackbarState({
          message: "Comida editada!",
          open: true,
          severity: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setSnackbarState({
          message: "Error editando Comida",
          open: true,
          severity: "error",
        });
      });
  };

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarState({ ...snackbarState, open: false, message: "" });
  };

  return (
    <>
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <Alert severity={snackbarState.severity} variant="filled">
          {snackbarState.message}
        </Alert>
      </Snackbar>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5"> Comidas</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box>
            {data && data.foods.length
              ? data.foods.map((c) => {
                  return (
                    <Box margin=".25em">
                      <FoodItem
                        food={c}
                        key={c.label}
                        onEdit={(c) => {
                          handleEditFood(c);
                        }}
                      />
                    </Box>
                  );
                })
              : "Actualemente no hay comidas"}
          </Box>
          <br />
        </Grid>
        <Grid item xs={12}>
          <NewFood onCreate={handleCreateFood} isLoading={isLoading} />
        </Grid>
      </Grid>
    </>
  );
};

export default FoodPage;
