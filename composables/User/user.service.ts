import type {IUser} from "~/composables/User/User.interface";
import {CustomError} from "~/composables/CustomError";

export const getOneUser = async (id: string): Promise<IUser> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const accessToken: string | null = localStorage.getItem("access_token");
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

        const user: IUser = await response.json();
        return user;
    } catch (error) {
        throw error;
    }
};

export const insertOrUpdateUser = async (data: IUser, id: string | null, method: string): Promise<IUser> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const path: string = id ? `${BASE_URL_API}${API.USER}/${id}` : `${BASE_URL_API}${API.USER}`;
        const accessToken: string | null = localStorage.getItem("access_token");

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

        const newUser: IUser = await response.json();
        return newUser;
    } catch (error) {
        throw error;
    }
};
