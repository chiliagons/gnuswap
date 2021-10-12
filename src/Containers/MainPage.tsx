import React from "react";
import { Container, Tabs, Tab, AppBar } from "@material-ui/core";
import Nxtp from "../Components/Nxtp";
import { makeStyles } from "@material-ui/core/styles";
import TransactionPage from "../Components/TransactionPage";
import { TableContextProvider } from "../Providers/Txprovider";

const useStyles = makeStyles({
  tabs: {
    color: "black",
  },
  tab__indicator: {
    backgroundColor: "#80c7b9",
    height: "10px",
    top: "45px",
  },
});
// Tab Helper Functions
function TabPanel(props: {
  [x: string]: any;
  children: any;
  value: any;
  index: any;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Container>{children}</Container>}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
const MainPage: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [transactions, setTransactions] = React.useState(null);
  const [activeTransactions, setActiveTransactions] = React.useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <TableContextProvider
        value={{
          value: { transactions, setTransactions },
          value2: { activeTransactions, setActiveTransactions },
        }}
      >
        <AppBar position="static" color="default">
          <Tabs
            className={classes.tabs}
            TabIndicatorProps={{ className: classes.tab__indicator }}
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            centered
          >
            <Tab label="Swap Cross Chain" {...a11yProps(0)} value={0} />
            <Tab label="Transactions" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Nxtp />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Container>
            <TransactionPage />
          </Container>
        </TabPanel>
        {/* </SwipeableViews> */}
      </TableContextProvider>
    </div>
  );
};

export default MainPage;
