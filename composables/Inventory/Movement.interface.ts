import type {IStatus} from "~/composables/Status.interface";
import type {IUser} from "~/composables/User/User.interface";
import type {IProduct} from "~/composables/Product/Product.interface";
import type {IProductSalesPrice} from "~/composables/Product/ProductSalesPrice.interface";

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
    uuid: string;
    product: IProduct;
    quantity: number;
    isUnitPrice: boolean;
    salesPrice: IProductSalesPrice;
}

export interface IFormDetails {
    idProduct: string;
    isUnitPrice: boolean;
    quantity: number;
}

export interface IBodyMovement {
    isSales: boolean;
    details: IFormDetails[];
}