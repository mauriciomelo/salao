import {
  START_LOADING,
  FETCH_TRANSACTIONS_SUCCESS,
  FINISH_LOADING,
  FETCH_ITEMS_SUCCESS
} from './constants';
import rootReducer from './rootReducer';
export interface Item {
  name: string;
  price: number | undefined;
}

export interface Transaction {
  employee: string;
  item: string;
  price: number | undefined;
  client: string;
  gender: string;
  commisson: number | undefined;
  paymentStatus: string;
  date: string;
}

// State

export type AppState = ReturnType<typeof rootReducer>;

// Actions

export interface StartLoading {
  type: typeof START_LOADING;
}

export interface FetchTransactionsSuccess {
  type: typeof FETCH_TRANSACTIONS_SUCCESS;
  payload: Transaction[];
}

export interface FetchItemsSuccess {
  type: typeof FETCH_ITEMS_SUCCESS;
  payload: Item[];
}

export interface FinishLoading {
  type: typeof FINISH_LOADING;
}

export type AppActions =
  | StartLoading
  | FinishLoading
  | FetchItemsSuccess
  | FetchTransactionsSuccess;
