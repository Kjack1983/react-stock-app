import React from 'react';
import styled from 'styled-components';
import Chart from './Chart';
import { hot } from 'react-hot-loader';


const AppContainer = styled.div`
    margin: 1rem;
    font-family: Arial, Helvetica, sans-serif;
    color: #222222;
    display: 'flex';
    justify-content: 'center';
`;

const App: React.FC = ():JSX.Element => {
    return (
        <AppContainer>
            <Chart symbol = "GOOGL"/>
        </AppContainer>
    );
};

export default hot(module)(App);
