import localForage from 'localforage';
import { setupCache } from 'axios-cache-adapter';

const API_KEY = '7JNPD524Q2J2LEYG';
const functionParams = 'TIME_SERIES_DAILY_ADJUSTED'; 

interface apiCall {
    
}

/**
 * Fetch API call.
 * @todo check promise type return.
 *
 * @param {string} stockSymbol
 * @return {promise<object:any>}
 */
export const fetchStockDataForSymbol = (stockSymbol:String):Promise<any> => {
    let API_call = `https://www.alphavantage.co/query?function=${functionParams}&symbol=${stockSymbol}&outputsize=compact&apikey=${API_KEY}`;
    return fetch(API_call);
};
