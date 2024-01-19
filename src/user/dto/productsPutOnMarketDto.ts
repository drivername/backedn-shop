import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class productsPutOnMarket{
    @IsString()
    @IsNotEmpty()
    name_of_product:string
    @IsNotEmpty()
    @IsNumber()
    price:number
    @IsString()
    @IsNotEmpty()
    description:string
    @IsNotEmpty()
    @IsNumber()
    quantity:number
    @IsNumber()
    @IsNotEmpty()
    category:number
}