import { IsNotEmpty, IsNumber } from "class-validator"

export class EditProduct{
    name_of_product:string

    description:string

   
    quantity:number 

   
    price:number

    
    id:number

 
    category:number

    file:any

    actualImg:any
}