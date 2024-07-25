import type {IUser} from "~/composables/User/User.interface";


export const registerUser = async (
    email: string,
    firstName: string,
    lastName: string,
    password: string
): Promise<IUser> => {
    try {
        const BASE_URL_API = window.location.protocol + '//' + window.location.hostname + ":3001";
        const response: any = await fetch(`${BASE_URL_API}${API.REGISTER}`, {
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
};

export const loginUser = async (userData: { email: string, password: string }): Promise<{ message: string, user: IUser }> => {
    try {
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        throw error;
    }
};