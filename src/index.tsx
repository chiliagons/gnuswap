import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { theme, Loader, Title, Stepper } from '@gnosis.pm/safe-react-components';

import GlobalStyle from './GlobalStyle';
import SafeProvider from '@gnosis.pm/safe-apps-react-sdk';
import App from './App';
import {Modal} from './components';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SafeProvider>
      <Modal />
      </SafeProvider>
      
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
