import React, { useState } from "react";
import "./App.css";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import FoodPage from "./pages/Food";
import CombosPage from "./pages/Combos";
import PucharsesPage from "./pages/Pucharses";
import SummaryPage from "./pages/Summary";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TabComponent {
  label: string;
  disabled: boolean;
  component?: JSX.Element | JSX.Element[];
}

function App() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabs: TabComponent[] = [
    {
      label: "Compras",
      disabled: false,
      component: <PucharsesPage />,
    },
    {
      label: "Combos",
      disabled: false,
      component: <CombosPage />,
    },
    {
      label: "Comidas",
      disabled: false,
      component: <FoodPage />,
    },

    {
      label: "Contaduria",
      disabled: false,
      component: <SummaryPage />,
    },
  ];

  return (
    <div className="App">
      <div className="Title">
        <img
          src="./descarga.jpeg"
          className="Title-img"
          alt="Servicio de pastoral universitaria"
        ></img>
        <Typography variant="h2" sx={{ display: "inline" }}>
          Registro de caja
        </Typography>
      </div>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} centered>
          {tabs.map((t, i) => (
            <Tab
              label={t.label}
              disabled={t.disabled}
              {...a11yProps(i)}
              key={t.label}
            ></Tab>
          ))}
        </Tabs>
      </Box>
      {tabs.map((t, i) => (
        <TabPanel value={value} index={i} key={"t" + t.label}>
          {t.component ? t.component : t.label}
        </TabPanel>
      ))}
    </div>
  );
}

export default App;
