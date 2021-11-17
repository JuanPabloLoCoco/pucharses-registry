import { Button, LinearProgress, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Add as AddIcon } from "@mui/icons-material";
import "./newFood.css";

interface NewFoodProps {
  onCreate?: (name: string) => void;
  isLoading: boolean;
}

const NewFood: React.FC<NewFoodProps> = (props: NewFoodProps) => {
  const [foodName, setFoodName] = useState<string>("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFoodName(event.target.value);
  };

  return (
    <div className="Container">
      <Typography className="Text-padding">Nombre comida</Typography>
      <TextField
        value={foodName}
        onChange={handleChange}
        size="small"
        className="Text-padding"
      ></TextField>
      <Button
        startIcon={<AddIcon></AddIcon>}
        variant="contained"
        disabled={foodName.length === 0 || props.isLoading}
        onClick={() => {
          if (props.onCreate) {
            props.onCreate(foodName);
          }
          setFoodName("");
        }}
      >
        {props.isLoading ? <LinearProgress /> : "Agregar comida"}
      </Button>
    </div>
  );
};

export default NewFood;
