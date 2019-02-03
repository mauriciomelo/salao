import React from 'react';
import moment from 'moment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export const TransactionItem = ({ transaction: { item, employee, date } }) => {
  return (
    <ListItem>
      <ListItemText>{`${item} por ${employee} ${moment(
        date,
        'DD/MM/YYYY h:mm:ss'
      ).calendar()}`}</ListItemText>
    </ListItem>
  );
};
export const TransactionList = ({ transactions }) => {
  return (
    <List>
      {transactions.map((
        t,
        i // TODO: add a ID, we should not use index
      ) => (
        <TransactionItem key={i} transaction={t} />
      ))}
    </List>
  );
};
