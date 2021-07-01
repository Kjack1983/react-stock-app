import React, { 
    useState, 
    useEffect 
} from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';
import { fetchStockDataForSymbol } from './ApiConnector';
import {
    Select,
    FormHelperText,
    Typography, 
    FormControl, 
    InputLabel, 
    MenuItem,
    Input,
    makeStyles,
    Grid
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	root: {
		"& .MuiFormControl-root": {
			width: "20%",
			marginLeft: '10px',
			marginBottom: '5px'
		},
		"& .MuiButtonBase-root": {
			marginTop: '20px'
		},
		"& .Mui-selected": {
			background: '#e0e0e0',
			"&:hover": {
				background: '#e0e0e0',
			}
		},
		"& .MuiTypography-body1": {
			fontWeight: '300'
		},
		"& .MuiFormLabel-root": {
			fontSize: '16px',
			color: '#0f5b8e',
		},
		"& .MuiInputBase-root": {
			marginTop: '19px'
		},
		"& .MuiIconButton-colorInherit": {
			marginTop: '0px'
		},
		"& .MuiTablePagination-toolbar": {
			fontWeight: '400',
			fontStyle: 'italic',
			color: '#4d4e52'
		},
		"& .MuiTablePagination-selectRoot": {
			marginTop: '8px',
			marginLeft: '0px',
			marginRight: '10px'
		},
		"& .MuiTablePagination-select": {
			fontSize: '15px'
		},
		"& .MuiTablePagination-caption": {
			fontSize: '15px'
		},
		"& .MuiTab-root": {
			minWidth: '120px'
		},
		"&. MuiPaper-elevation4": {
			boxShadow: 'none'
		},
	},
	visuallyHidden: {
		border: 0,
		clip: "rect(0 0 0 0)",
		height: 1,
		margin: -1,
		overflow: "hidden",
		padding: 0,
		position: "absolute",
		top: 20,
		width: 1
	},
	labelContainer: {
		paddingLeft: 0,
		paddingRight: 0
	},
	formControl: {
		width: "100%",
		"& label span": {
			color: "red"
		},
		paddingRight: '25px'
	},
	titleDescription: {
		fontWeight: 'bold',
		color: '#3f51b5',
	},
	tabContainer: {
		boxShadow: 'none'
	},
	tabStyle: {
		minWidth: 100,
		paddingLeft: 12,
		paddingRight: 12
	},
	pageContent: {
		padding: theme.spacing(1)
	},
	searchInput: {
		width: '75%'
	},
}))

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
const useFormatFetchedData = (symbol:string):any => {
    const [company, setCompany] = useState<string[]>(['GOOGL', 'FB', 'TWTR', 'AMZN']);
    const [selectedCompany, setSelectedCompany] = useState<string>('GOOGL');
    const [stockData, setStockData] = useState<StockValues[]>([]);
    
    const handleChange = (event:any):void => {
        setSelectedCompany(event.target.value);
    }

    const fetchStockData = async (symbol: string) => {
        const response = await fetchStockDataForSymbol(symbol);
        const result = await response.json();
        setStockData(constructStockData(result['Time Series (Daily)']));
    };

    // Fetch daily stock chart for GOOGL when the component mounts
    useEffect(() => {
        fetchStockData(symbol);
    }, []);

    // Fetch daily stock values for selected company.
    useEffect(() => {
        fetchStockData(selectedCompany);
    }, [selectedCompany])
    
    return {
        company,
        setCompany,
        selectedCompany,
        setSelectedCompany,
        handleChange,
        stockData,
        setStockData,
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
 * toggle display of candlesticks.
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
    
    const classes = useStyles();

    // Obtain daily stock chart for GOOGL when the component mounts
    const { 
        stockData,
        company,
        selectedCompany,
        handleChange 
    } = useFormatFetchedData(symbol);
    
    return (
        <React.Fragment>
        <FormControl className={classes.formControl}>
            <InputLabel
                disableAnimation={false}
                htmlFor="Stock"
            >
                Stock *
                </InputLabel>
            <Select
                value={company}
                onChange={(event) => {
                    handleChange(event)
                }}
                input={<Input name="company" id="company" />}
            >
                <MenuItem selected disabled value=""><em>Please select</em></MenuItem>
                {company.map(option => {
                    return <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                })}
            </Select>
            <FormHelperText>Select cron job category</FormHelperText>
        </FormControl>
        <CanvasJSChart
            options={ {
                animationEnabled: true,
                // "light1", "light2", "dark1", "dark2"
                theme: "dark1",
                exportEnabled: true,
                title: {
                    text: `Historical data ${selectedCompany}`
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
        </React.Fragment>
    );
};

export default Chart;
