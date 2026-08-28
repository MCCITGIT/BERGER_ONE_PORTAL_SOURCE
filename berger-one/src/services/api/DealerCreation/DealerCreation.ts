import { HTTP_POST } from '../../../helper/ApiCall';
import { ENDPOINTS } from '../../../helper/EndPoints';

export function GetDcBusinessChannel<P, G>(data: any = {}): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDcBusinessChannel) as Promise<G>;
}

export function GetDcSubFunction<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDcSubFunction) as Promise<G>;
}

export function GetDcLovDetails<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDcLovDetails) as Promise<G>;
}

export function GetDcHoSalesList<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDcHoSalesList) as Promise<G>;
}

export function GetDealerCreationDetails<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDealerCreationDetails) as Promise<G>;
}

export function GetDcApprovalLog<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDcApprovalLog) as Promise<G>;
}

export function GetDcCustomerType<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDcCustomerType) as Promise<G>;
}

export function GetDcCustomerSubType<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDcCustomerSubType) as Promise<G>;
}

export function GetDcCustomerClass<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDcCustomerClass) as Promise<G>;
}

export function GetDcClubClass<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDcClubClass) as Promise<G>;
}

export function GetDcLeadByDepot<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDcLeadByDepot) as Promise<G>;
}

export function GetDcLeadDetailsById<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDcLeadDetailsById) as Promise<G>;
}

export function GetDcStateName<P, G>(data: any = {}): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDcStateName) as Promise<G>;
}

export function GetDcDistrict<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDcDistrict) as Promise<G>;
}

export function GetDcPaymentTerms<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDcPaymentTerms) as Promise<G>;
}

export function GetDcAddress1<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDcAddress1) as Promise<G>;
}

export function GetDcDnSlab<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDcDnSlab) as Promise<G>;
}

export function ValidateDcMotherAccount<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.ValidateDcMotherAccount) as Promise<G>;
}

export function ValidateDcMotherCodeGst<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.ValidateDcMotherCodeGst) as Promise<G>;
}

export function DcApprovalUpdate<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.DcApprovalUpdate) as Promise<G>;
}

export function ValidateDcGst<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.ValidateDcGst) as Promise<G>;
}

export function GetDcDocumentDownloadUrl<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetDcDocumentDownloadUrl) as Promise<G>;
}

export function DcHoSalesApprovalUpdate<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.DcHoSalesApprovalUpdate) as Promise<G>;
}

export function DcBackToAdminUpdate<P, G>(data: any): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.DcBackToAdminUpdate) as Promise<G>;
}
