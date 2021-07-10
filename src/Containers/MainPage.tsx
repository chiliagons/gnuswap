import React from 'react';
import { Container, Tabs, Tab, AppBar } from '@material-ui/core';
import Modal from '../components/Modal';
// import { useStyles } from '../components/styles';
import { useTheme } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';

//Tab Helper Functions
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`nav-tabpanel-${index}`} aria-labelledby={`nav-tab-${index}`} {...other}>
      {value === index && <Container>{children}</Container>}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
const MainPage: React.FC = () => {
  // const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs value={value} onChange={handleChange} variant="fullWidth" centered indicatorColor="primary" textColor="primary">
          <Tab label="Create Transaction" {...a11yProps(0)} value={0} />
          <Tab label="Past Records" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex}>
        <TabPanel value={value} index={0}>
          <Modal />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <h3>Past Records</h3>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
};

export default MainPage;
