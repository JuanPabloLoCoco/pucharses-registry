import { Alert, CircularProgress, Snackbar, Typography } from "@mui/material";
import React, { useState } from "react";
import PucharseForm from "../../components/PucharseForm";
import { api } from "../../services/apiService";

interface PucharsesPageProps {}

interface PucharsesPageState {
  snackbar: {
    open: boolean;
    message: string;
    severity: "success" | "info" | "error";
  };
}

const PucharsesPage: React.FC<PucharsesPageProps> = () => {
  const { data: combosData, isLoading: combosIsLoading } =
    api.useGetCombosQuery();

  const [createPucharse] = api.useCreatePucharseMutation();

  const [state, setState] = useState<PucharsesPageState>(() => {
    return {
      snackbar: {
        message: "",
        open: false,
        severity: "info",
      },
    };
  });

  const handleCreatePucharse = (combos: {
    combos: { id: string; quantity: number }[];
  }) => {
    createPucharse(combos)
      .unwrap()
      .then((response) => {
        setState({
          ...state,
          snackbar: {
            open: true,
            message: "Compra realizada",
            severity: "success",
          },
        });
      })
      .catch((error) => {
        console.error(error);
        setState({
          ...state,
          snackbar: {
            open: true,
            message: "Error al crear compra",
            severity: "error",
          },
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
    setState({ ...state, snackbar: { ...state.snackbar, open: false } });
  };

  return (
    <>
      <Snackbar
        open={state.snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <Alert severity={state.snackbar.severity} variant="filled">
          {state.snackbar.message}
        </Alert>
      </Snackbar>
      <Typography variant="h5">Compras</Typography>
      {combosIsLoading && <CircularProgress />}
      {combosData && (
        <PucharseForm
          loading={false}
          combos={combosData.combos}
          onCreate={handleCreatePucharse}
        />
      )}
    </>
  );
};

export default PucharsesPage;
