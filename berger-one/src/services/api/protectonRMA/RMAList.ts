import { HTTP_POST } from "../../../helper/ApiCall";
import { BASE_ENDPOINTS } from "../../../helper/EndPoints";

const RMA_BASE = BASE_ENDPOINTS.v1 + 'RMA/';

export function GetRMAApprovalList<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, RMA_BASE + 'GetRMAApprovalList') as Promise<G>;
}

export function GetRMAApplicableDepotList<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, RMA_BASE + 'GetRMAApplicableDepotList') as Promise<G>;
}

export function GetRMAApplicableRegionList<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, RMA_BASE + 'GetRMAApplicableRegionList') as Promise<G>;
}
