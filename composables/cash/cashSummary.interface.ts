export interface ICashGlobalSummary {
    initial_cash: number;
    presentSalesAmount: number;
    presentPurchaseAmount: number;
    presentExpensesAmount: number;
    amount_output: number;
    amount_input: number;
    real_cash: number;
}

export interface IProfitLoss {
    x_series: string;
    total_profit_amount: number;
    total_loss_amount: number;
}

export interface ISalesPurchase {
    x_series: string;
    total_purchase_amount: number;
    total_sales_amount: number;
}

export interface IExpensesCash {
    x_series: string;
    total_expenses_amount: number;
}

export interface IRevenueCash {
    x_series: string;
    revenue: number;
}