import {getAccessToken} from "~/composables/api";
import {CustomError} from "~/composables/CustomError";
import type {ICashSummary} from "~/composables/cash/cashSummary.interface";

const BASE_URL_API: string = EnvApiConfig.host + ':' + EnvApiConfig.port;

export const getCashSummary = async (): Promise<ICashSummary> => {
    const response: any = await fetch(`${BASE_URL_API}${API.CASH_SUMMARY}`, {
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