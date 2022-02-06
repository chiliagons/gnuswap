import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "@gnosis.pm/safe-react-components";

import GlobalStyle from "./GlobalStyle";
import SafeProvider from "@gnosis.pm/safe-apps-react-sdk";
import MainPage from "./Containers/MainPage";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SafeProvider>
        <MainPage />
      </SafeProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
