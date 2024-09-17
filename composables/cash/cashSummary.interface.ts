export interface ICashGlobalSummary {
    initial_cash: number;
    presentSalesAmount: number;
    presentPurchaseAmount: number;
    presentExpensesAmount: number;
    totalAmountSales: number;
    totalAmountPurchase: number;
    amountExpenses: number;
    amount_output: number;
    amount_input: number;
    real_cash: number;
}

export interface ICashDetail {
    "x_series": string,
    "total_purchase_price": number,
    "total_sales": number,
    "total_expenses": number,
    "benefits": number,
    "loss": number
}