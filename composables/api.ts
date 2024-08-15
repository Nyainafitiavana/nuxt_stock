export const API = {
    "LOGIN" : "/api/auth/login",
    "USER" : "/api/user",
    "CATEGORY" : "/api/category",
    "UNIT" : "/api/unit",
    "PRODUCT" : "/api/product",
    "PRODUCT_SALES_PRICE" : "/api/sales-price",
}

export const getAccessToken = (): string | null => {
    return localStorage.getItem("access_token");
}