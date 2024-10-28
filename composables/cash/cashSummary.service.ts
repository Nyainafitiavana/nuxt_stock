import {getAccessToken} from "~/composables/api";
import {CustomError} from "~/composables/CustomError";
import type {
    ICashGlobalSummary,
    IExpensesCash,
    IProfitLoss, IRevenueCash,
    ISalesPurchase
} from "~/composables/cash/cashSummary.interface";
import {EnvApiConfig} from "~/composables/Env.config";

const BASE_URL_API: string = `${EnvApiConfig.host}:${EnvApiConfig.port}`;

export const getCashSummaryGlobalService = async (): Promise<ICashGlobalSummary> => {
    const response: any = await fetch(`${BASE_URL_API}${API.CASH_SUMMARY_GLOBAL}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new CustomError(errorData.message, response.status);
    }

    return await response.json();
};

export const getRevenueCashService = async (type: 'weekly' | 'monthly' | 'yearly'): Promise<IRevenueCash[]> => {
    const response: any = await fetch(`${BASE_URL_API}${API.EXPENSES_CASH}/${type}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new CustomError(errorData.message, response.status);
    }

    return await response.json();
};

export const getProfitAndLossService = async (type: 'weekly' | 'monthly' | 'yearly'): Promise<IProfitLoss[]> => {
    const response: any = await fetch(`${BASE_URL_API}${API.PROFIT_LOSS}/${type}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new CustomError(errorData.message, response.status);
    }

    return await response.json();
};

export const getSalesPurchaseService = async (type: 'weekly' | 'monthly' | 'yearly'): Promise<ISalesPurchase[]> => {
    const response: any = await fetch(`${BASE_URL_API}${API.SALES_PURCHASE}/${type}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new CustomError(errorData.message, response.status);
    }

    return await response.json();
};

export const getExpensesCashService = async (type: 'weekly' | 'monthly' | 'yearly'): Promise<IExpensesCash[]> => {
    const response: any = await fetch(`${BASE_URL_API}${API.EXPENSES_CASH}/${type}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new CustomError(errorData.message, response.status);
    }

    return await response.json();
};