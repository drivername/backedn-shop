import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class AuthDtoCreateAccount{
    email:string
    firstName:string
    lastName:string
    password:string
    repeatPassword:string

    
}
export class AuthDtoLogin{
    email:string
    password:string

}