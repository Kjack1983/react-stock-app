import * as React from "react";
import { CanvasJSChart } from "canvasjs-react-charts";
import {
  StockValues,
  FormatedStockValues,
  ChartParams,
} from "../Validation/ValidateParams";
import { Grid, Button } from "@material-ui/core";
import * as helpers from "../Helpers/HelperMethods";
import ChartSelect from "./ChartSelect";
import { useTheme, Theme } from '../Context/ThemeContext';

/**
 * Return stock value data.
 *
 * @param stockData
 *
 * @[todo] check FormatedStockValues interface.
 * @return {object<FormatedStockValues>}
 */
export const chartFormatedData = (
  stockData: StockValues[]
): FormatedStockValues[] => {
  return Array.isArray(stockData) && stockData.length
    ? stockData.map((stockValue) => {
        let { date, open, high, low, close } = stockValue;
        return {
          x: new Date(date),
          y: [open, high, low, close],
        };
      })
    : [];
};

const changeSelectedDataPoints = (e: any): void => {
  console.log(e.chart.options.data);
  /* let data = e.chart.options.data;
  if (!e.chart.options.axisX)
    e.chart.options.axisX = {};

  let axisX = e.axisX[0];

  for (let i = 0; i < data.length; i++) {
    let dataPoints = data[i].dataPoints;
    let selectedMarkerSize = data[i].selectedMarkerSize;
    for (var j = 0; j < dataPoints.length; j++) {
      if (dataPoints[j].x > axisX.viewportMinimum && dataPoints[j].x < axisX.viewportMaximum) {
        if (typeof dataPoints[j].originalMarkerSize === "undefined")
          dataPoints[j].originalMarkerSize = dataPoints[j].markerSize ? dataPoints[j].markerSize : null;
          dataPoints[j].markerSize = selectedMarkerSize;
      } else
        dataPoints[j].markerSize = dataPoints[j].originalMarkerSize;
    }
  }

  e.chart.options.axisX.viewportMinimum = e.chart.options.axisX.viewportMaximum = null; */
};

/**
 * Custom hook to Handle chart theme
 * 
 * @return {void}
 */
const useSwitchThemeHandler = () => {
	const { theme, setTheme } = useTheme();
	const [alter, setAlter] = React.useState<boolean>(false);

	const toogleAlter = ():void => {
		setAlter(alter => !alter);
		if(alter) {
			setTheme(Theme.Light);
		} else {
			setTheme(Theme.Dark);
		}
	}

	return {
		theme,
		toogleAlter
	}
}

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
  time
}: ChartParams): JSX.Element => {
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

  let { theme, toogleAlter } = useSwitchThemeHandler();

  let { dataSize, deriveCompany, dailyAdjustOrIntraday, displayTime } = selectedValue;

  return (
    <React.Fragment>
	  <Grid container spacing={2}>
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
		<Button onClick={toogleAlter} variant="contained" color="primary">
			switch to dark theme
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
          /* rangeChanging: changeSelectedDataPoints, */
          subtitles: [
            {
              text: "Weekly Averages",
            },
          ],
          toolTip: {
            shared: true,
          },
          legend: {
            reversed: true,
            cursor: "pointer",
            itemclick: toggleDataSeries,
          },
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
              customBreaks: stockData.reduce((pointValues, candle, index, array) => {
                  // Just return on the first iteration
                  // Since there is no previous data point
                  if (index === 0) return pointValues;

                  // Time in UNIX for current and previous data points
                  const currentDataPointUnix = Number(new Date(candle.date));
                  const previousDataPointUnix = Number(
                    new Date(array[index - 1].date)
                  );

                  // One day converted to milliseconds
                  const oneDayInMs = 86400000;

                  // Difference between the current and previous data points
                  // In milliseconds
                  const difference =
                    previousDataPointUnix - currentDataPointUnix;

                  // Difference equals 1 day, then no scale pointValues is needed otherwise create one.
                  return difference === oneDayInMs
                    ? pointValues
                    : [
                        ...pointValues,
                        {
                          startValue: currentDataPointUnix,
                          endValue: previousDataPointUnix - oneDayInMs,
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
          data: [
            {
              type: "candlestick",
              showInLegend: true,
              name: "Stock Price",
              yValueFormatString: "$#,##0.00",
              xValueFormatString: "MMMM",
              dataPoints: chartFormatedData(stockData),
            },
            {
              type: "line",
              showInLegend: true,
              name: "Net Income",
              axisYType: "secondary",
              yValueFormatString: "$#,##0.00bn",
              xValueFormatString: "MMMM",
              dataPoints: chartFormatedData(stockData),
            },
          ],
        }}
      />
    </React.Fragment>
  );
};

export default Chart;
