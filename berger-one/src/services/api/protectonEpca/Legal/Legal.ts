import { HTTP_GET, HTTP_POST } from '../../../../helper/ApiCall';
import { ENDPOINTS } from '../../../../helper/EndPoints';

export function GetLegalOutStandingApprovalList<P, G>(data): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetLegalOutStandingApprovalList) as Promise<G>;
}

export function LegalCaseApprovalAsmReport<P, G>(data): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.LegalCaseApprovalAsmReport) as Promise<G>;
}

export function GetODOSApprovalMasters<P, G>(data: { region: string }): Promise<G> {
    return HTTP_GET<P, G>(data, ENDPOINTS.GetODOSApprovalMasters) as Promise<G>;
}

export function GetODOSApprovalDealers<P, G>(data: {
    year: string;
    month: string;
    region: string;
    depot: string;
    dealer_code: string;
    dealer_name: string;
    sbl: string;
    notice_yn: string;
    notice_yn_ho: string;
    from_value: string;
    to_value: string;
    status_code: string;
}): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.GetODOSApprovalDealers) as Promise<G>;
}

export function SaveODOSLegalAction<P, G>(data: {
    legalId: number;
    legalByno: number;
    noticeYn: string;
    noticeDesc: string;
}): Promise<G> {
    return HTTP_POST<P, G>(data, ENDPOINTS.SaveODOSLegalAction) as Promise<G>;
}
