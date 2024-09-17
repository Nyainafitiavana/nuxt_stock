import {getAccessToken} from "~/composables/api";
import {CustomError} from "~/composables/CustomError";
import type {ICashDetail, ICashGlobalSummary} from "~/composables/cash/cashSummary.interface";

const BASE_URL_API: string = EnvApiConfig.host + ':' + EnvApiConfig.port;

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

export const getCashDetailsService = async (type: 'weekly' | 'monthly' | 'yearly'): Promise<ICashDetail[]> => {
    const response: any = await fetch(`${BASE_URL_API}${API.CASH_DETAIL}/${type}`, {
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