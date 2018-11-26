import * as R from 'ramda';

import StoreService from './storeService';

let storeService;
let getMock;
let appendMock;

describe('StoreService', () => {
  beforeEach(() => {
    appendMock = jest.fn();
    getMock = jest.fn();

    const gapi = {
      client: {
        sheets: {
          spreadsheets: {
            values: {
              get: getMock,
              append: appendMock
            }
          }
        }
      }
    };

    const googleApiMock = { getSession: () => Promise.resolve(gapi) };
    storeService = StoreService(googleApiMock);
  });

  it('fetches all transactions', async () => {
    const spreadsheet = [
      ['Maria', 'Corte', 'F', '10', 'pago', '', '20', '15/07/2018 03:12:00'],
      ['Ana', 'Corte', 'F', '10', 'pago', '', '20', '15/07/2018 03:12:00']
    ];

    getMock.mockReturnValue(R.assocPath(['result', 'values'], spreadsheet, {}));

    const expected = [
      {
        employee: 'Maria',
        item: 'Corte',
        gender: 'F',
        price: 10,
        paymentStatus: 'pago',
        client: '',
        commisson: 20,
        date: '15/07/2018 03:12:00'
      },
      {
        employee: 'Ana',
        item: 'Corte',
        gender: 'F',
        price: 10,
        paymentStatus: 'pago',
        client: '',
        commisson: 20,
        date: '15/07/2018 03:12:00'
      }
    ];

    const transactions = await storeService.all();

    expect(transactions).toEqual(expected);
  });

  it('adds a transaction', async () => {
    const transactions = [
      {
        employee: 'Maria',
        item: 'Corte',
        gender: 'F',
        price: 10,
        paymentStatus: 'pago',
        client: '',
        commisson: 20,
        date: '15/07/2018 03:12:00'
      }
    ];

    'employee',
      'item',
      'gender',
      'price',
      'paymentStatus',
      'client',
      'commisson',
      'date';

    const expectedEntry = {
      majorDimension: 'ROWS',
      range: expect.any(String),
      values: [
        ['Maria', 'Corte', 'F', 10, 'pago', '', 20, '15/07/2018 03:12:00']
      ]
    };

    await storeService.addTransactions(transactions);

    expect(appendMock).toBeCalledWith(expect.anything(), expectedEntry);
  });

  it('fetches all items', async () => {
    const spreadsheet = [['Item1', '25.55'], ['Item2', undefined]];
    getMock.mockReturnValue(R.assocPath(['result', 'values'], spreadsheet, {}));
    const expected = [
      { name: 'Item1', price: 25.55 },
      { name: 'Item2', price: undefined }
    ];
    const transactions = await storeService.fetchItems();
    expect(transactions).toEqual(expected);
  });
});
