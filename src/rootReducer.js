import { combineReducers } from 'redux';
import { transactionsReducer as transactions } from './cart/CartContainer';
import { itemsReducer as items } from './cart/CartContainer';
import { loadingReducer as isLoading } from './cart/CartContainer';

export default combineReducers({
  transactions,
  items,
  isLoading
});
