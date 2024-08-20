import type {IStatus} from "~/composables/Status.interface";
import type {IUser} from "~/composables/User/User.interface";

export interface IMovement {
    uuid: string;
    createdAt: string;
    updatedAt: string;
    isSales: boolean;
    editor: IUser;
    validator: IUser | null;
    status: IStatus;
}

export interface IDetails {
    idProduct: string;
    isUnitPrice: boolean;
    quantity: number;
}

export interface IBodyMovement {
    isSales: boolean;
    details: IDetails[];
}