import { CircularProgress, Typography } from "@mui/material";
import React from "react";
import { api } from "../../services/apiService";

interface SummaryPageProps {}

const SummaryPage: React.FC<SummaryPageProps> = () => {
  const { data, isLoading } = api.useGetSummaryQuery();
  return (
    <div>
      <Typography>Contaduria</Typography>
      {isLoading && <CircularProgress />}
      {data && (
        <>
          <Typography>Ganancia: ${data.summary.gain}</Typography>
          {data.summary.foods.map((food) => {
            return (
              <div>
                {food.food.label + " - " + food.quantity + " unidades vendidas"}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default SummaryPage;
