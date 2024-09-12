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
    "CASH_SUMMARY" : "/api/cash-register",
}

export const getAccessToken = (): string | null => {
    return localStorage.getItem("access_token");
}