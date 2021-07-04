import React from "react";
import { CanvasJSChart } from "canvasjs-react-charts";
import {
  StockValues,
  FormatedStockValues,
  ChartParams,
} from "./Validation/ValidateParams";
import { Grid } from "@material-ui/core";
import * as helpers from "./Helpers/HelperMethods";
import ChartSelect from "./Components/ChartSelect";

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
}: ChartParams): JSX.Element => {
  // destructure helper methods.
  let { useFormatFetchedData, toggleDataSeries } = helpers;

  const {
    company,
    outputsize,
    selectedValue,
    handleChangeValues,
    stockData,
  } = useFormatFetchedData(symbol, size);

  let { dataSize, deriveCompany } = selectedValue;

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <ChartSelect
          width={4}
          title="Company"
          value={deriveCompany}
          onChangeCompany={(event) => {
            handleChangeValues(event, "deriveCompany");
          }}
          inputSelect={company}
        />
        <ChartSelect
          width={4}
          title="Company"
          value={dataSize}
          onChangeCompany={(event) => {
            handleChangeValues(event, "dataSize");
          }}
          inputSelect={outputsize}
        />
      </Grid>
      <CanvasJSChart
        options={{
          animationEnabled: true,
          zoomEnabled: true,
          // "light1", "light2", "dark1", "dark2"
          theme: "dark1",
          exportEnabled: true,
          title: {
            text: `Historical data ${deriveCompany}`,
          },
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
              customBreaks: stockData.reduce(
                (pointValues, candle, index, array) => {
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
