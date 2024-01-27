import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class productsPutOnMarket{
    name_of_product:string
    price:number

    description:string
   
    quantity:number

    category:number
    files:any
}