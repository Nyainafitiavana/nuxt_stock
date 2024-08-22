import {CustomError} from "~/composables/CustomError";
import type {ExecuteResponse, Paginate} from "~/composables/apiResponse.interface";
import type {TStatus} from "~/composables/Status.interface";
import type {FormCategory, ICategory} from "~/composables/Category/Category.interface";
import {getAccessToken} from "~/composables/api";
import type {IBodyMovement, IDetails, IFormDetails, IMovement} from "~/composables/Inventory/Movement.interface";

export const getAllMovementService = async (
    isSales: boolean,
    pageSize: number | string,
    currentPage: number | string,
    status: TStatus
): Promise<Paginate<IMovement[]>> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const accessToken: string | null = getAccessToken();
        const response: any = await fetch(`${BASE_URL_API}${API.MOVEMENT}?limit=${pageSize}&page=${currentPage}&isSales=${isSales}&status=${status}`, {
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

export const getAllDetailsMovementService = async (idMovement: string): Promise<IDetails[]> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const accessToken: string | null = getAccessToken();
        const response: any = await fetch(`${BASE_URL_API}${API.MOVEMENT}/${idMovement}/details`, {
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

export const updateDetailMovementService = async (
    idMovement: string,
    details: IFormDetails[],
): Promise<ExecuteResponse> => {
    console.log(details);
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const accessTokenCategory: string | null = getAccessToken();

        const response: any = await fetch(`${BASE_URL_API}${API.MOVEMENT}/${idMovement}/update_details`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessTokenCategory}`
            },
            body: JSON.stringify({ details: details }),
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

export const insertOrUpdateMovement = async (
    isSales: boolean,
    details: IDetails[],
    idMovement: string | null,
    method: string
): Promise<IMovement> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const path: string = idMovement ? `${BASE_URL_API}${API.MOVEMENT}/${idMovement}` : `${BASE_URL_API}${API.MOVEMENT}`;
        const accessTokenCategory: string | null = getAccessToken();
        const data: IBodyMovement = {
            isSales: isSales,
            details: details,
        }

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

export const deleteMovementService = async (id: string | null): Promise<IMovement> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const path: string = `${BASE_URL_API}${API.CATEGORY}/${id}`;
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
