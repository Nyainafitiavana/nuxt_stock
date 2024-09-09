import type {IUser} from "~/composables/settings/User/User.interface";
import {CustomError} from "~/composables/CustomError";
import type {Paginate} from "~/composables/apiResponse.interface";
import type {TStatus} from "~/composables/Status.interface";
import {getAccessToken} from "~/composables/api";


export const getAllUser = async (
    keyword: string,
    pageSize: number,
    currentPage: number,
    status: TStatus,
): Promise<Paginate<IUser[]>> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const accessToken: string | null = getAccessToken();
        const response: any = await fetch(`${BASE_URL_API}${API.USER}?limit=${pageSize}&page=${currentPage}&value=${keyword}&status=${status}`, {
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

export const getOneUser = async (id: string): Promise<IUser> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const accessToken: string | null = getAccessToken();
        const response: any = await fetch(`${BASE_URL_API}${API.USER}/${id}`, {
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

export const insertOrUpdateUser = async (data: IUser, id: string | null, method: string): Promise<IUser> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const path: string = id ? `${BASE_URL_API}${API.USER}/${id}` : `${BASE_URL_API}${API.USER}`;
        const accessToken: string | null = getAccessToken();

        const response: any = await fetch(path, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
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

export const deleteUserService = async (id: string | null): Promise<IUser> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const path: string = `${BASE_URL_API}${API.USER}/${id}`;
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
