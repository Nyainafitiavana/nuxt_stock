import type {IStatus} from "~/composables/Status.interface";
import type {ICategory} from "~/composables/Category/Category.interface";
import type {IProductSalesPrice} from "~/composables/Product/ProductSalesPrice.interface";

export interface IProduct {
    uuid: string;
    designation: string;
    description: string;
    category: ICategory;
    productSalesPrice: IProductSalesPrice[];
    status: IStatus;
}

export interface FormProduct {
    designation: string;
    description: string;
    idCategory: string;
}