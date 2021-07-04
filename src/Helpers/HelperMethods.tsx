import { useState, useEffect } from "react";
import {
	StockValues,
	ChartValues,
	ReturnedMappedValues,
} from "../Validation/ValidateParams";
import { fetchStockDataForSymbol } from "../Connection/ApiConnector";

/**
 * toggle display of candlesticks.
 *
 * @param {e} object
 * @return {void}
 */
const toggleDataSeries = (e): void => {
  if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
    e.dataSeries.visible = false;
  } else {
    e.dataSeries.visible = true;
  }
  e.chart.render();
};

/**
 * Format stock data
 *
 * @param {array} stockData
 * @return {object}
 */
const constructStockData = (stockData: ChartValues[]): StockValues[] => {
  return stockData && Object.keys(stockData).length !== 0
    ? Object.entries(stockData).map(([date, priceData]) => {
        return {
          date,
          open: Number(priceData["1. open"]),
          high: Number(priceData["2. high"]),
          low: Number(priceData["3. low"]),
          close: Number(priceData["4. close"]),
        };
      })
    : [];
};

/**
 * Custom hook to provide the stock data after
 * the dom is being rendered.
 *
 * @param {string} symbol
 * @return {object} { stockData, setStockData }
 */
const useFormatFetchedData = (
  symbol: string,
  size: string
): ReturnedMappedValues => {
  const [company] = useState<string[]>(["GOOGL", "FB", "TWTR", "AMZN", "IBM"]);
  const [outputsize] = useState<string[]>(["compact", "full"]);

  // New API option values.
  const [selectedValue, setSelectedValue] = useState<any>({
    dataSize: "compact",
    deriveCompany: "GOOGL",
  });

  // Destructure in order to feed new API options.
  let { dataSize, deriveCompany } = selectedValue;

  const [stockData, setStockData] = useState<StockValues[]>([]);

  // handle options.
  const handleChangeValues = (event: any, name: string): void => {
    let { target } = event;
    setSelectedValue({
      ...selectedValue,
      [name]: target.value,
    });
  };

  const fetchStockData = async (symbol: string, size: string) => {
    const response = await fetchStockDataForSymbol(symbol, size);
    const result = await response.json();
    setStockData(constructStockData(result["Time Series (Daily)"]));
  };

  // Fetch daily stock chart for GOOGL when the component mounts
  useEffect(() => {
    fetchStockData(symbol, size);
  }, []);

  // Fetch daily stock values for selected company.
  useEffect(() => {
    fetchStockData(deriveCompany, dataSize);
  }, [selectedValue]);

  return {
    company,
    outputsize,
    selectedValue,
    handleChangeValues,
    stockData,
  };
};


export {
	toggleDataSeries,
	constructStockData,
	useFormatFetchedData
}