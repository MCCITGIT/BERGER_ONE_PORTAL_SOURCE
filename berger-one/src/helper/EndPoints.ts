export const BASE_ENDPOINTS = {
    v1: 'v1.0/',
    login: 'Login/',
    User: 'User/',
    Dashboard: 'Dashboard/',
    PROTECTON: 'PROTECTON/',
    common: 'Common/',
    Epca: 'Epca/',
    Legal: 'Legal/',
    Report: 'Report/',
    ProtectonDsr: 'PROTECTON/DSR/',
    ProtectonUserTracking: 'PROTECTON/UserTracking/',
    ProtectonClientTracking: 'PROTECTON/ClientTrack/',
    ProtectonDespatch: 'PROTECTON/Despatch/',
    ProtectonStock: 'PROTECTON/Stock/',
    ProtectonInvoice: 'PROTECTON/Invoice/',
    ProtectonPaymentReceipt: 'PROTECTON/PaymentReceipt/',
    ProtectonOS: 'PROTECTON/OS/',
    ProtectonBilling: 'PROTECTON/Billing/',
    ProtectonPotentialLead: 'PROTECTON/PotentialLead/',
    TransactOS: 'PROTECTON/OS/',
    ProtectonDashboard: 'PROTECTON/Dashboard/',
    ProtectonReport: 'PROTECTON/Report/',
};

