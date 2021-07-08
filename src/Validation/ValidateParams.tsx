/**
 * Structure types constructed for the chart.
 */
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
  format: string
  time: string
}

export type ReturnedMappedValues = {
  company: string[];
  outputsize: string[];
  dayAdjOrIntraday: string[];
  timeAdjustment: string[];
  selectedValue: any;
  handleChangeValues: (event: any, name:string) => void
  stockData: any[];
}

type lineProps = {
  x: string;
  y: number;
}

export type stockPropsLine = {
  expectedLineDate: lineProps[];
}

export type ReturnHookValueCheck = {
  theme: string;
  toogleAlter: () => void;
  switchText: string;
}