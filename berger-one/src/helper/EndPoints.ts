const BASE_ENDPOINTS = {
    v1: 'v1.0/',
    login: 'Login/',
    User: 'User/',
    Dashboard: 'Dashboard/',
    PROTECTON: 'PROTECTON/',
    common: 'Common/',
    Epca: 'Epca/',
    Legal: 'Legal/',
    Report: 'Report/',
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

    GetUserGroup: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Dashboard + 'GetUserGroup',
    GetApplicableUserList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Dashboard + 'GetApplicableUserList',
    GetMWAStatus: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Dashboard + 'GetMWAStatus',

    GetTlvRevisionList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetTlvRevisionList',

    GetePCADepotApprovalList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetePCADepotApprovalList',
    GetePCARsmApprovalDetails: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetePCARsmApprovalDetails',
    GetTlvDepotApprovalList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetTlvDepotApprovalList',
    GetePCAHoApprovalList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetePCAHoApprovalList',
    GetePCAHoApprovalDetails: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetePCAHoApprovalDetails',

    GetReportingUser: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetReportingUser',
    GetDeptList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetDeptList',
    GetApplicableDepotList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetApplicableDepotList',
    GetApplicableAppList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetApplicableAppList',
    GetAllUserGroupList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetAllUserGroupList',
    GetTerrDepotWise: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetTerrDepotWise',
    UserProfileInsert: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'UserProfileInsert',
    GetPcaList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetPcaList',
    GetPcaRsmList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.Epca + 'GetPcaRsmList',
    GetApplicableTerrList: BASE_ENDPOINTS.v1 + BASE_ENDPOINTS.common + 'GetApplicableTerrList',
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