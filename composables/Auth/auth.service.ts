import type {IUser} from "~/composables/User/User.interface";
import {EnvApiConfig} from "~/composables/Env.config";
import type {AuthInterface} from "~/composables/Auth/auth.interface";

/*
export const registerUser = async (
    email: string,
    firstName: string,
    lastName: string,
    password: string
): Promise<IUser> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const response: any = await fetch(`${BASE_URL_API}/${API.REGISTER}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, firstName, lastName, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        const newUser: IUser = await response.json();
        return newUser;
    } catch (error) {
        throw error;
    }
};*/

export const loginUser = async (userData: { email: string, password: string }): Promise<AuthInterface> => {
    try {
        const BASE_URL_API = EnvApiConfig.host + ':' + EnvApiConfig.port;
        const response = await fetch(`${BASE_URL_API}${API.LOGIN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data: AuthInterface = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return {
            message: data.message,
            access_token: data.access_token,
            is_admin: data.is_admin,
            id: data.id,
        };
    } catch (error) {
        throw error;
    }
};