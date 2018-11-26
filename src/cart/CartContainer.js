import { connect } from 'react-redux';
import StoreService from '../storeService';
import Cart from './Cart';
export const types = {
  FETCH_TRANSACTIONS_SUCCESS: 'FETCH_TRANSACTIONS_SUCCESS',
  FETCH_ITEMS_SUCCESS: 'FETCH_ITEMS_SUCCESS',
  START_LOADING: 'START_LOADING',
  FINISH_LOADING: 'FINISH_LOADING'
};

export const startLoading = () => ({
  type: types.START_LOADING
});

export const finishLoading = () => ({
  type: types.FINISH_LOADING
});

export const fetchTransactionsSuccess = payload => ({
  type: types.FETCH_TRANSACTIONS_SUCCESS,
  payload
});

export const fetchItemsSuccess = payload => ({
  type: types.FETCH_ITEMS_SUCCESS,
  payload
});

export const fetchTransactions = () => async dispatch => {
  dispatch(startLoading());
  const transactions = await StoreService().all();
  dispatch(fetchTransactionsSuccess(transactions));
  dispatch(finishLoading());
};

export const addTransactions = transactions => dispatch =>
  StoreService()
    .addTransactions(transactions)
    .then(() => dispatch(fetchTransactions()));

export const fetchItems = () => dispatch =>
  StoreService()
    .fetchItems()
    .then(items => dispatch(fetchItemsSuccess(items)));

export const transactionsReducer = (state = [], action) => {
  switch (action.type) {
    case types.FETCH_TRANSACTIONS_SUCCESS:
      return [...action.payload];
    default:
      return state;
  }
};

export const itemsReducer = (state = [], action) => {
  switch (action.type) {
    case types.FETCH_ITEMS_SUCCESS:
      return [...action.payload];
    default:
      return state;
  }
};

export const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case types.START_LOADING:
      return true;
    case types.FINISH_LOADING:
      return false;
    default:
      return state;
  }
};

const mapStateToProps = ({ transactions, items, isLoading }) => {
  return {
    transactions,
    items,
    isLoading
  };
};

const mapDispatchToProps = dispatch => {
  dispatch(fetchTransactions());
  dispatch(fetchItems());
  return {
    onCreate: transactions => {
      dispatch(addTransactions(transactions));
    }
  };
};

const CartContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);

export default CartContainer;
