import { Edit, Delete } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { Combo } from "../../services/apiService";

interface ComboCardProps {
  combo: Combo;
  onEdit: (combo: Combo) => void;
  onDelete: (combo: Combo) => void;
}

const ComboCard: React.FC<ComboCardProps> = (props: ComboCardProps) => {
  //maxWidth: "265px",
  return (
    <Box
      sx={{
        display: "inline-block",
        boxShadow:
          "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
      }}
    >
      <Card variant="outlined">
        <Typography variant="h5" component="div" sx={{ padding: ".5em" }}>
          {props.combo.label}
        </Typography>
        <List>
          {props.combo.foods.map((foodQ) => {
            return (
              <ListItem key={props.combo.label + "-" + foodQ.food.label}>
                <ListItemText
                  primary={foodQ.quantity + " " + foodQ.food.label}
                ></ListItemText>
              </ListItem>
            );
          })}
        </List>
        <CardActions
          disableSpacing
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <>
            <IconButton
              aria-label="add to favorites"
              onClick={() => {
                props.onEdit(props.combo);
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              aria-label="add to favorites"
              onClick={() => {
                props.onDelete(props.combo);
              }}
            >
              <Delete />
            </IconButton>
          </>
          <Typography variant="h5" sx={{ margin: ".5em" }}>
            ${props.combo.price}
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
};

export default ComboCard;
