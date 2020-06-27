import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomeTransactions = this.transactions.filter(
      transaction => transaction.type === 'income',
    );
    const outcomeTransactions = this.transactions.filter(
      transaction => transaction.type === 'outcome',
    );
    const incomeValues = incomeTransactions.map(
      transactionValue => transactionValue.value,
    );
    const outcomeValues = outcomeTransactions.map(
      transactionValue => transactionValue.value,
    );

    const income = incomeValues.reduce((total, atual) => total + atual, 0);

    const outcome = outcomeValues.reduce((total, atual) => total + atual, 0);

    const total = income - outcome;

    return { income, outcome, total };
  }

  public create({ title, type, value }: CreateTransactionDTO): Transaction {
    const { total } = this.getBalance();
    if (type === 'outcome' && total < value) {
      throw Error('Saldo insuficiente');
    }
    const transaction = new Transaction({ title, type, value });
    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
