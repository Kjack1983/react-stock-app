import * as React from "react";
import { CanvasJSChart } from "canvasjs-react-charts";
import {
    StockValues,
    FormatedStockValues,
    ChartParams,
    stockPropsLine,
    ReturnHookValueCheck,
} from "../Validation/ValidateParams";
import { Grid, Button, makeStyles } from "@material-ui/core";
import * as helpers from "../Helpers/HelperMethods";
import ChartSelect from "./ChartSelect";
import { useTheme, Theme } from "../Context/ThemeContext";

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiGrid-root": {
            marginBottom: "20px",
        },
    },
    button: {
        color: "#58575d",
        border: "1px solid rgba(155, 156, 162, 0.5)",
        backgroundColor: "#d7d6da",
        maxHeight: "118px",
        "&:hover": {
            border: "1px solid rgba(210, 211, 216, 0.5)",
        },
    },
    formControl: {
        width: "15% !important",
        "& label span": {
            color: "red",
        },
        paddingRight: "25px",
    },
    pageContent: {
        padding: theme.spacing(1),
    },
}));

/**
 * Return stock value data.
 *
 * @param {StockValues[]} stockData
 * @return {Array<FormatedStockValues>}
 */
const chartFormatedData = (stockData: StockValues[]): FormatedStockValues[] => {
    return Array.isArray(stockData) && stockData.length
        ? Array.from(stockData).map((stockValue) => {
              let { date, open, high, low, close } = stockValue;
              return {
                  x: new Date(date),
                  y: [open, high, low, close],
              };
          })
        : [];
};

/**
 * Format stock API data for line display.
 *
 * @param {array} stockData
 * @return {array<stockPropsLine>} stockData
 */
const chartFormatedDataLine = (stockData): stockPropsLine => {
	return (
        Array.isArray(stockData) && stockData.length && stockData.reduce((acc, { date, close }) => {
            return [
				...acc, 
				{ x: new Date(date), y: close }
			];
        }, [])
    );
};

/**
 * Custom hook to Handle chart theme
 * color / button text ammendments.
 *
 * @return {void}
 */
const useSwitchThemeHandler = (): ReturnHookValueCheck => {
    const { theme, setTheme } = useTheme();
    const [alter, setAlter] = React.useState<boolean>(false);
    const [switchText, setSwitchText] = React.useState<string>(
        "Switch to White"
    );

    const toogleAlter = (): void => {
        setAlter((alter) => !alter);
        if (alter) {
            setTheme(Theme.Light);
            setSwitchText("Switch to White");
        } else {
            setTheme(Theme.Dark);
            setSwitchText("Switch to Dark");
        }
    };

    return {
        theme,
        toogleAlter,
        switchText,
    };
};

/**
 * Chart component display candlesticks using canvas js.
 *
 * @param {string} symbol
 * @param {string} size
 * @return {JSX}
 */
