export const API = {
    "LOGIN" : "/api/auth/login",
    "USER" : "/api/user",
    "CATEGORY" : "/api/category",
    "UNIT" : "/api/unit",
    "PRODUCT" : "/api/product",
    "PRODUCT_SALES_PRICE" : "/api/sales-price",
    "MOVEMENT" : "/api/movement",
    "SETTINGS" : "/api/settings",
    "CURRENCY_TYPE" : "/api/settings/currency/type",
    "EXPENSE_TYPE" : "/api/expense-type",
    "EXPENSES" : "/api/expenses",
    "CASH_SUMMARY_GLOBAL" : "/api/cash-register/global",
    "PROFIT_LOSS" : "/api/cash-register/profit-loss",
    "SALES_PURCHASE" : "/api/cash-register/sales-purchase",
    "EXPENSES_CASH" : "/api/cash-register/expenses",
    "REVENUE_CASH" : "/api/cash-register/revenue",
    "INVOICE_PDF" : "/api/invoice/pdf/",
    "INVOICE_LIST" : "/api/invoice/movement/"
}

export const getAccessToken = (): string | null => {
    return localStorage.getItem("access_token");
}