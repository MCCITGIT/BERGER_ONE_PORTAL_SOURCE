import { HTTP_GET, HTTP_POST } from "../../../helper/ApiCall";
import { BASE_ENDPOINTS } from "../../../helper/EndPoints";

const RMA_BASE = BASE_ENDPOINTS.v1 + 'RMA/';

export function GetApprovalPendingReturnInvoiceList<P, G>(data: any): Promise<G> {
    return HTTP_GET<P, G>(data, RMA_BASE + 'GetApprovalPendingReturnInvoiceList') as Promise<G>;
}

export function GetInvoiceReturnDetails<P, G>(data: any): Promise<G> {
    return HTTP_GET<P, G>(data, RMA_BASE + 'GetInvoiceReturnDetails') as Promise<G>;
}

export function GetRmaApprovalActionVisibility<P, G>(data: any): Promise<G> {
    return HTTP_GET<P, G>(data, RMA_BASE + 'GetRmaApprovalActionVisibility') as Promise<G>;
}

export function InvoiceReturnApprove<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, RMA_BASE + 'InvoiceReturnApprove') as Promise<G>;
}

export function GetRMAApplicableDepotList<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, RMA_BASE + 'GetRMAApplicableDepotList') as Promise<G>;
}

export function GetRMAApplicableRegionList<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, RMA_BASE + 'GetRMAApplicableRegionList') as Promise<G>;
}
