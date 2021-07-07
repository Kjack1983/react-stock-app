import React, {useState} from 'react';
import styled from 'styled-components';
import { ThemeContext, Theme } from './Context/ThemeContext';
import Chart from './Components/Chart';
import { hot } from 'react-hot-loader';

const AppContainer = styled.div`
    margin: 1rem;
    font-family: Arial, Helvetica, sans-serif;
    color: #222222;
    display: 'flex';
    justify-content: 'center';
`;

const App: React.FC = ():JSX.Element => {
    const [theme, setTheme] = useState(Theme.Light);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <AppContainer>
                <Chart 
                    symbol="GOOGL" 
                    size="compact" 
                    format="TIME_SERIES_DAILY_ADJUSTED"
                    time="5min"
                />
            </AppContainer>
        </ThemeContext.Provider>
    );
};

export default hot(module)(App);
