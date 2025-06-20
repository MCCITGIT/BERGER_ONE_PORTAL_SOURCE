import { HTTP_GET, HTTP_POST } from "../../../helper/ApiCall";
import { ENDPOINTS } from "../../../helper/EndPoints";

export function GetProtectonRegion<P, G>(data: { lov_type: any; active: any }): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetProtectonRegion) as Promise<G>;
}
export function GetUserGroup<P, G>(data: { lov_type: any; active: any }): Promise<G> {
    return HTTP_GET<P, G>(data, ENDPOINTS.GetUserGroup) as Promise<G>;
}
export function GetApplicableUserList<P, G>(data: { lov_type: any; active: any }): Promise<G> {
    return HTTP_GET<P, G>(data, ENDPOINTS.GetApplicableUserList) as Promise<G>;
}

export function GetProtectonApplicableTerr<P, G>(data: { lov_type: any; active: any }): Promise<G> {
    return HTTP_GET<P, G>(data, ENDPOINTS.GetProtectonApplicableTerr) as Promise<G>;
}

export function GetReportingUser<P, G>(data: { userId: any; globalFilter: any }): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetReportingUser) as Promise<G>;
}

export function GetDeptList<P, G>(data: { lov_type: any; active: any }): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDeptList) as Promise<G>;
}

export function GetApplicableDepotList<P, G>(data: { user_id: any; region: any; app_id: any }): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetApplicableDepotList) as Promise<G>;
}

export function CommonLovDetails<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.CommonLovDetails) as Promise<G>;
}

export function GetAppList<P, G>(data: {}): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetAppList) as Promise<G>;
}

export function GetUserDetails<P, G>(data: { userId: any }): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetUserDetails) as Promise<G>;
}

export function GetApplicableAppList<P, G>(data: { user_id: any }): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetApplicableAppList) as Promise<G>;
}

export function GetAllUserGroupList<P, G>(data: { user_id: any }): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetAllUserGroupList) as Promise<G>;
}

export function GetTerrDepotWise<P, G>(data: { depot_code: any }): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetTerrDepotWise) as Promise<G>;
}

export function UserProfileInsert<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.UserProfileInsert) as Promise<G>;
}