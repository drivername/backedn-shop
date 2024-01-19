export class UpdateUser{
    firstName:string
    lastName:string
    email:string
    action:'not_password_change'|'password_change'
    password:string
    whatIsChange:string
}