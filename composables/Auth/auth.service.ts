import {EnvApiConfig} from "~/composables/Env.config";
import type {AuthInterface} from "~/composables/Auth/auth.interface";

export const loginUser = async (userData: { email: string, password: string }): Promise<AuthInterface> => {
    const BASE_URL_API: string = `${window.location.protocol}//${window.location.hostname}:${EnvApiConfig.port}`;
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