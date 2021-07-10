import { createGlobalStyle } from 'styled-components';
import avertaFont from '@gnosis.pm/safe-react-components/dist/fonts/averta-normal.woff2';
import avertaBoldFont from '@gnosis.pm/safe-react-components/dist/fonts/averta-bold.woff2';
import './index.css';

const GlobalStyle = createGlobalStyle`
    html {
        padding-top:2%;
        height: 100%
    }


    body {
        
       height: 100%;
       margin: 0px;
       padding: 0px;
       font-family: 'Poppins';
    }

    #root {
        height: 100%;
       
    }

    .MuiFormControl-root,
    .MuiInputBase-root {
        width: 100% !important;
    }

    @font-face {
        font-family: 'Averta';
        src: local('Averta'), local('Averta Bold'),
        url(${avertaFont}) format('woff2'),
        url(${avertaBoldFont}) format('woff');
    }
`;

export default GlobalStyle;
