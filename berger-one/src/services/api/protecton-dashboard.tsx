import { HTTP_GET, HTTP_POST } from "../../helper/ApiCall";
import { ENDPOINTS } from "../../helper/EndPoints";

export function GetDashboardLeadFunnelData<P, G>(data: any): Promise<G> {
    return HTTP_GET<P, G>(data, ENDPOINTS.GetDashboardLeadFunnelData) as Promise<G>;
}

export function GetDashboardSalesData<P, G>(data: any): Promise<G> {
    return HTTP_GET<P, G>(data, ENDPOINTS.GetDashboardSalesData) as Promise<G>;
}

export function GetMWAStatus<P, G>(data: any): Promise<G> {
    return HTTP_GET<P, G>(data, ENDPOINTS.ProtectonGetMWAStatus) as Promise<G>;
}

export function GetUserGroup<P, G>(data: any): Promise<G> {
    return HTTP_GET<P, G>(data, ENDPOINTS.GetUserGroup) as Promise<G>;
}

export function GetApplicableUserList<P, G>(data: any): Promise<G> {
    return HTTP_GET<P, G>(data, ENDPOINTS.GetApplicableUserList) as Promise<G>;
}

export function GetDashboardLeadData<P, G>(data: any): Promise<G> {
    return HTTP_GET<P, G>(data, ENDPOINTS.GetDashboardLeadData) as Promise<G>;
}