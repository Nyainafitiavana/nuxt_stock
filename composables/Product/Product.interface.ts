import type {IStatus} from "~/composables/Status.interface";
import type {ICategory} from "~/composables/Category/Category.interface";
import type {IProductSalesPrice} from "~/composables/Product/ProductSalesPrice.interface";
import type {IUnit} from "~/composables/Unit/Unit.interface";

export interface IProduct {
    uuid: string;
    designation: string;
    description: string;
    unit: IUnit;
    category: ICategory;
    productSalesPrice: IProductSalesPrice[];
    status: IStatus;
}

export interface FormProduct {
    designation: string;
    description: string;
    idCategory: string;
    idUnit: string;
}