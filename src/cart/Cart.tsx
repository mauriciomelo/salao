import React, { Component, SyntheticEvent } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';
import 'moment/locale/pt-br';
import {
  withStyles,
  Theme,
  createStyles,
  WithStyles
} from '@material-ui/core/styles';
import authService from '../authService';
import { TransactionList } from './TransactionList';
import { pathOr, flip, repeat, assoc, dissoc, compose } from 'ramda';
import { Transaction, Item } from '../types';

moment().locale('pt');

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    group: {
      display: 'flex',
      flexDirection: 'row'
    },
    flex: {
      flexGrow: 1
    },
    textField: {
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '100%'
    },
    title: {
      marginTop: 40,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    },
    submit: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '100%'
    },
    menu: {
      width: 200
    },
    progressWrapper: {
      marginTop: '30%',
      textAlign: 'center'
    }
  });

const DEFAULT_TRANSACTION: TransactionToSubmit = {
  employee: '',
  item: '',
  price: undefined,
  client: '',
  gender: '',
  commisson: undefined,
  paymentStatus: '',
  quantity: 1,
  date: moment().format('YYYY-MM-DDThh:mm')
};

interface CartProps extends WithStyles<typeof styles> {
  items: Item[];
  transactions: Transaction[];
  isLoading: boolean;
  onCreate: Function;
}

interface TransactionToSubmit extends Transaction {
  quantity: number;
}

interface CartState {
  error: Error | null;
  isMessageOpen: boolean;
  isSignedIn?: boolean;
  isLoading?: boolean;
  transactionToSubmit: TransactionToSubmit;
}

class Cart extends Component<CartProps, CartState> {
  state: CartState = {
    transactionToSubmit: DEFAULT_TRANSACTION,
    isMessageOpen: false,
    error: null
  };

  async componentDidMount() {
    const isSignedIn = await authService.isSignedIn();
    authService.listen(this.updateSigninStatus);
    this.updateSigninStatus(isSignedIn);
  }

  showMessage = () => {
    this.setState({ isMessageOpen: true });
  };

  handleClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ isMessageOpen: false });
  };

  reset = () => {
    this.setState({ transactionToSubmit: DEFAULT_TRANSACTION });
  };

  updateSigninStatus = (isSignedIn: boolean) => {
    this.setState({ isSignedIn });
    if (isSignedIn) {
      // TODO: Extrat this to a login component
      // this.fetchTransactions();
      // this.fetchItems();
    }
  };

  handleAuthClick() {
    authService.signIn();
  }

  handleSignoutClick() {
    authService.signOut();
  }

  handleChange = (field: string) => (event: object) => {
    const value = pathOr(null, ['target', 'value'], event);
    const transactionToSubmit = {
      ...this.state.transactionToSubmit,
      ...{ [field]: value }
    };

    if (field === 'item' && value) {
      const item = this.props.items.find(i => i.name === value);

      transactionToSubmit.price = item ? item.price : undefined;
    }

    this.setState({ transactionToSubmit });
  };

  handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    const repeatTransaction = flip(repeat)(
      this.state.transactionToSubmit.quantity
    );
    const formatDate = (transaction: Transaction) =>
      assoc(
        'date',
        moment(transaction.date, 'YYYY-MM-DDThh:mm').format(
          'DD/MM/YYYY h:mm:ss'
        ),
        transaction
      );
    const toTransactions = compose(
      repeatTransaction,
      dissoc('quantity'),
      formatDate
    );
    const transactions = toTransactions(this.state.transactionToSubmit);

    try {
      this.props.onCreate(transactions);
      this.reset();
      this.showMessage();
    } catch (error) {
      this.setState({ error: error.result.error });
    }
  };

  lastTransactions = () => {
    const reversed = [...this.props.transactions].reverse();
    return reversed.slice(0, 10);
  };

  render() {
    const { classes } = this.props;
    if (this.state.error) {
      return 'Ocorreu um erro, edite diretamente na planilha ou tente mais tarde';
    }
    if (this.props.isLoading) {
      return (
        <div className={classes.progressWrapper}>
          <CircularProgress />
        </div>
      );
    }

    if (!this.state.isSignedIn) {
      return (
        <Button
          color="primary"
          variant="contained"
          size="large"
          id="authorize_button"
          onClick={this.handleAuthClick}
        >
          Entrar
        </Button>
      );
    }

    return (
      <div className="App">
        <AppBar position="fixed">
          <Toolbar>
            <Typography
              variant="subtitle1"
              color="inherit"
              className={classes.flex}
            >
              Salão ({process.env.REACT_APP_VERSION})
            </Typography>

            <Button
              color="inherit"
              id="signout_button"
              onClick={this.handleSignoutClick}
            >
              Sair
            </Button>
          </Toolbar>
        </AppBar>
        <form
          className={classes.container}
          onSubmit={this.handleSubmit}
          autoComplete="off"
        >
          <FormControl required className={classes.textField}>
            <InputLabel htmlFor="item">Item</InputLabel>
            <Select
              value={this.state.transactionToSubmit.item}
              onChange={this.handleChange('item')}
              name="item"
              inputProps={{
                id: 'item'
              }}
            >
              <option value="" />
              {this.props.items.map(option => (
                <option key={option.name} value={option.name}>
                  {option.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <TextField
            value={this.state.transactionToSubmit.price || ''}
            label="Preço"
            type="number"
            onChange={this.handleChange('price')}
            className={classes.textField}
            required
          />

          <TextField
            value={this.state.transactionToSubmit.quantity}
            label="Quantidade"
            type="number"
            inputProps={{
              required: false,
              max: 10,
              min: 1
            }}
            onChange={this.handleChange('quantity')}
            className={classes.textField}
            required
          />

          <FormControl
            component="fieldset"
            required
            className={classes.textField}
          >
            <FormLabel component="legend">Colaborador</FormLabel>
            <RadioGroup
              aria-label="employee"
              name="employee"
              className={classes.group}
              value={this.state.transactionToSubmit.employee}
              onChange={this.handleChange('employee')}
            >
              <FormControlLabel
                value="Maurilio"
                control={
                  <Radio
                    color="primary"
                    inputProps={{
                      required: true
                    }}
                  />
                }
                label="Maurilio"
              />
              <FormControlLabel
                value="Victor"
                control={<Radio color="primary" />}
                label="Victor"
              />
              <FormControlLabel
                value="Danúbia"
                control={<Radio color="primary" />}
                label="Danúbia"
              />
              <FormControlLabel
                value="Samuel"
                control={<Radio color="primary" />}
                label="Samuel"
              />
            </RadioGroup>
          </FormControl>

          <FormControl
            component="fieldset"
            required
            className={classes.textField}
          >
            <FormLabel component="legend">Comissão</FormLabel>
            <RadioGroup
              aria-label="commisson"
              name="commisson"
              className={classes.group}
              value={`${this.state.transactionToSubmit.commisson}`}
              onChange={this.handleChange('commisson')}
            >
              <FormControlLabel
                value="15"
                control={
                  <Radio
                    color="primary"
                    inputProps={{
                      required: true
                    }}
                  />
                }
                label="15%"
              />
              <FormControlLabel
                value="20"
                control={<Radio color="primary" />}
                label="20%"
              />

              <FormControlLabel
                value="30"
                control={<Radio color="primary" />}
                label="30%"
              />
              <FormControlLabel
                value="40"
                control={<Radio color="primary" />}
                label="40%"
              />
            </RadioGroup>
          </FormControl>

          <FormControl
            component="fieldset"
            required
            className={classes.textField}
          >
            <FormLabel component="legend">Gênero</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender"
              className={classes.group}
              value={this.state.transactionToSubmit.gender}
              onChange={this.handleChange('gender')}
            >
              <FormControlLabel
                value="F"
                control={
                  <Radio
                    color="primary"
                    inputProps={{
                      required: true
                    }}
                  />
                }
                label="Feminino"
              />
              <FormControlLabel
                value="M"
                control={<Radio color="primary" />}
                label="Masculino"
              />
            </RadioGroup>
          </FormControl>

          <FormControl
            component="fieldset"
            required
            className={classes.textField}
          >
            <FormLabel component="legend">Pagamento</FormLabel>
            <RadioGroup
              aria-label="paymentStatus"
              name="paymentStatus"
              className={classes.group}
              value={this.state.transactionToSubmit.paymentStatus}
              onChange={this.handleChange('paymentStatus')}
            >
              <FormControlLabel
                value="pago"
                control={
                  <Radio
                    color="primary"
                    inputProps={{
                      required: true
                    }}
                  />
                }
                label="pago"
              />
              <FormControlLabel
                value="deve"
                control={<Radio color="primary" />}
                label="deve"
              />
            </RadioGroup>
          </FormControl>

          <TextField
            value={this.state.transactionToSubmit.client}
            label="Cliente"
            onChange={this.handleChange('client')}
            className={classes.textField}
          />

          <TextField
            value={this.state.transactionToSubmit.date}
            label="Data"
            type="datetime-local"
            onChange={this.handleChange('date')}
            className={classes.textField}
          />

          <br />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Salvar
          </Button>
        </form>
        <Typography
          variant="subtitle1"
          color="inherit"
          className={classes.title}
        >
          Últimas vendas
        </Typography>

        <TransactionList transactions={this.lastTransactions()} />

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={this.state.isMessageOpen}
          autoHideDuration={2000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id="message-id">Salvo com sucesso</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Cart);