const Chart: React.FC<ChartParams> = ({
    symbol,
    size,
    format,
    time,
}: ChartParams): JSX.Element => {
    const classes = useStyles();

    // destructure helper methods.
    let { useFormatFetchedData, toggleDataSeries } = helpers;

    const {
        company,
        outputsize,
        dayAdjOrIntraday,
        timeAdjustment,
        selectedValue,
        handleChangeValues,
        stockData,
    } = useFormatFetchedData(symbol, size, format, time);

    let { theme, toogleAlter, switchText } = useSwitchThemeHandler();

    let {
        dataSize,
        deriveCompany,
        dailyAdjustOrIntraday,
        displayTime,
    } = selectedValue;

    return (
        <React.Fragment>
            <Grid container spacing={2} className={classes.root}>
                <ChartSelect
                    width={4}
                    title="company"
                    category="deriveCompany"
                    value={deriveCompany}
                    onChangeValue={(event) => {
                        handleChangeValues(event, "deriveCompany");
                    }}
                    inputSelect={company}
                />
                <ChartSelect
                    width={4}
                    title="size"
                    category="dataSize"
                    value={dataSize}
                    onChangeValue={(event) => {
                        handleChangeValues(event, "dataSize");
                    }}
                    inputSelect={outputsize}
                />
                <ChartSelect
                    width={4}
                    title="format"
                    category="dailyAdjustOrIntraday"
                    value={dailyAdjustOrIntraday}
                    onChangeValue={(event) => {
                        handleChangeValues(event, "dailyAdjustOrIntraday");
                    }}
                    inputSelect={dayAdjOrIntraday}
                />
                <ChartSelect
                    width={4}
                    title="format"
                    category="displayTime"
                    value={displayTime}
                    onChangeValue={(event) => {
                        handleChangeValues(event, "displayTime");
                    }}
                    inputSelect={timeAdjustment}
                />
                <Button
                    onClick={toogleAlter}
                    variant="outlined"
                    color="primary"
                    className={classes.button}
                >
                    {switchText}
                </Button>
            </Grid>
            <CanvasJSChart
                options={{
                    animationEnabled: true,
                    zoomEnabled: true,
                    theme: theme,
                    exportEnabled: true,
                    title: {
                        text: `Historical data ${deriveCompany}`,
                    },
                    subtitles: [
                        {
                            text: "Weekly Averages",
                        },
                    ],
                    axisY: {
                        prefix: "$",
                        // Minimum value is 10% less than the lowest price in the dataset
                        minimum: Math.min(...stockData.map((data) => data.low)) / 1.1,
                        // Minimum value is 10% more than the highest price in the dataset
                        maximum: Math.max(...stockData.map((data) => data.high)) * 1.1,
                        crosshair: {
                            enabled: true,
                            snapToDataPoint: true,
                        },
                    },
                    axisX: {
                        crosshair: {
                            enabled: true,
                            snapToDataPoint: true,
                        },
                        scaleBreaks: {
                            spacing: 0,
                            fillOpacity: 0,
                            lineThickness: 0,
                            customBreaks: stockData.reduce((pointValues, candleLine, index, array) => {
                                    // return on the first iteration since there is no previous data point
                                    if (index === 0) return pointValues;

                                    // Time in UNIX for current and previous data points
                                    const currentDataPointUnix = Number(new Date(candleLine.date));
                                    const previousDataPointUnix = Number(new Date(array[index - 1].date));

                                    // One day converted to milliseconds
                                    const oneDayInMs = 86400000;

                                    // Difference between the current and previous data points In milliseconds
                                    const difference = previousDataPointUnix - currentDataPointUnix;

                                    // Difference equals 1 day, then no scale pointValues is needed otherwise create one.
                                    return difference === oneDayInMs ? pointValues
                                        : [
                                              ...pointValues,
                                              {
                                                  startValue: currentDataPointUnix,
                                                  endValue:
                                                      previousDataPointUnix -
                                                      oneDayInMs,
                                              },
                                          ];
                                },
                                []
                            ),
                        },
                    },
                    axisY2: {
                        prefix: "$",
                        suffix: "bn",
                        title: "Revenue & Income",
                        tickLength: 0,
                    },
                    toolTip: {
                        shared: true,
                    },
                    legend: {
                        reversed: true,
                        cursor: "pointer",
                        itemclick: toggleDataSeries,
                    },
                    data: [
                        {
                            type: "candlestick",
                            showInLegend: true,
                            name: "Stock Price Candlesticks",
                            yValueFormatString: "$#,##0.00",
                            xValueFormatString: "MMMM",
                            dataPoints: chartFormatedData(stockData),
                        },
                        {
                            type: "line",
                            showInLegend: true,
                            name: "Stock Price lines",
                            axisYType: "secondary",
                            yValueFormatString: "$#,##0.00bn",
                            xValueFormatString: "MMMM",
                            dataPoints: chartFormatedDataLine(stockData),
                        },
                    ],
                }}
            />
        </React.Fragment>
    );
};

export default React.memo(Chart);
