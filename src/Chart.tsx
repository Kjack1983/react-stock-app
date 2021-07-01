import React, { 
    useState, 
    useEffect 
} from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';
import { fetchStockDataForSymbol } from './ApiConnector';

interface StockValues {
    date: string,
    open: number,
    high: number,
    low: number,
    close: number
}

// @todo need to check the types.
interface FormatedData {
    stockData: any[],
    setStockData: any
}

interface ItemData {
    open: number,
    high: number,
    low: number,
    close: number
}

interface FormatedStockValues {
    x: Date,
    y: number[]
}

interface ChartValues {
    values: StockValues[]
}

/**
 * Custom hook to provide the stock data after 
 * the dom is being rendered.
 *
 * @param {string} symbol
 * @return {object} { stockData, setStockData }
 */
const useFormatFetchedData = (symbol:string):FormatedData => {
    const [stockData, setStockData] = useState<StockValues[]>([]);

    // Fetch daily stock chart for GOOGL when the component mounts
    useEffect(() => {
        const fetchStockData = async () => {
            const response = await fetchStockDataForSymbol(symbol);
            const result = await response.json();
            setStockData(constructStockData(result['Time Series (Daily)']));
        };

        fetchStockData();
    }, []);

    return {
        stockData,
        setStockData
    };
};

/**
 * Format stock data
 * 
 * @param {array} stockData 
 * @return {object}
 */
const constructStockData = (stockData:ChartValues[]): StockValues[] => {
    return Object.keys(stockData).length !== 0 ? Object.entries(stockData).map(([date, priceData]) => {
        return {
            date,
            open: Number(priceData['1. open']),
            high: Number(priceData['2. high']),
            low: Number(priceData['3. low']),
            close: Number(priceData['4. close'])
        }
    }): [];
}

/**
 * toggle hide and show candlesticks.
 *
 * @param {e} object
 * @return {void}
 */
const toggleDataSeries = (e):void => {
	if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	} else {
		e.dataSeries.visible = true;
	}
	e.chart.render();
}

/**
 * Return stock value data.
 * 
 * @param stockData
 * 
 * @[todo] check FormatedStockValues interface.
 * @return {object<FormatedStockValues>} 
 */
const chartFormatedData = (stockData: StockValues[]):FormatedStockValues[] => {
    return Array.isArray(stockData) && stockData.length ? stockData.map((stockValue) => {
        let {date, open, high, low, close} = stockValue;
        return {
            x: new Date(date),
            y: [open, high, low, close]
        }
    }) : []; 
}

/**
 * Chart component display candlesticks using canvas js.
 * 
 * @param {string} symbol
 * @return {JSX}
 */
const Chart: React.FC<{symbol: string}> = ({symbol}):JSX.Element => {
    // Obtain daily stock chart for GOOGL when the component mounts
    const objHolderStockData = useFormatFetchedData(symbol);

    // Destructure getter and setters stock values.
    let { stockData, setStockData } = objHolderStockData;

    return (
        <CanvasJSChart
            options={ {
                animationEnabled: true,
                // "light1", "light2", "dark1", "dark2"
                theme: "dark1",
                exportEnabled: true,
                title: {
                    text: "Historical data Google"
                },
                subtitles: [{
                    text: "Weekly Averages"
                }],
                toolTip: {
                    shared: true
                },
                legend: {
                    reversed: true,
                    cursor: "pointer",
                    itemclick: toggleDataSeries
                }, 
                axisY: {
                    prefix: "$",
                    // Minimum value is 10% less than the lowest price in the dataset
                    minimum: Math.min(...stockData.map(data => data.low)) / 1.1,
                    // Minimum value is 10% more than the highest price in the dataset
                    maximum: Math.max(...stockData.map(data => data.high)) * 1.1,
                    crosshair: {
                        enabled: true,
                        snapToDataPoint: true
                    }
                },
                axisX: {
                    crosshair: {
                        enabled: true,
                        snapToDataPoint: true
                    },
                    scaleBreaks: {
                        spacing: 0,
                        fillOpacity: 0,
                        lineThickness: 0,
                        customBreaks: stockData.reduce((pointValues, candle, index, array) => {
                            // Just return on the first iteration
                            // Since there is no previous data point
                            if (index === 0) return pointValues;

                            // Time in UNIX for current and previous data points
                            const currentDataPointUnix = Number(new Date(candle.date));
                            const previousDataPointUnix = Number(new Date(array[index - 1].date));

                            // One day converted to milliseconds
                            const oneDayInMs = 86400000;

                            // Difference between the current and previous data points
                            // In milliseconds
                            const difference = previousDataPointUnix - currentDataPointUnix;

                            // Difference equals 1 day, then no scale pointValues is needed otherwise create one.
                            return difference === oneDayInMs ? pointValues : [
                                    ...pointValues,
                                    {
                                        startValue: currentDataPointUnix,
                                        endValue: previousDataPointUnix - oneDayInMs
                                    }
                                ]
                        }, [])
                    }
                },
                axisY2: {
                    prefix: "$",
                    suffix: "bn",
                    title: "Revenue & Income",
                    tickLength: 0
                },
                data: [
                    {
                        type: 'candlestick',
                        showInLegend: true,
                        name: "Stock Price",
                        yValueFormatString: "$#,##0.00",
                        xValueFormatString: "MMMM",
                        dataPoints: chartFormatedData(stockData)
                    },
                    {
                        type: "line",
                        showInLegend: true,
                        name: "Net Income",
                        axisYType: "secondary",
                        yValueFormatString: "$#,##0.00bn",
                        xValueFormatString: "MMMM",
                        dataPoints: chartFormatedData(stockData)
                    },
                ]
            } }
        />
    );
};

export default Chart;
