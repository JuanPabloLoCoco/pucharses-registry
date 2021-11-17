import {
  Alert,
  CircularProgress,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ComboCard from "../../components/ComboCard";
import ComboForm, { ComboFormState } from "../../components/ComboForm";
import { api, Combo } from "../../services/apiService";

interface CombosPageProps {}

interface ComboPageState {
  snackbar: {
    open: boolean;
    message: string;
    severity: "success" | "info" | "error";
  };
  comboSelected: Combo | null;
}

const CombosPage: React.FC<CombosPageProps> = () => {
  const { data, isLoading } = api.useGetFoodsQuery();
  const { data: combosData } = api.useGetCombosQuery();

  const [createCombo, { isLoading: createIsLoading }] =
    api.useCreateComboMutation();
  const [editCombo, { isLoading: editIsLoading }] = api.useEditComboMutation();

  const [deleteCombo] = api.useDeleteComboMutation();

  const [state, setState] = useState<ComboPageState>(() => {
    return {
      snackbar: {
        open: false,
        message: "",
        severity: "success",
      },
      comboSelected: null,
    };
  });

  const handleComboCreate = (combo: Omit<ComboFormState, "id">) => {
    createCombo(combo)
      .unwrap()
      .then((response) => {
        setState({
          ...state,
          snackbar: {
            open: true,
            message: "Combo creado",
            severity: "success",
          },
          comboSelected: null,
        });
      })
      .catch((error) => {
        console.error(error);
        setState({
          ...state,
          snackbar: {
            open: true,
            message: "Error al crear combo",
            severity: "error",
          },
          comboSelected: null,
        });
      });
  };
  const handleComboEdit = (combo: ComboFormState) => {
    editCombo({
      body: {
        price: combo.price,
        label: combo.label,
        foods: combo.foods,
      },
      id: combo.id,
    })
      .unwrap()
      .then((response) => {
        setState({
          ...state,
          snackbar: {
            open: true,
            message: "Combo editado",
            severity: "success",
          },
          comboSelected: null,
        });
      })
      .catch((error) => {
        console.error(error);
        setState({
          ...state,
          snackbar: {
            open: true,
            message: "Error al editar combo",
            severity: "error",
          },
          comboSelected: null,
        });
      });
  };

  const handleDeleteCombo = (comboId: string) => {
    deleteCombo(comboId)
      .unwrap()
      .then((response) => {
        setState({
          ...state,
          snackbar: {
            open: true,
            message: "Combo eliminado",
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
            message: "Error al eliminar combo",
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
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5"> Combos</Typography>
        </Grid>
        <Grid item xs={12}>
          <br />
        </Grid>

        <Grid item xs={3} paddingRight={"1em"}>
          {isLoading && <CircularProgress />}
          {data && (
            <ComboForm
              loading={createIsLoading || editIsLoading}
              foods={data.foods}
              value={state.comboSelected}
              onCreate={handleComboCreate}
              onEdit={handleComboEdit}
              onReset={() => {
                setState({ ...state, comboSelected: null });
              }}
            />
          )}
        </Grid>

        <br />
        {combosData &&
          combosData.combos.map((combo: Combo) => {
            return (
              <Grid item xs={2}>
                <ComboCard
                  combo={combo}
                  onDelete={(comboToDelete) => {
                    handleDeleteCombo(comboToDelete.id);
                  }}
                  onEdit={(comboToEdit) => {
                    setState({ ...state, comboSelected: comboToEdit });
                  }}
                />
              </Grid>
            );
          })}
      </Grid>
    </>
  );
};

export default CombosPage;
