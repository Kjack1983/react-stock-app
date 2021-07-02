interface StockValues {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface ItemData {
  open: number;
  high: number;
  low: number;
  close: number;
}

interface FormatedStockValues {
  x: Date;
  y: number[];
}

interface ChartValues {
  date: string;
  values: ItemData[];
}

interface ChartParams {
  symbol: string;
  size: string;
}

interface ReturnedMappedValues {
  company: string[];
  selectedCompany: string;
  outputsize: string[];
  selectedOutputSize: string;
  handleChange: (event: any) => void;
  stockData: any[];
}

export {
	StockValues,
	ItemData,
	FormatedStockValues,
	ChartValues,
	ChartParams,
	ReturnedMappedValues
}