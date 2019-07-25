import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  fetchTransactions,
  fetchTransactionsSuccess,
  fetchItemsSuccess,
  fetchItems,
  addTransactions,
  transactionsReducer,
  itemsReducer,
  loadingReducer,
  types,
  startLoading,
  finishLoading
} from './CartContainer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('../storeService');

describe('actions', () => {
  it('creates an action to fetch transactions', () => {
    const transaction = { price: 42 };
    const expectedAction = {
      type: types.FETCH_TRANSACTIONS_SUCCESS,
      payload: transaction
    };
    expect(fetchTransactionsSuccess(transaction)).toEqual(expectedAction);
  });

  it('creates an action to fetch items', () => {
    const items = jest.fn();
    const expectedAction = {
      type: types.FETCH_ITEMS_SUCCESS,
      payload: items
    };
    expect(fetchItemsSuccess(items)).toEqual(expectedAction);
  });

  it('creates an action to start loadind', () => {
    const expectedAction = {
      type: types.START_LOADING
    };
    expect(startLoading()).toEqual(expectedAction);
  });

  it('creates an action to finish loadind', () => {
    const expectedAction = {
      type: types.FINISH_LOADING
    };
    expect(finishLoading()).toEqual(expectedAction);
  });
});

describe('async actions', () => {
  it('creates FETCH_TRANSACTIONS_SUCCESS when fetching has been done', () => {
    const transactions = [{ price: 42 }];
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
    const transactions = [{ price: 42 }];
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
    const items = [{ price: 42 }];
    const expectedActions = [fetchItemsSuccess(items)];
    const store = mockStore({ items: [] });

    const storeServiceInstanceMock = {
      fetchItems: jest.fn().mockResolvedValue(items)
    };

    require('../storeService').default.mockReturnValue(
      storeServiceInstanceMock
    );

    return store.dispatch(fetchItems(items)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('transactions reducer', () => {
  it('returns the initial state', () => {
    expect(transactionsReducer(undefined, {})).toEqual([]);
  });

  it('handles FETCH_TRANSACTIONS_SUCCESS', () => {
    const transactions = [{ price: 42 }];
    const state = transactionsReducer(
      [],
      fetchTransactionsSuccess(transactions)
    );
    expect(state).toEqual(transactions);
  });
});

describe('items reducer', () => {
  it('returns the initial state', () => {
    expect(itemsReducer(undefined, {})).toEqual([]);
  });

  it('handles FETCH_ITEMS_SUCCESS', () => {
    const items = [{ price: 42 }];
    const state = itemsReducer([], fetchItemsSuccess(items));
    expect(state).toEqual(items);
  });
});

describe('loading reducer', () => {
  it('returns the initial state', () => {
    expect(loadingReducer(undefined, {})).toEqual(false);
  });

  it('handles START_LOADING', () => {
    const isLoading = loadingReducer(null, startLoading());
    expect(isLoading).toEqual(true);
  });

  it('handles FINISH_LOADING', () => {
    const isLoading = loadingReducer(null, finishLoading());
    expect(isLoading).toEqual(false);
  });
});
