import {CustomError} from "~/composables/CustomError";
import type {Paginate} from "~/composables/apiResponse.interface";
import type {TStatus} from "~/composables/Status.interface";
import {getAccessToken} from "~/composables/api";
import type {FormProduct, IProduct, IProductRemainingStock} from "~/composables/Product/Product.interface";
import type {FormProductSalesPrice, IProductSalesPrice} from "~/composables/Product/ProductSalesPrice.interface";

export const getAllDataProductService = async (
    keyword: string,
    pageSize: number,
    currentPage: number,
    status: TStatus,
    category: string,
    unit: string,
): Promise<Paginate<IProduct[]>> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const accessToken: string | null = getAccessToken();
        const response: any = await fetch(`${BASE_URL_API}${API.PRODUCT}?limit=${pageSize}&page=${currentPage}&value=${keyword}&status=${status}&category=${category}&unit=${unit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new CustomError(errorData.message, response.status);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getAllDataProductSalesPriceService = async (
    pageSize: number,
    currentPage: number,
    idProduct: string
): Promise<Paginate<IProductSalesPrice[]>> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const accessToken: string | null = getAccessToken();
        const response: any = await fetch(`${BASE_URL_API}${API.PRODUCT_SALES_PRICE}/product/${idProduct}?limit=${pageSize}&page=${currentPage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new CustomError(errorData.message, response.status);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const insertOrUpdateProduct = async (data: FormProduct, id: string | null, method: string): Promise<IProduct> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const path: string = id ? `${BASE_URL_API}${API.PRODUCT}/${id}` : `${BASE_URL_API}${API.PRODUCT}`;
        const accessTokenCategory: string | null = getAccessToken();

        const response: any = await fetch(path, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessTokenCategory}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new CustomError(errorData.message, response.status);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const insertNewProductSalePrice = async (data: FormProductSalesPrice): Promise<IProductSalesPrice> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const path: string = `${BASE_URL_API}${API.PRODUCT_SALES_PRICE}`;
        const accessTokenCategory: string | null = getAccessToken();

        const response: any = await fetch(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessTokenCategory}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new CustomError(errorData.message, response.status);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteProductService = async (id: string | null): Promise<IProduct> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const path: string = `${BASE_URL_API}${API.PRODUCT}/${id}`;
        const accessToken: string | null = getAccessToken();

        const response: any = await fetch(path, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new CustomError(errorData.message, response.status);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getAllProductWithRemainingStockService = async (
    keyword: string = null,
    limit: number = null,
    page: number = null,
): Promise<IProductRemainingStock[]> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const accessToken: string | null = getAccessToken();
        const path: string = limit && page && keyword ? `${BASE_URL_API}${API.PRODUCT}/remaining/stock?limit=${limit}&page=${page}&value=${keyword}` : `${BASE_URL_API}${API.PRODUCT}/remaining/stock`;
        const response: any = await fetch(path, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new CustomError(errorData.message, response.status);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

