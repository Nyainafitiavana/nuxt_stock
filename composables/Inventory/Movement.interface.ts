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
    detail_id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    category_id: string;
    category_name: string;
    unit_id: string;
    unit_name: string;
    is_unit_price: boolean;
    product_sales_price_id: string;
    unit_price: number;
    wholesale_price: number;
    purchase_price: number;
    remaining_stock: number;
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