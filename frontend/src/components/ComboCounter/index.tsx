import { Remove, Add } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Combo } from "../../services/apiService";

export interface ComboCounterProps {
  combo: Combo;
  onChange?: (value: number) => void;
  value?: number;
}

const ComboCounter: React.FC<ComboCounterProps> = (
  props: ComboCounterProps
) => {
  const [count, setCount] = useState<number>(props.value || 0);

  useEffect(() => {
    setCount(props.value || 0);
  }, [props.value]);

  const addNumber = (value: number) => {
    setCount(count + value);
    if (props.onChange) {
      props.onChange(count + value);
    }
  };
  return (
    <Stack
      direction="row"
      spacing={1}
      alignContent={"center"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Typography>{props.combo.label}</Typography>
      <Stack
        direction="row"
        spacing={1}
        alignContent={"center"}
        alignItems={"center"}
      >
        <IconButton
          aria-label="fingerprint"
          color="primary"
          sx={{ backgroundColor: "lightblue" }}
          onClick={() => {
            addNumber(-1);
          }}
          disabled={count <= 0}
        >
          <Remove />
        </IconButton>
        <Typography>{count}</Typography>
        <IconButton
          aria-label="fingerprint"
          color="primary"
          sx={{ backgroundColor: "lightblue" }}
          onClick={() => {
            addNumber(1);
          }}
        >
          <Add />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default ComboCounter;
