export interface EmailOptions {
  to: string;
  subject: string;
  otp: number;
  html?: string;
}
export interface User{
    email:string,
    password:string
}
export interface UserRegistration{
    email:string;
    password:string;
    username:string;
}