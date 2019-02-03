import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { TransactionItem, TransactionList } from './TransactionList';
const transaction = {
  item: 'Corte',
  employee: 'Anom',
  date: '1/2/2019 10:32:00'
};

storiesOf('TransactionList/TransactionItem', module).add('default', () => (
  <TransactionItem transaction={transaction} />
));
storiesOf('TransactionList', module).add('default', () => (
  <TransactionList transactions={[transaction, transaction, transaction]} />
));
