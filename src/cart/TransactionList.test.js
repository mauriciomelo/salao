import React from 'react';
import { render } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { TransactionItem, TransactionList } from './TransactionList';
import moment from 'moment';

describe('TransactionItem', () => {
  it('has transaction item name', () => {
    const transaction = {
      item: 'Corte'
    };
    const { container } = render(<TransactionItem transaction={transaction} />);
    expect(container).toHaveTextContent('Corte');
  });

  it('has employee name', () => {
    const transaction = {
      employee: 'Maria'
    };
    const { container } = render(<TransactionItem transaction={transaction} />);
    expect(container).toHaveTextContent('por Maria');
  });

  it('has human readable transaction date', () => {
    const transaction = {
      date: moment()
        .subtract(1, 'day')
        .startOf('day')
        .format('DD/MM/YYYY h:mm:ss')
    };
    const { container } = render(<TransactionItem transaction={transaction} />);
    expect(container).toHaveTextContent('Yesterday at 12:00 PM');
  });
});

describe('TransactionList', () => {
  it('has a list of transactions', () => {
    const transactionList = [
      {
        item: 'Corte',
        employee: 'Joana',
        date: moment()
          .subtract(1, 'day')
          .startOf('day')
          .format('DD/MM/YYYY h:mm:ss')
      },
      {
        item: 'Escova',
        employee: 'Gabs',
        date: moment()
          .startOf('day')
          .format('DD/MM/YYYY h:mm:ss')
      }
    ];
    const { container } = render(
      <TransactionList transactions={transactionList} />
    );
    expect(container).toHaveTextContent(
      'Corte por Joana Yesterday at 12:00 PM'
    );
    expect(container).toHaveTextContent('Escova por Gabs Today at 12:00 PM');
  });
});
