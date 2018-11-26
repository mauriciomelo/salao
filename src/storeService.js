import * as R from 'ramda';
import googleApi from './googleApi';

const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const FETCH_RANGE = 'entrada!A2:H';
const INSERT_RANGE = 'entrada!A1:B';
const FETCH_ITEMS_RANGE = 'servicos!A2:B';
const TRANSACTIONS_COLUMNS = [
  'employee',
  'item',
  'gender',
  'price',
  'paymentStatus',
  'client',
  'commisson',
  'date'
];

const ITEMS_COLUMNS = ['name', 'price'];

const StoreService = (api = googleApi) => {
  const all = async () => {
    const gapi = await api.getSession();
    const spreadsheet = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: FETCH_RANGE
    });

    const rows = spreadsheet.result.values || [];

    const transactions = rows
      .filter(row => row.some(i => i))
      .map(row => {
        const transaction = {};
        TRANSACTIONS_COLUMNS.forEach((col, index) => {
          const isNumeric = col === 'price' || col === 'commisson';
          transaction[col] = isNumeric ? Number(row[index]) : row[index];
        });

        return transaction;
      });

    return transactions;
  };

  const fetchItems = async () => {
    const gapi = await api.getSession();

    const spreadsheet = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: FETCH_ITEMS_RANGE
    });

    const rows = spreadsheet.result.values || [];

    const transactions = rows
      .filter(row => row.some(i => i))
      .map(row => {
        const transaction = {};
        ITEMS_COLUMNS.forEach((col, index) => {
          const isNumeric =
            (col === 'price' || col === 'commisson') && !R.isNil(row[index]);
          transaction[col] = isNumeric ? Number(row[index]) : row[index];
        });

        return transaction;
      });

    return transactions;
  };

  const addTransactions = async transactions => {
    const gapi = await api.getSession();

    const params = {
      spreadsheetId: SPREADSHEET_ID,
      range: INSERT_RANGE,
      valueInputOption: 'USER_ENTERED'
    };

    const values = transactions.map(
      ({
        employee,
        item,
        gender,
        price,
        paymentStatus,
        client,
        commisson,
        date
      }) => [
        employee,
        item,
        gender,
        price,
        paymentStatus,
        client,
        commisson,
        date
      ]
    );

    const valueRangeBody = {
      majorDimension: 'ROWS',
      range: INSERT_RANGE,
      values
    };

    await gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
  };

  return {
    all,
    fetchItems,
    addTransactions
  };
};

export default StoreService;
