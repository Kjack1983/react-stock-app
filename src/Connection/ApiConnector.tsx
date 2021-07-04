const API_KEY = '7JNPD524Q2J2LEYG';
const functionParams = 'TIME_SERIES_DAILY_ADJUSTED';

/**
 * Fetch API call.
 * @todo check promise type return.
 *
 * @param {string} stockSymbol
 * @param {string} 
 * @return {promise<object:any>}
 */
export const fetchStockDataForSymbol = (stockSymbol:String, outputsize: String):Promise<any> => {
    let API_call = `https://www.alphavantage.co/query?function=${functionParams}&symbol=${stockSymbol}&interval=5min&outputsize=${outputsize}&apikey=${API_KEY}`;
    return fetch(API_call);
};
