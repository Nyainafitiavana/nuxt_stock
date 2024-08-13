export const API = {
    "LOGIN" : "/api/auth/login",
    "USER" : "/api/user",
    "CATEGORY" : "/api/category",
    "PRODUCT" : "/api/product",
}

export const getAccessToken = (): string | null => {
    return localStorage.getItem("access_token");
}