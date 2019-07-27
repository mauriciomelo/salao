import configureMockStore from 'redux-mock-store';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import {
  fetchTransactions,
  fetchTransactionsSuccess,
  fetchItemsSuccess,
  fetchItems,
  addTransactions,
  transactionsReducer,
  itemsReducer,
  loadingReducer,
  startLoading,
  finishLoading
} from './CartContainer';
import { Transaction, Item, NoAction, AppState, AppActions } from '../types';
import {
  FETCH_TRANSACTIONS_SUCCESS,
  FETCH_ITEMS_SUCCESS,
  START_LOADING,
  FINISH_LOADING,
  NO_ACTION
} from '../constants';

const middlewares = [thunk as ThunkMiddleware<AppState, AppActions>];
const mockStore = configureMockStore(middlewares);

jest.mock('../storeService');

const buildTransaction = (overwrite?: Partial<Transaction>): Transaction => {
  return {
    employee: '',
    item: '',
    price: 0,
    client: '',
    gender: '',
    commisson: 0,
    paymentStatus: '',
    date: '',
    ...overwrite
  };
};

const buildItem = (overwrite?: Partial<Item>): Item => {
  return {
    name: '',
    price: 0,
    ...overwrite
  };
};

const noAction: NoAction = { type: NO_ACTION };

describe('actions', () => {
  it('creates an action to fetch transactions', () => {
    const transaction: Transaction = buildTransaction({ price: 42 });
    const expectedAction = {
      type: FETCH_TRANSACTIONS_SUCCESS,
      payload: [transaction]
    };
    expect(fetchTransactionsSuccess([transaction])).toEqual(expectedAction);
  });

  it('creates an action to fetch items', () => {
    const items = [buildItem()];
    const expectedAction = {
      type: FETCH_ITEMS_SUCCESS,
      payload: items
    };
    expect(fetchItemsSuccess(items)).toEqual(expectedAction);
  });

  it('creates an action to start loadind', () => {
    const expectedAction = {
      type: START_LOADING
    };
    expect(startLoading()).toEqual(expectedAction);
  });

  it('creates an action to finish loadind', () => {
    const expectedAction = {
      type: FINISH_LOADING
    };
    expect(finishLoading()).toEqual(expectedAction);
  });
});

describe('async actions', () => {
  it('creates FETCH_TRANSACTIONS_SUCCESS when fetching has been done', () => {
    const transactions = [buildTransaction({ price: 42 })];
    const expectedActions = [
      startLoading(),
      fetchTransactionsSuccess(transactions),
      finishLoading()
    ];

    const store = mockStore({ transactions: [] });

    const storeServiceInstanceMock = {
      all: jest.fn().mockResolvedValue(transactions)
    };

    require('../storeService').default.mockReturnValue(
      storeServiceInstanceMock
    );

    return store.dispatch(fetchTransactions()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('creates FETCH_TRANSACTIONS_SUCCESS when new transactions are created', () => {
    const transactions = [buildTransaction({ price: 42 })];
    const expectedActions = [
      startLoading(),
      fetchTransactionsSuccess(transactions),
      finishLoading()
    ];
    const store = mockStore({ transactions: [] });

    const storeServiceInstanceMock = {
      addTransactions: jest.fn().mockResolvedValue({}),
      all: jest.fn().mockResolvedValue(transactions)
    };

    require('../storeService').default.mockReturnValue(
      storeServiceInstanceMock
    );

    return store.dispatch(addTransactions(transactions)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      expect(storeServiceInstanceMock.addTransactions).toBeCalledWith(
        transactions
      );
    });
  });

  it('creates FETCH_ITEMS_SUCCESS when fetching has been done', () => {
    const items = [buildItem({ price: 42 })];
    const expectedActions = [fetchItemsSuccess(items)];
    const store = mockStore({ items: [] });

    const storeServiceInstanceMock = {
      fetchItems: jest.fn().mockResolvedValue(items)
    };

    require('../storeService').default.mockReturnValue(
      storeServiceInstanceMock
    );

    return store.dispatch(fetchItems()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('transactions reducer', () => {
  it('returns the initial state', () => {
    expect(transactionsReducer(undefined, startLoading())).toEqual([]);
  });

  it('handles FETCH_TRANSACTIONS_SUCCESS', () => {
    const transactions = [buildTransaction({ price: 42 })];
    const state = transactionsReducer(
      [],
      fetchTransactionsSuccess(transactions)
    );
    expect(state).toEqual(transactions);
  });
});

describe('items reducer', () => {
  it('returns the initial state', () => {
    expect(itemsReducer(undefined, startLoading())).toEqual([]);
  });

  it('handles FETCH_ITEMS_SUCCESS', () => {
    const items = [buildItem({ price: 42 })];
    const state = itemsReducer([], fetchItemsSuccess(items));
    expect(state).toEqual(items);
  });
});

describe('loading reducer', () => {
  it('returns the initial state', () => {
    expect(loadingReducer(undefined, noAction)).toEqual(false);
  });

  it('handles START_LOADING', () => {
    const isLoading = loadingReducer(false, startLoading());
    expect(isLoading).toEqual(true);
  });

  it('handles FINISH_LOADING', () => {
    const isLoading = loadingReducer(true, finishLoading());
    expect(isLoading).toEqual(false);
  });
});