const ALL_ENDPOINTS = {
    //#region SOUMYA SHUBHRA ROY AND SUBHRAJIT MUKHERJEE
    // ========### Login Module ###========
    // ValidateLogin: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.login + 'ValidateLogin',
    // UserDeviceRegistration: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.login + 'UserDeviceRegistration',
    // Login: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.login + 'Login',
    Login: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.login + 'LoginVr1',
    RefreshToken: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.login + 'RefreshToken',
    RefreshTokenV1: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.login + 'RefreshTokenV2',
    // RefreshTokenV1: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.login + 'RefreshTokenV1',

    GetUserList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetUserList',
    GetUserDetails: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetUserDetails',

    FormMenuMasterList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'FormMenuMasterList',
    FormMenuMasterInsert: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'FormMenuMasterInsert',

    GetUserApplicableApp: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetUserApplicableApp',
    GetUserApplicableMenu: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetUserApplicableMenu',

    GetAllParentMenu: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetAllParentMenu',
    GetAppList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetAppList',
    GetAppList_Vrn1: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetAppList_Vrn1',

    GetAllUserGroup: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetAllUserGroup',
    GetUserApplicableForm: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetUserApplicableForms',
    GetUserAvailableForm: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetUserAvailableForms',
    GetUserListByGroup: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetUserListByGroup',
    UserFormAccessInsert: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'UserFormAccessInsert',
    PasswordEncryptDecrypt: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'PasswordEncryptDecrypt',
    ValidateIFSC: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'ValidateIFSC',

    GetMWAStatus: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Dashboard + 'GetMWAStatus',

    GetTlvRevisionList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetTlvRevisionList',

    GetePCADepotApprovalList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetePCADepotApprovalList',
    GetePCARsmApprovalDetails: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetePCARsmApprovalDetails',
    GetTlvDepotApprovalList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetTlvDepotApprovalList',
    GetePCAHoApprovalList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetePCAHoApprovalList',
    GetePCAHoApprovalDetails: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetePCAHoApprovalDetails',

    GetProtectonApplicableTerr: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetProtectonApplicableTerr',
    GetProtectonApplicableDepot: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetProtectonApplicableDepot',
    GetReportingUser: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetReportingUser',
    GetDeptList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetDeptList',
    GetApplicableDepotList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetApplicableDepotList',
    GetApplicableDepot: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetApplicableDepot',
    GetApplicableAppList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetApplicableAppList',
    GetAllUserGroupList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetAllUserGroupList',
    GetTerrDepotWise: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetTerrDepotWise',
    UserProfileInsert: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'UserProfileInsert',
    GetPcaList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetPcaList',
    GetPcaRsmList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetPcaRsmList',
    GetApplicableTerrList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetApplicableTerrList',
    CommonLovDetails: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'CommonLovDetails',
    GetRegion: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetRegion',
    GetStateList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetStateList',


    GetPcaStatusList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetPcaStatusList',
    GetPcaDealersList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetPcaDealersList',
    GetPcaProjectListByDepotTerr: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetPcaProjectListByDepotTerr',
    GetSKUList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetSKUList',
    GetPcaBillToList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetPcaBillToList',
    GetFactoryListBySKU: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetFactoryListBySKU',
    GetPcaMinRateBySku_Vr1: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetPcaMinRateBySku_Vr1',
    InsertePcaDetails_Vr1: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'InsertePcaDetails_Vr1',
    PcaDetailsGetStatus: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'PcaDetailsGetStatus',
    PcaDetailsGetDtl: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'PcaDetailsGetDtl',
    DeletePcaDetails: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'DeletePcaDetails',
    PcaCancellationGetList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'PcaCancellationGetList',
    PcaCancellationUpdate: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'PcaCancellationUpdate',
    GetTlvStatusList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetTlvStatusList',
    GetTlvRSMApprovalList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetTlvRSMApprovalList',
    GetTlvRevisionLogDetails: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetTlvRevisionLogDetails',
    TlvRevisionApproval: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'TlvRevisionApproval',
    GetTlvHOApprovalList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetTlvHOApprovalList',
    TlvGetTermDetails: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'TlvGetTermDetails',
    GetTlvHoCommercialApprovalList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetTlvHoCommercialApprovalList',
    GetePCADepotApprovalDetails: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetePCADepotApprovalDetails',
    GetePCADetailsView: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetePCADetailsView',
    PcaApprovalDetailsSubmit: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'PcaApprovalDetailsSubmit',
    GetEpcaGpGcRateDtls: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetEpcaGpGcRateDtls',
    PcaHoApprovalDetailsSubmit: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'PcaHoApprovalDetailsSubmit',
    GetBillToDetails: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetBillToDetails',
    TlvDetailsSubmit: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'TlvDetailsSubmit',
    GetTlvDetails: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetTlvDetails',

    GetLegalStatusList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetLegalStatusList',
    GetLegalOutStandingApprovalList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Legal + 'GetLegalOutStandingApprovalList',
    // LegalCaseApprovalAsmReport: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Report + 'LegalCaseApprovalAsmReport',
    LegalCaseApprovalAsmReport: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Report + 'GetLegalCaseApprovalAsmReport',
    GetProjectList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetProjectList',
    GetCalculatedGC: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetCalculatedGC',
    GetUserApplicableDealer: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetUserApplicableDealer',

    // Protecton DSR
    UserApplDlrSales: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonDsr + 'UserApplDlrSales',
    UserApplDlrSalesDtls: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonDsr + 'UserApplDlrSalesDtls',
    
    // Protecton user tracking
    GetProtectonRegion: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetProtectonRegion', //
    // GetUserGroup: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetUserGroup', //
    // GetApplicableUserList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetApplicableUserList', //
    GetUserCollectionList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonUserTracking + 'GetUserCollectionList',
    GetVisitHistoryUserwise: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonUserTracking + 'GetVisitHistoryUserwise',
    
    // Protecton client tracking
    GetCTDealer: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonClientTracking + 'GetCTDealer',
    GetCTDetail: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonClientTracking + 'GetCTDetail',
    

    // Protecton Outstanding
    UserApplDlrOSDtls: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.TransactOS + 'UserApplDlrOSDtls',
    UserApplDlrOSSingle: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.TransactOS + 'UserApplDlrOSSingle',
    UserApplDlrOSTrx: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.TransactOS + 'UserApplDlrOSTrx',


    //Protecton Despatch
    GetDespatchDetails: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonDespatch + 'GetDespatchDetails',

    // Protecton Stock
    GetPrdList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonStock + 'GetPrdList',
    GetShdList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonStock + 'GetShdList',
    GetSkuList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonStock + 'GetSkuList',
    GetActionCatList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonStock + 'GetActionCatList',
    ActionDefaulterList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonStock + 'ActionDefaulterList',
    GetActionRcList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonStock + 'GetActionRcList',

    // Protecton Invoice
    GetInvoiceDetails: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonInvoice + 'GetInvoiceDetails',

    // Protecton Payment Receipt
    GetPRList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonPaymentReceipt + 'GetPRList',

    // Transact OS
    ODbyDateList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonOS + 'ODbyDateList',

    // Transact Billing
    GetBillingList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonBilling + 'GetBillingList',
    GetBillingDetails: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonBilling + 'GetBillingDetails',
    GetBillingTLVBalance: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonBilling + 'GetBillingTLVBalance',
    InsertBillingSKU: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonBilling + 'InsertBillingSKU',

    // Transact Potential Lead
    PCADtlsBillto: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonPotentialLead + 'PCADtlsBillto',
    GetPCASkuBillingDetails: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonPotentialLead + 'GetPCASkuBillingDetails',

    // ProtectonDashboard
    GetDashboardLeadFunnelData: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonDashboard + 'GetDashboardLeadFunnelData',
    GetDashboardSalesData: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonDashboard + 'GetDashboardSalesData',
    ProtectonGetMWAStatus: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonDashboard + 'GetMWAStatus',
    GetUserGroup: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonDashboard + 'GetUserGroup',
    GetApplicableUserList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonDashboard + 'GetApplicableUserList',
    GetDashboardLeadData: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonDashboard + 'GetDashboardLeadData',

    // Potential Lead
    GetVerticalWisBusinessLine: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonPotentialLead + 'GetVerticalWisBusinessLine',
    ProLeadInsert: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonPotentialLead + 'ProLeadInsert',
    GetDealerSearch: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonPotentialLead + 'GetDealerSearch',
    GetStakeHolderList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonPotentialLead + 'GetStakeHolderList',
    GetStateListPotentialLead: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonPotentialLead + 'GetStateList',

    // 
    getmwadetailsdatav5: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.ProtectonReport + 'getmwadetailsdatav5',

    //#endregion
};

export const ENDPOINTS = {
    BASE_URL_DEV: 'https://bpilmobile.bergerindia.com/ONE_PORTAL_API/api/',
    BASE_URL_PROD: 'https://bpilmobile.bergerindia.com/ONE_PORTAL_API/api/',

    // BASE_URL_DEV: 'https://localhost:36554/api/',
    // BASE_URL_PROD: 'https://localhost:36554/api/',
    ...ALL_ENDPOINTS,
};

export const BASE_URL = process.env.NODE_ENV === 'development' ? ENDPOINTS.BASE_URL_DEV : ENDPOINTS.BASE_URL_PROD;