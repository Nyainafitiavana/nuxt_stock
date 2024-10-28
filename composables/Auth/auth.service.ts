import {EnvApiConfig} from "~/composables/Env.config";
import type {AuthInterface} from "~/composables/Auth/auth.interface";

const BASE_URL_API: string = `${EnvApiConfig.host}:${EnvApiConfig.port}`;

export const loginUser = async (userData: { email: string, password: string }): Promise<AuthInterface> => {

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
};