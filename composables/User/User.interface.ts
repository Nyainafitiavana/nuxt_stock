export interface IUser {
    uuid?: string;
    firstName: string;
    lastName: string;
    isAdmin?: boolean;
    email: string;
    phone: string;
}
export interface FormStateUser {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    isAdmin?: boolean;
    password?: string;
}