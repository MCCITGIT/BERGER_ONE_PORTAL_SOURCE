import { HTTP_POST, HTTP_GET } from "../../../helper/ApiCall";
import { ENDPOINTS } from "../../../helper/EndPoints";

export function GetBillingList<P, G>(data: any): Promise<G> {
    return HTTP_GET<P, G>(data, ENDPOINTS.GetBillingList) as Promise<G>;
}

export function GetBillingDetails<P, G>(data: any): Promise<G> {
    return HTTP_GET<P, G>(data, ENDPOINTS.GetBillingDetails) as Promise<G>;
}

export function GetBillingTLVBalance<P, G>(data: any): Promise<G> {
    return HTTP_GET<P, G>(data, ENDPOINTS.GetBillingTLVBalance) as Promise<G>;
}

export function InsertBillingSKU<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.InsertBillingSKU) as Promise<G>;
}