export const API = {
    "LOGIN" : "/api/auth/login",
    "USER" : "/api/user",
    "CATEGORY" : "/api/category",
}

export const getAccessToken = (): string | null => {
    return localStorage.getItem("access_token");
}