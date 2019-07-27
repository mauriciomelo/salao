import { connect, MapDispatchToPropsParam } from 'react-redux';
import StoreService from '../storeService';
import Cart from './Cart';
import {
  Transaction,
  Item,
  StartLoading,
  AppActions,
  FetchTransactionsSuccess,
  FinishLoading,
  FetchItemsSuccess,
  AppState
} from '../types';
import { Dispatch } from 'redux';
import {
  START_LOADING,
  FINISH_LOADING,
  FETCH_TRANSACTIONS_SUCCESS,
  FETCH_ITEMS_SUCCESS
} from '../constants';
import { ThunkDispatch } from 'redux-thunk';

export const startLoading = (): StartLoading => ({
  type: START_LOADING
});

export const finishLoading = (): FinishLoading => ({
  type: FINISH_LOADING
});

export const fetchTransactionsSuccess = (
  payload: Transaction[]
): FetchTransactionsSuccess => ({
  type: FETCH_TRANSACTIONS_SUCCESS,
  payload
});

export const fetchItemsSuccess = (payload: Item[]): FetchItemsSuccess => ({
  type: FETCH_ITEMS_SUCCESS,
  payload
});

export const fetchTransactions = () => async (
  dispatch: ThunkDispatch<any, any, AppActions>
) => {
  dispatch(startLoading());
  const transactions = await StoreService().all();
  dispatch(fetchTransactionsSuccess(transactions));
  dispatch(finishLoading());
};

export const addTransactions = (transactions: Transaction[]) => (
  dispatch: ThunkDispatch<any, any, AppActions>
) =>
  StoreService()
    .addTransactions(transactions)
    .then(() => dispatch(fetchTransactions()));

export const fetchItems = () => (dispatch: Dispatch<AppActions>) =>
  StoreService()
    .fetchItems()
    .then(items => dispatch(fetchItemsSuccess(items)));

export const transactionsReducer = (
  state: Transaction[] = [],
  action: AppActions
): Transaction[] => {
  switch (action.type) {
    case FETCH_TRANSACTIONS_SUCCESS:
      return [...action.payload];
    default:
      return state;
  }
};

export const itemsReducer = (
  state: Item[] = [],
  action: AppActions
): Item[] => {
  switch (action.type) {
    case FETCH_ITEMS_SUCCESS:
      return [...action.payload];
    default:
      return state;
  }
};

export const loadingReducer = (state = false, action: AppActions): boolean => {
  switch (action.type) {
    case START_LOADING:
      return true;
    case FINISH_LOADING:
      return false;
    default:
      return state;
  }
};

const mapStateToProps = (state: AppState) => {
  return {
    transactions: state.transactions,
    items: state.items,
    isLoading: state.isLoading
  };
};

const mapDispatchToProps: MapDispatchToPropsParam<any, any> = (
  dispatch: ThunkDispatch<any, any, AppActions>
) => {
  dispatch(fetchTransactions());
  dispatch(fetchItems());
  return {
    onCreate: (transactions: Transaction[]) => {
      dispatch(addTransactions(transactions));
    }
  };
};

const CartContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);

export default CartContainer;
