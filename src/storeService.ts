import googleApi from './googleApi';
import { indexOf } from 'ramda';
import { Transaction, Item } from './types';

const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const FETCH_RANGE = 'entrada!A2:H';
const INSERT_RANGE = 'entrada!A1:B';
const FETCH_ITEMS_RANGE = 'servicos!A2:B';
const TRANSACTIONS_COLUMNS: Array<keyof Transaction> = [
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

    const rows: Array<Array<string>> = spreadsheet.result.values || [];

    const transactions = rows
      .filter(row => row.some(i => i))
      .map(row => {
        const valueOf = (key: keyof Transaction): string =>
          row[indexOf(key, TRANSACTIONS_COLUMNS)];
        const transaction: Transaction = {
          employee: valueOf('employee'),
          item: valueOf('item'),
          price: Number(valueOf('price')),
          client: valueOf('client'),
          gender: valueOf('gender'),
          commisson: Number(valueOf('commisson')),
          paymentStatus: valueOf('paymentStatus'),
          date: valueOf('date')
        };

        return transaction;
      });

    return transactions;
  };

  const fetchItems = async (): Promise<Item[]> => {
    const gapi = await api.getSession();

    const spreadsheet = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: FETCH_ITEMS_RANGE
    });

    const rows: Array<Array<string>> = spreadsheet.result.values || [];

    const items = rows
      .filter(row => row.some(i => i))
      .map(row => {
        const valueOf = (key: keyof Item): string =>
          row[indexOf(key, ITEMS_COLUMNS)];

        const item: Item = {
          name: valueOf('name'),
          price: Number(valueOf('price')) || undefined
        };
        return item;
      });

    return items;
  };

  const addTransactions = async (transactions: Transaction[]) => {
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
