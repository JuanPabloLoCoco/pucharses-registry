import { Check, Clear, Edit } from "@mui/icons-material";
import { Box, IconButton, Stack, TextField } from "@mui/material";
import React, { useMemo, useState } from "react";
import { Food } from "../../services/apiService";

interface FoodItemProps {
  food: Food;
  onEdit?: (food: Food) => void;
}

type FoodItemState = "edit" | "view";

const FoodItem: React.FC<FoodItemProps> = (props: FoodItemProps) => {
  const oldValue = useMemo(() => props.food.label, [props.food.label]);
  const [state, setState] = useState<FoodItemState>("view");
  const [text, setText] = useState<string>(oldValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };
  return (
    <>
      <Box
        component={"div"}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px 8px",
          display: "inline-block",
          padding: "4px",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignContent={"center"}
          alignItems={"center"}
        >
          <TextField
            size="small"
            value={text}
            disabled={state === "view"}
            variant="filled"
            onChange={handleChange}
          />
          {state === "view" && (
            <>
              <IconButton
                aria-label="fingerprint"
                color="primary"
                sx={{ backgroundColor: "lightblue" }}
                onClick={() => setState("edit")}
              >
                <Edit />
              </IconButton>
            </>
          )}
          {state === "edit" && (
            <>
              <IconButton
                aria-label="fingerprint"
                color="primary"
                sx={{ backgroundColor: "lightblue" }}
                onClick={() => {
                  if (props.onEdit) {
                    props.onEdit({ id: props.food.id, label: text });
                  }
                  setState("view");
                }}
              >
                <Check />
              </IconButton>
              <IconButton
                aria-label="fingerprint"
                color="primary"
                sx={{ backgroundColor: "lightblue" }}
                onClick={() => {
                  setText(oldValue);
                  setState("view");
                }}
              >
                <Clear />
              </IconButton>
            </>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default FoodItem;
