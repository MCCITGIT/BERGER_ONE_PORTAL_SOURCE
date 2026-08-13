// import { HTTP_GET } from '@/src/helper/ApiCall';
// import { ENDPOINTS } from '@/src/helper/EndPoints';

import { HTTP_GET, HTTP_POST } from "../../helper/ApiCall";
import { ENDPOINTS } from "../../helper/EndPoints";

export function ValidateLogin<P, G>(data: any): Promise<G> {
    return HTTP_GET<P, G>(data, ENDPOINTS.Login) as Promise<G>;
}

export function UserValidationForPassword<P, G>(data: { userId: string; mobileNo: string }): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.UserValidationForPassword) as Promise<G>;
}

export function PasswordValidateOTP<P, G>(data: { userId: string; mobileNo: string; otp: string }): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.PasswordValidateOTP) as Promise<G>;
}

export function ChangeUserPassword<P, G>(data: { userId: string; oldPassword: string; newPassword: string; mobileNo: string }): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.ChangeUserPassword) as Promise<G>;
}

export function RefreshToken<P, G>(data: { RefreshToken: string }): Promise<G> {
    return HTTP_GET<P, G>(data, ENDPOINTS.RefreshToken) as Promise<G>;
}

export function RefreshTokenV1<P, G>(data: any): Promise<G> {
    return HTTP_GET<P, G>(data, ENDPOINTS.RefreshTokenV1) as Promise<G>;
}
