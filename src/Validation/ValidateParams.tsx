export interface StockValues {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface ItemData {
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface FormatedStockValues {
  x: Date;
  y: number[];
}

export interface ChartValues {
  date: string;
  values: ItemData[];
}

export interface ChartParams {
  symbol: string;
  size: string;
}

export interface ReturnedMappedValues {
  company: string[];
  outputsize: string[];
  selectedValue: any;
  handleChangeValues: (event: any, name:string) => void
  stockData: any[];
}