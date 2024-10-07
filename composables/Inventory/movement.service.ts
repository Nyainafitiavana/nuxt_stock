import {CustomError} from "~/composables/CustomError";
import type {ExecuteResponse, Paginate} from "~/composables/apiResponse.interface";
import type {TStatus} from "~/composables/Status.interface";
import {getAccessToken} from "~/composables/api";
import type {
    IBodyMovement,
    IDetails,
    IFormDetails,
    IFormReject, IHistoryValidation,
    IMovement
} from "~/composables/Inventory/Movement.interface";
import {EnvApiConfig} from "~/composables/Env.config";

const BASE_URL_API: string = `${window.location.protocol}//${window.location.hostname}:${EnvApiConfig.port}`;

export const getAllMovementService = async (
    isSales: boolean,
    pageSize: number | string,
    currentPage: number | string,
    status: TStatus,
    startDate: string,
    endDate: string,
): Promise<Paginate<IMovement[]>> => {
    let response: Response;
    [response] = await Promise.all(
        [
            fetch(
            `${BASE_URL_API}${API.MOVEMENT}?limit=${pageSize}&page=${currentPage}&isSales=${isSales}&status=${status}&startDate=${startDate}&endDate=${endDate}`,
            {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getAccessToken()}`
                    },
                }
            )
        ]
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new CustomError(errorData.message, response.status);
    }

    return await response.json();
};

export const getAllDetailsMovementService = async (idMovement: string): Promise<IDetails[]> => {
    const response: any = await fetch(`${BASE_URL_API}${API.MOVEMENT}/${idMovement}/details`, {
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

export const getAllHistoryValidationMovementService = async (idMovement: string): Promise<IHistoryValidation[]> => {
    const response: any = await fetch(`${BASE_URL_API}${API.MOVEMENT}/${idMovement}/history/validation`, {
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

export const updateDetailMovementService = async (
    idMovement: string,
    details: IFormDetails[],
): Promise<ExecuteResponse> => {
    const response: any = await fetch(`${BASE_URL_API}${API.MOVEMENT}/${idMovement}/update_details`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify({ details: details }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new CustomError(errorData.message, response.status);
    }

    return await response.json();
};

export const validateOrRejectMovementService = async (
    idMovement: string,
    isValidate: boolean,
    observation: IFormReject | null,
): Promise<ExecuteResponse> => {
    const path = `${BASE_URL_API}${API.MOVEMENT}/${idMovement}/${isValidate ? 'validate' : 'reject'}`;

    const response: any = await fetch(path, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
        body: observation ? JSON.stringify(observation) : '',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new CustomError(errorData.message, response.status);
    }

    return await response.json();
};

export const createNewMovementService = async (
    isSales: boolean,
    details: IFormDetails[]
): Promise<IMovement> => {
    const data: IBodyMovement = {
        isSales: isSales,
        details: details,
    }

    const response: any = await fetch(`${BASE_URL_API}${API.MOVEMENT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new CustomError(errorData.message, response.status);
    }

    return await response.json();
};
