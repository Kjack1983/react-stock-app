import React, { createContext, useState, useEffect} from 'react';

export const ChartContext = createContext({});

interface Props {
    symbol: string
}

export const ChartProvider: React.FC<Props> = ({symbol, children}):any => {



	const chartContext = {
		
	};


	return <ChartContext.Provider value={chartContext}>{children}</ChartContext.Provider>
};

//export const { ChartConsumer } = ChartContext;

ChartProvider.propTypes = {};

ChartProvider.defaultProps = {};
