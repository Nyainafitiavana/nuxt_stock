import {CustomError} from "~/composables/CustomError";
import type {ExecuteResponse, Paginate} from "~/composables/apiResponse.interface";
import type {TStatus} from "~/composables/Status.interface";
import {getAccessToken} from "~/composables/api";
import type {FormExpenseType, IExpenseType} from "~/composables/settings/ExpenseType/ExpenseType.interface";
import type {IExpenses} from "~/composables/Expenses/Expenses.interface";

export const getAllExpensesService = async (
    pageSize: number | string,
    currentPage: number | string,
    expensesTypeId: string,
    startDate: string,
    endDate: string,
    status: TStatus
): Promise<Paginate<IExpenses[]>> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const accessToken: string | null = getAccessToken();
        const response: any = await fetch(`${BASE_URL_API}${API.EXPENSES}?limit=${pageSize}&page=${currentPage}&expenseTypeId=${expensesTypeId}&startDate=${startDate}&endDate=${endDate}&status=${status}`, {
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

export const getOneExpenses = async (id: string): Promise<IExpenses> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const accessToken: string | null = getAccessToken();
        const response: any = await fetch(`${BASE_URL_API}${API.EXPENSES}/${id}`, {
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

export const insertOrUpdateExpenses = async (data: FormExpenseType, id: string | null, method: string): Promise<ExecuteResponse> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const path: string = id ? `${BASE_URL_API}${API.EXPENSES}/${id}` : `${BASE_URL_API}${API.EXPENSES}`;
        const accessTokenExpenses: string | null = getAccessToken();

        const response: any = await fetch(path, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessTokenExpenses}`
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

export const deleteExpensesService = async (id: string | null): Promise<ExecuteResponse> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const path: string = `${BASE_URL_API}${API.EXPENSES}/${id}`;
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
