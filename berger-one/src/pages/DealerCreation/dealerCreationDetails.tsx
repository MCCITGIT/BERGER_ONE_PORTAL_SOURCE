import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { UseAuthStore } from '../../services/store/AuthStore';
import { GetApplicableDepotList, GetRegion } from '../../services/api/users/UserProfile';
import { GetApplicableTerrList } from '../../services/api/protectonEpca/EpcaList';
import {
    DcBackToAdminUpdate,
    DcHoSalesApprovalUpdate,
    GetDcAddress1,
    GetDcApprovalLog,
    GetDcBusinessChannel,
    GetDcClubClass,
    GetDcCustomerClass,
    GetDcCustomerSubType,
    GetDcCustomerType,
    GetDcDistrict,
    GetDcDnSlab,
    GetDcLeadByDepot,
    GetDcLeadDetailsById,
    GetDcLovDetails,
    GetDcPaymentTerms,
    GetDcStateName,
    GetDcSubFunction,
    GetDealerCreationDetails,
    ValidateDcMotherAccount,
    ValidateDcMotherCodeGst,
    ValidateDcGst,
    GetDcDocumentDownloadUrl,
} from '../../services/api/DealerCreation/DealerCreation';
import { ValidateIFSC } from '../../services/api/commons/global';
import { commonErrorToast, commonSuccessToast } from '../../services/functions/commonToast';

const SELECT = { value: '', label: 'Select' };
const YES_NO = [SELECT, { value: 'Y', label: 'Yes' }, { value: 'N', label: 'No' }];
const COUNTRY = [SELECT, { value: 'INDIA', label: 'INDIA' }];
const PRIMARY_SITE = [SELECT, { value: 'Y', label: 'Yes' }, { value: 'N', label: 'No' }];

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

type FormState = {
    requestId: string;
    reqDate: string;
    codeGenerationNo: string;
    newAccountCode: string;
    newBillToCode: string;
    region: string;
    depot: string;
    businessChannel: string;
    subFunction: string;
    customerClass: string;
    customerType: string;
    customerSubType: string;
    leadId: string;
    leadMobile: string;
    territory: string;
    gstinAvailable: string;
    gstFull: string;
    gstType: string;
    gstDate: string;
    panNo: string;
    firmType: string;
    aadhar: string;
    motherAccountCode: string;
    distributorParentAcc: string;
    retailerContactNo: string;
    retailerAlternateContactNo: string;
    clubClass: string;
    accountName: string;
    primarySite: string;
    state: string;
    district: string;
    city: string;
    country: string;
    discountType: string;
    address1: string;
    address2: string;
    address3: string;
    postalCode: string;
    isWhatsapp: boolean;
    primaryContactNo: string;
    primaryContactPerson: string;
    altContact1: string;
    altPerson1: string;
    securityAmount: string;
    securityAccNo: string;
    securityCheque: string;
    chequeNumber: string;
    reason: string;
    bankAccount: string;
    confirmBankAcc: string;
    ifsc: string;
    bankBranch: string;
    bankName: string;
    bankAcType: string;
    tradeNameBill: string;
    legalNameBill: string;
    tradeNameShip: string;
    legalNameShip: string;
    accountNo: string;
    billToCode: string;
    shipAddress1: string;
    shipAddress2: string;
    shipAddress3: string;
    shipState: string;
    shipDistrict: string;
    shipCity: string;
    shipPostal: string;
    shipGstType: string;
    shipGstFull: string;
    shipPanNo: string;
    alternateBusiness: { value: string; label: string }[];
    email: string;
    competitionDealer: string;
    financialTranYn: string;
    financialTranRemark: string;
    relativeOrFriend: string;
    relativeOrFriendRemark: string;
    paymentTerms: string;
    tlvAmount: string;
    creditLimit: string;
    creditDays: string;
    dn1Day: string;
    dn1Percent: string;
    dn2Day: string;
    dn2Percent: string;
    dn3Day: string;
    dn3Percent: string;
    dn4Day: string;
    dn4Percent: string;
    dn5Day: string;
    dn5Percent: string;
};

const emptyForm = (): FormState => ({
    requestId: '',
    reqDate: '',
    codeGenerationNo: '',
    newAccountCode: '',
    newBillToCode: '',
    region: '',
    depot: '',
    businessChannel: '',
    subFunction: '',
    customerClass: '',
    customerType: '',
    customerSubType: '',
    leadId: '',
    leadMobile: '',
    territory: '',
    gstinAvailable: '',
    gstFull: '',
    gstType: '',
    gstDate: '',
    panNo: '',
    firmType: '',
    aadhar: '',
    motherAccountCode: '',
    distributorParentAcc: '',
    retailerContactNo: '',
    retailerAlternateContactNo: '',
    clubClass: '',
    accountName: '',
    primarySite: 'Y',
    state: '',
    district: '',
    city: '',
    country: 'INDIA',
    discountType: '',
    address1: '',
    address2: '',
    address3: '',
    postalCode: '',
    isWhatsapp: false,
    primaryContactNo: '',
    primaryContactPerson: '',
    altContact1: '',
    altPerson1: '',
    securityAmount: '',
    securityAccNo: '',
    securityCheque: '',
    chequeNumber: '',
    reason: '',
    bankAccount: '',
    confirmBankAcc: '',
    ifsc: '',
    bankBranch: '',
    bankName: '',
    bankAcType: '',
    tradeNameBill: '',
    legalNameBill: '',
    tradeNameShip: '',
    legalNameShip: '',
    accountNo: '',
    billToCode: '',
    shipAddress1: '',
    shipAddress2: '',
    shipAddress3: '',
    shipState: '',
    shipDistrict: '',
    shipCity: '',
    shipPostal: '',
    shipGstType: '',
    shipGstFull: '',
    shipPanNo: '',
    alternateBusiness: [],
    email: '',
    competitionDealer: '',
    financialTranYn: '',
    financialTranRemark: '',
    relativeOrFriend: '',
    relativeOrFriendRemark: '',
    paymentTerms: '',
    tlvAmount: '',
    creditLimit: '',
    creditDays: '',
    dn1Day: '',
    dn1Percent: '',
    dn2Day: '',
    dn2Percent: '',
    dn3Day: '',
    dn3Percent: '',
    dn4Day: '',
    dn4Percent: '',
    dn5Day: '',
    dn5Percent: '',
});

const allowNumericKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'];
    if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;
    if (!/^[0-9]$/.test(e.key)) e.preventDefault();
};

const allowDecimalUpTo2 = (e: KeyboardEvent<HTMLInputElement>) => {
    const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'];
    if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;
    const el = e.currentTarget;
    const value = el.value;
    if (e.key === '.') {
        if (value.includes('.')) e.preventDefault();
        return;
    }
    if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        return;
    }
    const dotIndex = value.indexOf('.');
    if (dotIndex !== -1 && el.selectionStart != null && el.selectionStart > dotIndex) {
        if (value.substring(dotIndex + 1).length >= 2) e.preventDefault();
    }
};

const formatDate = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${d.getFullYear()}`;
};

const parseDdMmYyyy = (dateStr: string) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    if (!day || !month || !year) return '';
    return new Date(`${year}-${month}-${day}`);
};

const opt = (options: { value: string; label: string }[], value: string) =>
    options.find((o) => o.value === value) ?? (value ? { value, label: value } : SELECT);

const withSavedOption = (options: { value: string; label: string }[], value: string, label?: string) => {
    if (value && !options.some((o) => o.value === value)) {
        return [...options, { value, label: label || value }];
    }
    return options;
};

const SectionHeader = ({ title }: { title: string }) => (
    <div className="col-span-2 bg-[#d9edf7] text-[#31708f] text-center font-semibold text-sm py-1.5 px-2 rounded">
        {title}
    </div>
);

const FieldLabel = ({ label, required }: { label: string; required?: boolean }) => (
    <label className="block text-sm font-semibold mb-1">
        {label}
        {required && <span className="text-red-600"> *</span>}
    </label>
);

const DealerCreationDetails = () => {
    const navigate = useNavigate();
    const user = UseAuthStore((state: any) => state.userDetails);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm());
    const [gstMsg, setGstMsg] = useState('');
    const [panMsg, setPanMsg] = useState('');
    const [parentAccMsg, setParentAccMsg] = useState('');
    const [bankAccMsg, setBankAccMsg] = useState('');
    const [ifscMsg, setIfscMsg] = useState('');
    const [showIfscReset, setShowIfscReset] = useState(false);
    const [remarksModal, setRemarksModal] = useState<{ open: boolean; type: 'REJECT' | 'BACK_ADMIN' | 'APPROVE' | '' }>({
        open: false,
        type: '',
    });
    const [remarks, setRemarks] = useState('');

    const [regionList, setRegionList] = useState<any[]>([]);
    const [depotList, setDepotList] = useState<any[]>([]);
    const [terrList, setTerrList] = useState<any[]>([]);
    const [channelList, setChannelList] = useState<any[]>([]);
    const [subFunctionList, setSubFunctionList] = useState<any[]>([]);
    const [customerClassList, setCustomerClassList] = useState<any[]>([]);
    const [customerTypeList, setCustomerTypeList] = useState<any[]>([]);
    const [customerSubTypeList, setCustomerSubTypeList] = useState<any[]>([]);
    const [clubClassList, setClubClassList] = useState<any[]>([]);
    const [leadList, setLeadList] = useState<any[]>([]);
    const [stateList, setStateList] = useState<any[]>([]);
    const [districtList, setDistrictList] = useState<any[]>([]);
    const [shipDistrictList, setShipDistrictList] = useState<any[]>([]);
    const [firmTypeList, setFirmTypeList] = useState<any[]>([]);
    const [gstTypeList, setGstTypeList] = useState<any[]>([]);
    const [discountTypeList, setDiscountTypeList] = useState<any[]>([]);
    const [reasonList, setReasonList] = useState<any[]>([]);
    const [bankAcTypeList, setBankAcTypeList] = useState<any[]>([]);
    const [alternateBusinessList, setAlternateBusinessList] = useState<any[]>([]);
    const [paymentTermsList, setPaymentTermsList] = useState<any[]>([]);
    const [address1List, setAddress1List] = useState<any[]>([]);
    const [shipAddress1List, setShipAddress1List] = useState<any[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    const [approvalLog, setApprovalLog] = useState<any[]>([]);
    const [statusCode, setStatusCode] = useState('');

    const setField = (patch: Partial<FormState>) => setForm((pre) => ({ ...pre, ...patch }));

    const regionOptions = useMemo(
        () =>
            withSavedOption(
                [SELECT, ...regionList.map((d: any) => ({ value: d.depot_regn, label: d.regn_new || d.depot_regn }))],
                form.region
            ),
        [regionList, form.region]
    );
    const depotOptions = useMemo(
        () =>
            withSavedOption(
                [
                    SELECT,
                    ...depotList.map((d: any) => ({
                        value: d.depot_code,
                        label: d.depot_name ? `${d.depot_code}:${d.depot_name}` : d.depot_code,
                    })),
                ],
                form.depot
            ),
        [depotList, form.depot]
    );
    const terrOptions = useMemo(
        () =>
            withSavedOption(
                [SELECT, ...terrList.map((d: any) => ({ value: d.terr_code, label: d.terr_name || d.terr_code }))],
                form.territory
            ),
        [terrList, form.territory]
    );
    const channelOptions = useMemo(
        () => [SELECT, ...channelList.map((d: any) => ({ value: d.ddm_dept_name, label: d.ddm_dept_name }))],
        [channelList]
    );
    const subFunctionOptions = useMemo(
        () => [SELECT, ...subFunctionList.map((d: any) => ({ value: d.ddm_sub_dept_name, label: d.ddm_sub_dept_name }))],
        [subFunctionList]
    );
    const customerClassOptions = useMemo(
        () => [SELECT, ...customerClassList.map((d: any) => ({ value: d.dcc_customer_class, label: d.dcc_customer_class }))],
        [customerClassList]
    );
    const customerTypeOptions = useMemo(
        () => [SELECT, ...customerTypeList.map((d: any) => ({ value: String(d.cus_type_code), label: d.cus_type_name }))],
        [customerTypeList]
    );
    const customerSubTypeOptions = useMemo(
        () => [SELECT, ...customerSubTypeList.map((d: any) => ({ value: String(d.cus_sub_type_code), label: d.cus_sub_type_name }))],
        [customerSubTypeList]
    );
    const clubClassOptions = useMemo(
        () => [SELECT, ...clubClassList.map((d: any) => ({ value: d.dcc_club_category, label: d.dcc_club_category }))],
        [clubClassList]
    );
    const leadOptions = useMemo(
        () => [SELECT, ...leadList.map((d: any) => ({ value: String(d.lead_id), label: d.lead_name }))],
        [leadList]
    );
    const stateOptions = useMemo(
        () => [SELECT, ...stateList.map((d: any) => ({ value: d.state_code, label: d.state_name }))],
        [stateList]
    );
    const districtOptions = useMemo(
        () => [SELECT, ...districtList.map((d: any) => ({ value: d.lov_code, label: d.lov_value }))],
        [districtList]
    );
    const shipDistrictOptions = useMemo(
        () => [SELECT, ...shipDistrictList.map((d: any) => ({ value: d.lov_code, label: d.lov_value }))],
        [shipDistrictList]
    );
    const firmTypeOptions = useMemo(
        () => [SELECT, ...firmTypeList.map((d: any) => ({ value: d.lov_code, label: d.lov_value }))],
        [firmTypeList]
    );
    const gstTypeOptions = useMemo(
        () =>
            gstTypeList.length > 0
                ? [SELECT, ...gstTypeList.map((d: any) => ({ value: d.lov_code, label: d.lov_value }))]
                : YES_NO,
        [gstTypeList]
    );
    const discountTypeOptions = useMemo(
        () => [SELECT, ...discountTypeList.map((d: any) => ({ value: d.lov_code, label: d.lov_value }))],
        [discountTypeList]
    );
    const reasonOptions = useMemo(
        () => [SELECT, ...reasonList.map((d: any) => ({ value: d.lov_code, label: d.lov_value }))],
        [reasonList]
    );
    const bankAcTypeOptions = useMemo(
        () => [SELECT, ...bankAcTypeList.map((d: any) => ({ value: d.lov_code, label: d.lov_value }))],
        [bankAcTypeList]
    );
    const alternateBusinessOptions = useMemo(
        () => alternateBusinessList.map((d: any) => ({ value: d.lov_code, label: d.lov_value })),
        [alternateBusinessList]
    );
    const paymentTermsOptions = useMemo(
        () => [SELECT, ...paymentTermsList.map((d: any) => ({ value: d.payment_type_code, label: d.payment_type_name }))],
        [paymentTermsList]
    );
    const address1Options = useMemo(
        () => [SELECT, ...address1List.map((d: any) => ({ value: String(d.bill_to_id), label: d.bill_to_type }))],
        [address1List]
    );
    const shipAddress1Options = useMemo(
        () => [SELECT, ...shipAddress1List.map((d: any) => ({ value: String(d.ship_to_id), label: d.ship_to_type }))],
        [shipAddress1List]
    );

    const showCustomerClass = !!form.businessChannel && !!form.subFunction;
    const showLead =
        form.businessChannel?.toUpperCase() === 'RETAIL' &&
        form.subFunction?.toUpperCase() === 'PROLINK' &&
        form.customerType === '63';
    const showGst = form.gstinAvailable === 'Y';
    const showAadhaar = (form.firmType || '').toUpperCase().includes('PROPRIETOR');
    const showMother = (form.customerSubType || '').toUpperCase().includes('MOTHER');
    const showDistRetailer =
        (form.customerSubType || '').toUpperCase().includes('RETAIL') ||
        clubClassList.length > 0 ||
        !!form.distributorParentAcc;
    const showChequeNo = form.securityCheque === 'Y';
    const showTaxation = !!form.newAccountCode || form.gstinAvailable === 'Y';
    const showCredit = (form.discountType || '').toUpperCase().includes('CREDIT') || form.customerType === '53';
    const showHoActions = statusCode === 'HOSAP';

    const copyShipFromDepot = (next: Partial<FormState>) => {
        const merged = { ...form, ...next };
        setField({
            ...next,
            shipAddress1: merged.address1,
            shipAddress2: merged.address2,
            shipAddress3: merged.address3,
            shipState: merged.state,
            shipDistrict: merged.district,
            shipCity: merged.city,
            shipPostal: merged.postalCode,
            shipGstType: merged.gstType,
            shipGstFull: merged.gstFull,
            shipPanNo: merged.panNo,
        });
    };

    const GetRegions = async () => {
        const data: any = { user_group: user.group_code, app_id: 0 };
        try {
            const response: any = await GetRegion(data);
            setRegionList(response.data?.table || []);
        } catch {
            setRegionList([]);
        }
    };

    const GetDepots = async (region: string) => {
        const payload: any = { user_id: user.user_id, region: region || '', app_id: '15' };
        try {
            const response: any = await GetApplicableDepotList(payload);
            setDepotList(response.data || []);
        } catch {
            setDepotList([]);
        }
    };

    const GetTerrs = async (_region: string, depot: string) => {
        const payload: any = { user_id: user.user_id, depot_code: depot, app_id: '15' };
        try {
            const response: any = await GetApplicableTerrList(payload);
            setTerrList(response.data || []);
        } catch {
            setTerrList([]);
        }
    };

    const GetChannels = async () => {
        try {
            const response: any = await GetDcBusinessChannel({});
            setChannelList(response.data?.table || []);
        } catch {
            setChannelList([]);
        }
    };

    const GetSubFunctions = async (deptName: string) => {
        try {
            const response: any = await GetDcSubFunction({ dept_name: deptName });
            setSubFunctionList(response.data?.table || []);
        } catch {
            setSubFunctionList([]);
        }
    };

    const GetStates = async () => {
        try {
            const response: any = await GetDcStateName({});
            setStateList(response.data?.table || []);
        } catch {
            setStateList([]);
        }
    };

    const GetDistricts = async (stateCode: string, forShip = false) => {
        if (!stateCode) {
            if (forShip) setShipDistrictList([]);
            else setDistrictList([]);
            return;
        }
        try {
            const response: any = await GetDcDistrict({ state_code: stateCode });
            const rows = response.data?.table || [];
            if (forShip) setShipDistrictList(rows);
            else setDistrictList(rows);
        } catch {
            if (forShip) setShipDistrictList([]);
            else setDistrictList([]);
        }
    };

    const GetLov = async (lovType: string, setter: (rows: any[]) => void) => {
        try {
            const response: any = await GetDcLovDetails({ lovType });
            setter(response.data?.table || []);
        } catch {
            setter([]);
        }
    };

    const LoadCustomerClass = async (channel: string, subFn: string) => {
        try {
            const response: any = await GetDcCustomerClass({ businessLine: channel, subFunction: subFn });
            setCustomerClassList(response.data?.table || []);
        } catch {
            setCustomerClassList([]);
        }
    };

    const LoadCustomerType = async (channel: string, subFn: string) => {
        try {
            const response: any = await GetDcCustomerType({ businessChannel: channel, subFunction: subFn });
            setCustomerTypeList(response.data?.table || []);
        } catch {
            setCustomerTypeList([]);
        }
    };

    const LoadCustomerSubType = async (channel: string, subFn: string, custClass: string) => {
        try {
            const response: any = await GetDcCustomerSubType({
                businessChannel: channel,
                subFunction: subFn,
                customerClass: custClass,
            });
            setCustomerSubTypeList(response.data?.table || []);
        } catch {
            setCustomerSubTypeList([]);
        }
    };

    const LoadClubClass = async (channel: string, subFn: string, custClass: string, custType: string) => {
        try {
            const response: any = await GetDcClubClass({
                businessLine: channel,
                subFunction: subFn,
                customerClass: custClass,
                customerType: custType,
            });
            setClubClassList(response.data?.table || []);
        } catch {
            setClubClassList([]);
        }
    };

    const LoadLeads = async (depot: string, custType: string, custClass: string, reqId: number) => {
        try {
            const response: any = await GetDcLeadByDepot({
                depot,
                customer_type: custType,
                customer_class: custClass,
                request_id: reqId,
            });
            setLeadList(response.data?.table || []);
        } catch {
            setLeadList([]);
        }
    };

    const LoadPaymentTerms = async (depot: string, discountType: string) => {
        try {
            const response: any = await GetDcPaymentTerms({ depotCode: depot, discountType });
            setPaymentTermsList(response.data?.table || []);
        } catch {
            setPaymentTermsList([]);
        }
    };

    const LoadAddress1 = async (channel: string, custType: string, discountType: string, subFn: string) => {
        try {
            const response: any = await GetDcAddress1({
                businessLine: channel,
                custType,
                discountType,
                subFunction: subFn,
            });
            setAddress1List(response.data?.table || []);
            setShipAddress1List(response.data?.table1 || []);
        } catch {
            setAddress1List([]);
            setShipAddress1List([]);
        }
    };

    const LoadLeadDetails = async (leadId: string) => {
        if (!leadId) return;
        try {
            const response: any = await GetDcLeadDetailsById({ lead_id: leadId });
            const row = response.data?.table?.[0];
            if (!row) return;
            const gstNo = String(row.mh_gst_no || '').trim();
            const hasGst = gstNo.length >= 15 && !gstNo.toUpperCase().includes('UNREGISTERED') && !gstNo.toUpperCase().includes('NA');
            setField({
                leadId,
                territory: String(row.mh_terr || ''),
                accountName: String(row.mh_dealer_name || ''),
                leadMobile: String(row.mh_contact_no || ''),
                primaryContactNo: String(row.mh_contact_no || ''),
                primaryContactPerson: String(row.mh_contact_person || ''),
                gstFull: gstNo,
                gstinAvailable: hasGst ? 'Y' : form.gstinAvailable,
                address2: String(row.mh_address || ''),
                shipAddress2: String(row.mh_address || ''),
                postalCode: String(row.mh_pin || ''),
                shipPostal: String(row.mh_pin || ''),
            });
        } catch {
            /* ignore */
        }
    };

    const applyDnSlab = (slab: any) => {
        if (!slab) return;
        setForm((pre) => ({
            ...pre,
            dn1Day: String(slab.dds_dn1_days ?? ''),
            dn2Day: String(slab.dds_dn2_days ?? ''),
            dn3Day: String(slab.dds_dn3_days ?? ''),
            dn4Day: String(slab.dds_dn4_days ?? ''),
            dn5Day: String(slab.dds_dn5_days ?? ''),
            dn1Percent: String(slab.dds_dn1_percentage ?? ''),
            dn2Percent: String(slab.dds_dn2_percentage ?? ''),
            dn3Percent: String(slab.dds_dn3_percentage ?? ''),
            dn4Percent: String(slab.dds_dn4_percentage ?? ''),
            dn5Percent: String(slab.dds_dn5_percentage ?? ''),
        }));
    };

    const validateGst = async (value: string) => {
        const v = value.toUpperCase();
        setField({ gstFull: v });
        copyShipFromDepot({ gstFull: v });
        if (v.length === 15 && !GST_REGEX.test(v)) {
            setGstMsg('Invalid GST Number');
            return;
        }
        if (v.length !== 15) {
            setGstMsg('');
            return;
        }
        try {
            const response: any = await ValidateDcGst({ gstin: v });
            const data = response?.data;
            const gstSuccess = response?.success && (data?.Success ?? data?.success);
            if (gstSuccess && data) {
                const tradeName = data.TradeName || data.tradeName || '';
                const legalName = data.LegalName || data.legalName || '';
                if (!tradeName && !legalName) {
                    setGstMsg('GST validation failed: Legal Name and Trade Name are blank.');
                    setField({ gstFull: '' });
                    return;
                }
                const accountName = tradeName || legalName;
                const regDate = data.RegistrationDate || data.registrationDate || '';
                const stateCode = String(data.StateCode || data.stateCode || '').trim();
                const district = data.District || data.district || '';
                const city = data.City || data.city || '';
                const pin = data.PinCode || data.pinCode || '';
                const taxType = data.TaxPayerType || data.taxPayerType || '';
                setField({
                    gstFull: v,
                    accountName,
                    tradeNameBill: tradeName || legalName,
                    tradeNameShip: tradeName || legalName,
                    legalNameBill: legalName || tradeName,
                    legalNameShip: legalName || tradeName,
                    gstDate: regDate ? dcDate(String(regDate)) : form.gstDate,
                    gstType: taxType,
                    shipGstType: taxType,
                    shipGstFull: v,
                    panNo: v.substring(2, 12),
                    shipPanNo: v.substring(2, 12),
                    state: stateCode,
                    shipState: stateCode,
                    district,
                    shipDistrict: district,
                    city,
                    shipCity: city,
                    postalCode: pin,
                    shipPostal: pin,
                });
                if (stateCode) {
                    GetDistricts(stateCode, false);
                    GetDistricts(stateCode, true);
                }
                setGstMsg('GST Number validated');
                const gstCheckMsg = await validateMotherAccountGstFor58Retailer({
                    subTypeValue: form.customerSubType,
                    subTypeText: opt(customerSubTypeOptions, form.customerSubType).label,
                    clubClassValue: form.clubClass,
                    clubClassText: opt(clubClassOptions, form.clubClass).label,
                    motherCode: form.motherAccountCode,
                    distributorParentAcc: form.distributorParentAcc,
                    gstNo: v,
                });
                if (gstCheckMsg) setGstMsg(gstCheckMsg);
            } else {
                setGstMsg('GST validation failed. Please enter a valid GSTIN.');
            }
        } catch {
            setGstMsg('GST validation failed.');
        }
    };

    const validatePan = (value: string) => {
        const v = value.toUpperCase();
        setField({ panNo: v });
        copyShipFromDepot({ panNo: v });
        if (v.length === 10 && !PAN_REGEX.test(v)) setPanMsg('Invalid PAN Number');
        else if (v.length === 10) setPanMsg('PAN Number validated');
        else setPanMsg('');
    };

    const validateParentAcc = async () => {
        try {
            const response: any = await ValidateDcMotherAccount({
                motherCode: form.distributorParentAcc,
                customerType: form.customerType,
                depot: form.depot,
                customerClass: form.customerClass,
                custSubType: form.customerSubType,
                clubClass: form.clubClass,
            });
            const rows = response.data?.table || [];
            if (rows.length > 0) setParentAccMsg('Distributor Parent A/C validated');
            else setParentAccMsg(response.message || 'Invalid Distributor Parent A/C');
        } catch {
            setParentAccMsg('Invalid Distributor Parent A/C');
        }
    };

    const validateBankAcc = () => {
        if (!form.bankAccount || form.bankAccount !== form.confirmBankAcc) {
            setBankAccMsg('Bank Account No and Confirm Bank Account No do not match');
            return;
        }
        setBankAccMsg('Bank Account No validated');
    };

    const validateIfsc = async () => {
        const ifsc = form.ifsc.toUpperCase();
        setField({ ifsc });
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
            setIfscMsg('Invalid IFSC Code');
            setShowIfscReset(false);
            return;
        }
        try {
            const response: any = await ValidateIFSC({ common_request: ifsc });
            if (response?.statusCode === 200 && response?.data) {
                const bank = response.data.bank || response.data.BANK || '';
                const branch = response.data.branch || response.data.BRANCH || '';
                setIfscMsg(response.data.message || response.message || 'IFSC validated');
                setShowIfscReset(true);
                setField({
                    ifsc,
                    bankName: bank || form.bankName,
                    bankBranch: branch || form.bankBranch,
                });
            } else {
                setIfscMsg(response?.message || 'Invalid IFSC Code');
                setShowIfscReset(false);
            }
        } catch {
            setIfscMsg('Invalid IFSC Code');
            setShowIfscReset(false);
        }
    };

    const downloadDocument = async (doc: any) => {
        if (!doc?.serverPath) {
            commonErrorToast('Document path not available.');
            return;
        }
        try {
            const response: any = await GetDcDocumentDownloadUrl({
                serverPath: doc.serverPath,
                fileName: doc.fileName,
            });
            if (response?.success && response?.data?.url) {
                window.open(response.data.url, '_blank');
            } else {
                commonErrorToast(response?.message || 'File not found on server.');
            }
        } catch {
            commonErrorToast('Unable to download document.');
        }
    };

    const resetIfsc = () => {
        setField({ ifsc: '', bankName: '', bankBranch: '' });
        setIfscMsg('');
        setShowIfscReset(false);
    };

    const goBack = () => navigate('/DealerCreation/dealerCreationList');

    const handleApprove = async () => {
        if (!form.requestId) return;
        const gstCheckMsg = await validateMotherAccountGstFor58Retailer({
            subTypeValue: form.customerSubType,
            subTypeText: opt(customerSubTypeOptions, form.customerSubType).label,
            clubClassValue: form.clubClass,
            clubClassText: opt(clubClassOptions, form.clubClass).label,
            motherCode: form.motherAccountCode,
            distributorParentAcc: form.distributorParentAcc,
            gstNo: form.gstFull,
        });
        if (gstCheckMsg) {
            commonErrorToast(gstCheckMsg);
            setGstMsg(gstCheckMsg);
            return;
        }
        setLoading(true);
        try {
            const response: any = await DcHoSalesApprovalUpdate({
                dcmId: Number(form.requestId),
                approve_yn: 'Y',
                cancel_reason: remarks || '',
            });
            if (response?.success) {
                commonSuccessToast(response.message || 'Request approved successfully.');
                goBack();
            } else {
                commonErrorToast(response?.message || 'Error approving request.');
            }
        } catch {
            commonErrorToast('Error approving request.');
        } finally {
            setLoading(false);
        }
    };

    const openRemarks = (type: 'REJECT' | 'BACK_ADMIN' | 'APPROVE') => {
        setRemarks('');
        setRemarksModal({ open: true, type });
    };

    const submitRemarks = async () => {
        if (remarksModal.type !== 'APPROVE' && !remarks.trim()) {
            commonErrorToast('Please Enter Remarks');
            return;
        }
        if (!form.requestId) return;
        setLoading(true);
        try {
            if (remarksModal.type === 'APPROVE') {
                setRemarksModal({ open: false, type: '' });
                await handleApprove();
                return;
            }
            if (remarksModal.type === 'REJECT') {
                const response: any = await DcHoSalesApprovalUpdate({
                    dcmId: Number(form.requestId),
                    approve_yn: 'R',
                    cancel_reason: remarks,
                });
                if (response?.success) {
                    commonSuccessToast(response.message || 'Request has been rejected successfully.');
                    goBack();
                } else {
                    commonErrorToast(response?.message || 'Error rejecting request.');
                }
            } else {
                const response: any = await DcBackToAdminUpdate({
                    dcmId: Number(form.requestId),
                    cancel_reason: remarks,
                });
                if (response?.success) {
                    commonSuccessToast(response.message || 'Sent back to Admin');
                    goBack();
                } else {
                    commonErrorToast(response?.message || 'Failed to send back to Admin');
                }
            }
        } catch {
            commonErrorToast('An error occurred.');
        } finally {
            setLoading(false);
            setRemarksModal({ open: false, type: '' });
        }
    };

    const docColumns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            { header: 'Srl No.', size: 60, Cell: ({ row }) => row.index + 1 },
            { accessorKey: 'documentTypeName', header: 'Document Type', size: 160 },
            { accessorKey: 'fileName', header: 'Document Name', size: 220 },
            {
                header: 'Action',
                size: 80,
                Cell: ({ row }) =>
                    row.original.serverPath ? (
                        <button
                            type="button"
                            className="text-blue-600 text-xs underline"
                            onClick={() => downloadDocument(row.original)}
                        >
                            Download
                        </button>
                    ) : null,
            },
        ],
        []
    );

    const logColumns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            { accessorKey: 'action', header: 'Action', size: 140 },
            { accessorKey: 'action_taken', header: 'Action Taken', size: 100 },
            { accessorKey: 'action_taken_by', header: 'Action Taken By', size: 140 },
            { accessorKey: 'action_taken_on', header: 'Action Taken On', size: 140 },
            { accessorKey: 'reason', header: 'Remarks', size: 180 },
        ],
        []
    );

    const docTable = useMantineReactTable({
        columns: docColumns,
        data: documents,
        enableTopToolbar: false,
        enableSorting: false,
        enableColumnActions: false,
        enableStickyHeader: true,
        mantineTableContainerProps: { style: { overflow: 'auto', maxHeight: '12rem' } },
    });

    const logTable = useMantineReactTable({
        columns: logColumns,
        data: approvalLog,
        enableTopToolbar: false,
        enableSorting: false,
        enableColumnActions: false,
        enableStickyHeader: true,
        mantineTableContainerProps: { style: { overflow: 'auto', maxHeight: '12rem' } },
    });

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    GetRegions(),
                    GetChannels(),
                    GetStates(),
                    GetLov('FIRM_TYPE', setFirmTypeList),
                    GetLov('GST_TYPE', setGstTypeList),
                    GetLov('DISCOUNT_TYPE', setDiscountTypeList),
                    GetLov('REASON_TYPE', setReasonList),
                    GetLov('BANK_AC_TYPE', setBankAcTypeList),
                    GetLov('ALTERNATE_BUSINESS_TYPE', setAlternateBusinessList),
                ]);
                const stored = sessionStorage.getItem('dealerCreationDtl');
                if (!stored) return;
                const row = JSON.parse(stored);
                const dcId = Number(row.id || row.dc_request_id || 0);
                if (!dcId) return;
                const detailsRes: any = await GetDealerCreationDetails({ dcId });
                const header = detailsRes?.data?.table?.[0];
                const mapped = header ? mapDcDetails(header) : null;
                if (header && mapped) {
                    setForm((pre) => ({ ...pre, ...mapped }));
                    setStatusCode(String(header.dcm_status_code || '').toUpperCase());
                    if (mapped.region) await GetDepots(mapped.region);
                    if (mapped.region && mapped.depot) await GetTerrs(mapped.region, mapped.depot);
                    if (mapped.businessChannel) await GetSubFunctions(mapped.businessChannel);
                    if (mapped.businessChannel && mapped.subFunction) {
                        await LoadCustomerClass(mapped.businessChannel, mapped.subFunction);
                        await LoadCustomerType(mapped.businessChannel, mapped.subFunction);
                    }
                    if (mapped.businessChannel && mapped.subFunction && mapped.customerClass) {
                        await LoadCustomerSubType(mapped.businessChannel, mapped.subFunction, mapped.customerClass);
                    }
                    if (mapped.businessChannel && mapped.subFunction && mapped.customerClass && mapped.customerType) {
                        await LoadClubClass(mapped.businessChannel, mapped.subFunction, mapped.customerClass, mapped.customerType);
                        await LoadLeads(mapped.depot || '', mapped.customerType, mapped.customerClass || '', dcId);
                    }
                    if (mapped.state) await GetDistricts(mapped.state, false);
                    if (mapped.shipState) await GetDistricts(mapped.shipState, true);
                    await LoadPaymentTerms(mapped.depot || '', mapped.discountType || '');
                    await LoadAddress1(mapped.businessChannel || '', mapped.customerType || '', mapped.discountType || '', mapped.subFunction || '');
                }
                setDocuments(detailsRes?.data?.table1 || []);
                let slab = detailsRes?.data?.table2?.[0];
                if (!slab && mapped) {
                    const slabRes: any = await GetDcDnSlab({
                        depot_code: mapped.depot || '',
                        cust_type: mapped.customerType || '',
                        account_code: mapped.newAccountCode || '',
                    });
                    slab = slabRes?.data?.table?.[0];
                }
                applyDnSlab(slab);
                const logRes: any = await GetDcApprovalLog({ dcm_id: String(dcId) });
                setApprovalLog(logRes?.data?.table || []);
            } catch {
                /* ignore */
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
                <h5 className="text-lg font-semibold dark:text-white-light">Dealer Creation Details</h5>
            </div>

            <div className="bg-white rounded-lg px-4 py-3 shadow-md mb-2 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <SectionHeader title="- Dealer Details -" />

                    <div>
                        <FieldLabel label="Request Id:" required />
                        <input className="w-full border rounded form-input text-sm bg-gray-50" value={form.requestId} readOnly />
                    </div>
                    <div>
                        <FieldLabel label="Requisition Date:" required />
                        <Flatpickr
                            className="w-full border rounded form-input text-sm"
                            value={parseDdMmYyyy(form.reqDate) || ''}
                            onChange={(dates) => setField({ reqDate: dates[0] ? formatDate(dates[0]) : '' })}
                            options={{ dateFormat: 'd/m/Y' }}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Code Generation No:" required />
                        <input className="w-full border rounded form-input text-sm bg-gray-50" value={form.codeGenerationNo} readOnly />
                    </div>
                    <div>
                        <FieldLabel label="New Account Code:" />
                        <input className="w-full border rounded form-input text-sm bg-gray-50" value={form.newAccountCode} readOnly />
                    </div>
                    <div>
                        <FieldLabel label="New Bill To Code:" />
                        <input className="w-full border rounded form-input text-sm bg-gray-50" value={form.newBillToCode} readOnly />
                    </div>
                    <div>
                        <FieldLabel label="Region:" required />
                        <Select
                            className="text-sm"
                            isSearchable
                            options={regionOptions}
                            value={opt(regionOptions, form.region)}
                            onChange={(e: any) => {
                                setField({ region: e?.value ?? '', depot: '', territory: '' });
                                setDepotList([]);
                                setTerrList([]);
                                if (e?.value) GetDepots(e.value);
                            }}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Depot:" required />
                        <Select
                            className="text-sm"
                            isSearchable
                            options={depotOptions}
                            value={opt(depotOptions, form.depot)}
                            onChange={(e: any) => {
                                const depot = e?.value ?? '';
                                setField({ depot, territory: '' });
                                setTerrList([]);
                                if (depot) {
                                    GetTerrs(form.region, depot);
                                    LoadPaymentTerms(depot, form.discountType);
                                }
                            }}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Business Channel:" required />
                        <Select
                            className="text-sm"
                            isSearchable
                            options={channelOptions}
                            value={opt(channelOptions, form.businessChannel)}
                            onChange={(e: any) => {
                                const channel = e?.value ?? '';
                                setField({ businessChannel: channel, subFunction: '', customerClass: '', customerType: '', customerSubType: '' });
                                GetSubFunctions(channel);
                            }}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Sub Function:" required />
                        <Select
                            className="text-sm"
                            isSearchable
                            options={subFunctionOptions}
                            value={opt(subFunctionOptions, form.subFunction)}
                            onChange={(e: any) => {
                                const subFn = e?.value ?? '';
                                setField({ subFunction: subFn, customerClass: '', customerType: '', customerSubType: '' });
                                LoadCustomerClass(form.businessChannel, subFn);
                                LoadCustomerType(form.businessChannel, subFn);
                            }}
                        />
                    </div>
                    {showCustomerClass && (
                        <div>
                            <FieldLabel label="Customer Class:" required />
                            <Select
                                className="text-sm"
                                isSearchable
                                options={customerClassOptions}
                                value={opt(customerClassOptions, form.customerClass)}
                                onChange={(e: any) => {
                                    const custClass = e?.value ?? '';
                                    setField({ customerClass: custClass, customerSubType: '' });
                                    LoadCustomerSubType(form.businessChannel, form.subFunction, custClass);
                                }}
                            />
                        </div>
                    )}
                    <div>
                        <FieldLabel label="Customer Type:" required />
                        <Select
                            className="text-sm"
                            isSearchable
                            options={customerTypeOptions}
                            value={opt(customerTypeOptions, form.customerType)}
                            onChange={(e: any) => {
                                const custType = e?.value ?? '';
                                setField({ customerType: custType, leadId: '', leadMobile: '' });
                                LoadClubClass(form.businessChannel, form.subFunction, form.customerClass, custType);
                                LoadLeads(form.depot, custType, form.customerClass, Number(form.requestId || 0));
                                LoadAddress1(form.businessChannel, custType, form.discountType, form.subFunction);
                            }}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Customer Sub Type:" required />
                        <Select
                            className="text-sm"
                            isSearchable
                            options={customerSubTypeOptions}
                            value={opt(customerSubTypeOptions, form.customerSubType)}
                            onChange={(e: any) => setField({ customerSubType: e?.value ?? '' })}
                        />
                    </div>
                    {showLead && (
                        <>
                            <div>
                                <FieldLabel label="Lead ID:" required />
                                <Select
                                    className="text-sm"
                                    isSearchable
                                    options={leadOptions}
                                    value={opt(leadOptions, form.leadId)}
                                    onChange={(e: any) => {
                                        const leadId = e?.value ?? '';
                                        setField({ leadId, leadMobile: '' });
                                        if (leadId) LoadLeadDetails(leadId);
                                    }}
                                />
                            </div>
                            <div>
                                <FieldLabel label="Lead Mobile No:" required />
                                <input
                                    className="w-full border rounded form-input text-sm"
                                    maxLength={10}
                                    autoComplete="off"
                                    value={form.leadMobile}
                                    onKeyDown={allowNumericKey}
                                    onChange={(e) => setField({ leadMobile: e.target.value })}
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <FieldLabel label="Territory :" required />
                        <Select
                            className="text-sm"
                            isSearchable
                            options={terrOptions}
                            value={opt(terrOptions, form.territory)}
                            onChange={(e: any) => setField({ territory: e?.value ?? '' })}
                        />
                    </div>
                    <div>
                        <FieldLabel label="GSTIN Available :" required />
                        <Select
                            className="text-sm"
                            isSearchable
                            options={gstTypeOptions}
                            value={opt(gstTypeOptions, form.gstinAvailable)}
                            onChange={(e: any) => setField({ gstinAvailable: e?.value ?? '', gstFull: '', gstType: '', gstDate: '' })}
                        />
                    </div>
                    {showGst && (
                        <>
                            <div>
                                <FieldLabel label="GST Number (15 digit):" required />
                                <input
                                    className="w-full border rounded form-input text-sm"
                                    maxLength={15}
                                    autoComplete="off"
                                    value={form.gstFull}
                                    onChange={(e) => validateGst(e.target.value)}
                                />
                                {gstMsg && <div className="text-red-600 text-xs mt-1">{gstMsg}</div>}
                            </div>
                            <div>
                                <FieldLabel label="GST Tax Payee Type :" required />
                                <input
                                    className="w-full border rounded form-input text-sm"
                                    autoComplete="off"
                                    value={form.gstType}
                                    onChange={(e) => copyShipFromDepot({ gstType: e.target.value })}
                                />
                            </div>
                            <div>
                                <FieldLabel label="GST Date of Registration:" required />
                                <Flatpickr
                                    className="w-full border rounded form-input text-sm"
                                    value={parseDdMmYyyy(form.gstDate) || ''}
                                    onChange={(dates) => setField({ gstDate: dates[0] ? formatDate(dates[0]) : '' })}
                                    options={{ dateFormat: 'd/m/Y' }}
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <FieldLabel label="PAN No :" required />
                        <input
                            className="w-full border rounded form-input text-sm"
                            maxLength={10}
                            autoComplete="off"
                            value={form.panNo}
                            onChange={(e) => validatePan(e.target.value)}
                        />
                        {panMsg && <div className="text-red-600 text-xs mt-1">{panMsg}</div>}
                    </div>
                    <div>
                        <FieldLabel label="Firm Type:" required />
                        <Select
                            className="text-sm"
                            isSearchable
                            options={firmTypeOptions}
                            value={opt(firmTypeOptions, form.firmType)}
                            onChange={(e: any) => setField({ firmType: e?.value ?? '', aadhar: '' })}
                        />
                    </div>
                    {showAadhaar && (
                        <div>
                            <FieldLabel label="Proprietor Aadhaar No:" required />
                            <input
                                className="w-full border rounded form-input text-sm"
                                maxLength={12}
                                autoComplete="off"
                                value={form.aadhar}
                                onKeyDown={allowNumericKey}
                                onChange={(e) => setField({ aadhar: e.target.value.toUpperCase() })}
                            />
                        </div>
                    )}
                    {showMother && (
                        <div>
                            <FieldLabel label="Mother Account Code:" required />
                            <input
                                className="w-full border rounded form-input text-sm"
                                maxLength={10}
                                autoComplete="off"
                                value={form.motherAccountCode}
                                onKeyDown={allowNumericKey}
                                onChange={(e) => setField({ motherAccountCode: e.target.value })}
                            />
                        </div>
                    )}
                    {showDistRetailer && (
                        <>
                            <div>
                                <FieldLabel label="Distributor Parent A/C:" required />
                                <div className="flex items-center gap-2">
                                    <input
                                        className="w-full border rounded form-input text-sm"
                                        maxLength={10}
                                        autoComplete="off"
                                        value={form.distributorParentAcc}
                                        onKeyDown={allowNumericKey}
                                        onChange={(e) => {
                                            setField({ distributorParentAcc: e.target.value });
                                        }}
                                    />
                                    <button type="button" className="bg-blue-500 text-white px-3 py-2 rounded text-xs" onClick={validateParentAcc}>
                                        Validate
                                    </button>
                                </div>
                                {parentAccMsg && <div className="text-red-600 text-xs mt-1">{parentAccMsg}</div>}
                            </div>
                            <div>
                                <FieldLabel label="Retailer Contact No:" required />
                                <input
                                    className="w-full border rounded form-input text-sm"
                                    maxLength={10}
                                    autoComplete="off"
                                    value={form.retailerContactNo}
                                    onKeyDown={allowNumericKey}
                                    onChange={(e) => setField({ retailerContactNo: e.target.value })}
                                />
                            </div>
                            <div>
                                <FieldLabel label="Retailer Alternate Contact No:" />
                                <input
                                    className="w-full border rounded form-input text-sm"
                                    maxLength={10}
                                    autoComplete="off"
                                    value={form.retailerAlternateContactNo}
                                    onKeyDown={allowNumericKey}
                                    onChange={(e) => setField({ retailerAlternateContactNo: e.target.value })}
                                />
                            </div>
                            <div>
                                <FieldLabel label="Club Class:" required />
                                <Select
                                    className="text-sm"
                                    isSearchable
                                    options={clubClassOptions}
                                    value={opt(clubClassOptions, form.clubClass)}
                                    onChange={(e: any) => setField({ clubClass: e?.value ?? '' })}
                                />
                            </div>
                        </>
                    )}

                    <SectionHeader title="- DEPOT -" />

                    <div>
                        <FieldLabel label="Account Name:" required />
                        <input
                            className="w-full border rounded form-input text-sm"
                            autoComplete="off"
                            value={form.accountName}
                            onChange={(e) => setField({ accountName: e.target.value })}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Primary Site:" required />
                        <Select
                            className="text-sm"
                            options={PRIMARY_SITE}
                            value={opt(PRIMARY_SITE, form.primarySite)}
                            onChange={(e: any) => setField({ primarySite: e?.value ?? '' })}
                        />
                    </div>
                    <div>
                        <FieldLabel label="State:" required />
                        <Select
                            className="text-sm"
                            isSearchable
                            options={stateOptions}
                            value={opt(stateOptions, form.state)}
                            onChange={(e: any) => {
                                copyShipFromDepot({ state: e?.value ?? '', district: '' });
                                GetDistricts(e?.value ?? '', false);
                            }}
                        />
                    </div>
                    <div>
                        <FieldLabel label="District:" required />
                        <Select
                            className="text-sm"
                            isSearchable
                            options={districtOptions}
                            value={opt(districtOptions, form.district)}
                            onChange={(e: any) => copyShipFromDepot({ district: e?.value ?? '' })}
                        />
                    </div>
                    <div>
                        <FieldLabel label="City:" required />
                        <input
                            className="w-full border rounded form-input text-sm"
                            autoComplete="off"
                            value={form.city}
                            onChange={(e) => copyShipFromDepot({ city: e.target.value })}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Country:" required />
                        <Select
                            className="text-sm"
                            options={COUNTRY}
                            value={opt(COUNTRY, form.country)}
                            onChange={(e: any) => setField({ country: e?.value ?? '' })}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Discount Type:" required />
                        <Select
                            className="text-sm"
                            isSearchable
                            options={discountTypeOptions}
                            value={opt(discountTypeOptions, form.discountType)}
                            onChange={(e: any) => {
                                const discount = e?.value ?? '';
                                setField({ discountType: discount });
                                LoadPaymentTerms(form.depot, discount);
                                LoadAddress1(form.businessChannel, form.customerType, discount, form.subFunction);
                            }}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Address [1]:" required />
                        <Select
                            className="text-sm"
                            isSearchable
                            options={address1Options}
                            value={opt(address1Options, form.address1)}
                            onChange={(e: any) => copyShipFromDepot({ address1: e?.value ?? '' })}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Address [2]:" />
                        <input
                            className="w-full border rounded form-input text-sm"
                            autoComplete="off"
                            value={form.address2}
                            onChange={(e) => copyShipFromDepot({ address2: e.target.value })}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Address [3]:" />
                        <input
                            className="w-full border rounded form-input text-sm"
                            autoComplete="off"
                            value={form.address3}
                            onChange={(e) => copyShipFromDepot({ address3: e.target.value })}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Postal Code:" required />
                        <input
                            className="w-full border rounded form-input text-sm"
                            maxLength={6}
                            autoComplete="off"
                            value={form.postalCode}
                            onKeyDown={allowNumericKey}
                            onChange={(e) => copyShipFromDepot({ postalCode: e.target.value })}
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <FieldLabel label="Primary Contact Number:" required />
                            <label className="flex items-center gap-1 text-xs mb-1">
                                <input
                                    type="checkbox"
                                    checked={form.isWhatsapp}
                                    onChange={(e) => setField({ isWhatsapp: e.target.checked })}
                                />
                                It's Whatsapp
                            </label>
                        </div>
                        <input
                            className="w-full border rounded form-input text-sm"
                            maxLength={10}
                            autoComplete="off"
                            value={form.primaryContactNo}
                            onKeyDown={allowNumericKey}
                            onChange={(e) => setField({ primaryContactNo: e.target.value })}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Primary Contact Person:" required />
                        <input
                            className="w-full border rounded form-input text-sm"
                            autoComplete="off"
                            value={form.primaryContactPerson}
                            onChange={(e) => setField({ primaryContactPerson: e.target.value })}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Alternate Contact Number [1]:" />
                        <input
                            className="w-full border rounded form-input text-sm"
                            maxLength={10}
                            autoComplete="off"
                            value={form.altContact1}
                            onKeyDown={allowNumericKey}
                            onChange={(e) => setField({ altContact1: e.target.value })}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Alternate Contact Person [1] :" />
                        <input
                            className="w-full border rounded form-input text-sm"
                            autoComplete="off"
                            value={form.altPerson1}
                            onChange={(e) => setField({ altPerson1: e.target.value })}
                        />
                    </div>

                    <SectionHeader title="- BANKING DETAILS -" />

                    <div>
                        <FieldLabel label="Security Cheque collected:" required />
                        <Select
                            className="text-sm"
                            options={YES_NO}
                            value={opt(YES_NO, form.securityCheque)}
                            onChange={(e: any) => setField({ securityCheque: e?.value ?? '', chequeNumber: '' })}
                        />
                    </div>
                    {showChequeNo && (
                        <div>
                            <FieldLabel label="Security Cheque Number:" required />
                            <input
                                className="w-full border rounded form-input text-sm"
                                maxLength={30}
                                autoComplete="off"
                                value={form.chequeNumber}
                                onChange={(e) => setField({ chequeNumber: e.target.value.toUpperCase() })}
                            />
                        </div>
                    )}
                    <div>
                        <FieldLabel label="Reason:" required />
                        <Select
                            className="text-sm"
                            isSearchable
                            options={reasonOptions}
                            value={opt(reasonOptions, form.reason)}
                            onChange={(e: any) => setField({ reason: e?.value ?? '' })}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Bank Account No:" required />
                        <input
                            className="w-full border rounded form-input text-sm"
                            autoComplete="off"
                            value={form.bankAccount}
                            onChange={(e) => setField({ bankAccount: e.target.value })}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Confirm Bank Account No:" required />
                        <div className="flex items-center gap-2">
                            <input
                                className="w-full border rounded form-input text-sm"
                                autoComplete="off"
                                value={form.confirmBankAcc}
                                onChange={(e) => setField({ confirmBankAcc: e.target.value })}
                            />
                            <button type="button" className="bg-blue-500 text-white px-3 py-2 rounded text-xs" onClick={validateBankAcc}>
                                Validate
                            </button>
                        </div>
                        {bankAccMsg && <div className="text-red-600 text-xs mt-1">{bankAccMsg}</div>}
                    </div>
                    <div>
                        <FieldLabel label="IFSC Code:" required />
                        <div className="flex items-center gap-2">
                            <input
                                className="w-full border rounded form-input text-sm"
                                autoComplete="off"
                                value={form.ifsc}
                                onChange={(e) => setField({ ifsc: e.target.value.toUpperCase() })}
                            />
                            <button type="button" className="bg-blue-500 text-white px-3 py-2 rounded text-xs" onClick={validateIfsc}>
                                Validate
                            </button>
                            {showIfscReset && (
                                <button type="button" className="bg-blue-500 text-white px-3 py-2 rounded text-xs" onClick={resetIfsc}>
                                    Reset
                                </button>
                            )}
                        </div>
                        {ifscMsg && <div className="text-red-600 text-xs mt-1">{ifscMsg}</div>}
                    </div>
                    <div>
                        <FieldLabel label="Bank Branch Address:" required />
                        <input className="w-full border rounded form-input text-sm bg-gray-50" autoComplete="off" value={form.bankBranch} readOnly />
                    </div>
                    <div>
                        <FieldLabel label="Bank Name:" required />
                        <input className="w-full border rounded form-input text-sm bg-gray-50" autoComplete="off" value={form.bankName} readOnly />
                    </div>
                    <div>
                        <FieldLabel label="Bank Account Type:" required />
                        <Select
                            className="text-sm"
                            options={bankAcTypeOptions}
                            value={opt(bankAcTypeOptions, form.bankAcType)}
                            onChange={(e: any) => {
                                const acType = e?.value ?? '';
                                setField({ bankAcType: acType, tlvAmount: acType === 'Saving' ? '0' : form.tlvAmount });
                            }}
                        />
                    </div>

                    {showTaxation && (
                        <>
                            <SectionHeader title="- TAXATION -" />
                            <div>
                                <FieldLabel label="Trade Name (Bill To):" />
                                <input className="w-full border rounded form-input text-sm" autoComplete="off" value={form.tradeNameBill} onChange={(e) => setField({ tradeNameBill: e.target.value })} />
                            </div>
                            <div>
                                <FieldLabel label="Legal Name (Bill To):" />
                                <input className="w-full border rounded form-input text-sm" autoComplete="off" value={form.legalNameBill} onChange={(e) => setField({ legalNameBill: e.target.value })} />
                            </div>
                            <div>
                                <FieldLabel label="Trade Name (Ship To):" />
                                <input className="w-full border rounded form-input text-sm" autoComplete="off" value={form.tradeNameShip} onChange={(e) => setField({ tradeNameShip: e.target.value })} />
                            </div>
                            <div>
                                <FieldLabel label="Legal Name (Ship To):" />
                                <input className="w-full border rounded form-input text-sm" autoComplete="off" value={form.legalNameShip} onChange={(e) => setField({ legalNameShip: e.target.value })} />
                            </div>
                            <div>
                                <FieldLabel label="Account No:" />
                                <input className="w-full border rounded form-input text-sm bg-gray-50" value={form.accountNo} readOnly />
                            </div>
                            <div>
                                <FieldLabel label="Bill To Code:" />
                                <input className="w-full border rounded form-input text-sm bg-gray-50" value={form.billToCode} readOnly />
                            </div>
                        </>
                    )}

                    <SectionHeader title="- SHIP TO DETAILS -" />

                    <div>
                        <FieldLabel label="Address : Street [1]:" />
                        <Select className="text-sm" options={shipAddress1Options} value={opt(shipAddress1Options, form.shipAddress1)} onChange={(e: any) => setField({ shipAddress1: e?.value ?? '' })} />
                    </div>
                    <div>
                        <FieldLabel label="Address : Street [2]:" />
                        <input className="w-full border rounded form-input text-sm" autoComplete="off" value={form.shipAddress2} onChange={(e) => setField({ shipAddress2: e.target.value })} />
                    </div>
                    <div>
                        <FieldLabel label="Address : Street [3]:" />
                        <input className="w-full border rounded form-input text-sm" autoComplete="off" value={form.shipAddress3} onChange={(e) => setField({ shipAddress3: e.target.value })} />
                    </div>
                    <div>
                        <FieldLabel label="State:" required />
                        <Select className="text-sm" isSearchable options={stateOptions} value={opt(stateOptions, form.shipState)} onChange={(e: any) => { setField({ shipState: e?.value ?? '', shipDistrict: '' }); GetDistricts(e?.value ?? '', true); }} />
                    </div>
                    <div>
                        <FieldLabel label="District:" required />
                        <Select className="text-sm" options={shipDistrictOptions} value={opt(shipDistrictOptions, form.shipDistrict)} onChange={(e: any) => setField({ shipDistrict: e?.value ?? '' })} />
                    </div>
                    <div>
                        <FieldLabel label="City:" required />
                        <input className="w-full border rounded form-input text-sm" autoComplete="off" value={form.shipCity} onChange={(e) => setField({ shipCity: e.target.value })} />
                    </div>
                    <div>
                        <FieldLabel label="Postal Code:" required />
                        <input className="w-full border rounded form-input text-sm" maxLength={6} autoComplete="off" value={form.shipPostal} onKeyDown={allowNumericKey} onChange={(e) => setField({ shipPostal: e.target.value })} />
                    </div>
                    <div>
                        <FieldLabel label="GST Tax Payee Type:" />
                        <input className="w-full border rounded form-input text-sm" autoComplete="off" value={form.shipGstType} onChange={(e) => setField({ shipGstType: e.target.value })} />
                    </div>
                    <div>
                        <FieldLabel label="GST Number (15 digit):" />
                        <input className="w-full border rounded form-input text-sm" maxLength={15} autoComplete="off" value={form.shipGstFull} onChange={(e) => setField({ shipGstFull: e.target.value.toUpperCase() })} />
                    </div>
                    <div>
                        <FieldLabel label="PAN No:" />
                        <input className="w-full border rounded form-input text-sm" maxLength={10} autoComplete="off" value={form.shipPanNo} onChange={(e) => setField({ shipPanNo: e.target.value.toUpperCase() })} />
                    </div>

                    <SectionHeader title="- ALTERNATE BUSINESS -" />

                    <div className="md:col-span-2">
                        <FieldLabel label="Alternate Business :" />
                        <Select
                            className="text-sm"
                            isMulti
                            isSearchable
                            options={alternateBusinessOptions}
                            value={form.alternateBusiness}
                            onChange={(e: any) => setField({ alternateBusiness: e || [] })}
                        />
                    </div>
                    <div>
                        <FieldLabel label="Email:" required />
                        <input className="w-full border rounded form-input text-sm" autoComplete="off" value={form.email} onChange={(e) => setField({ email: e.target.value })} />
                    </div>
                    <div>
                        <FieldLabel label="Competition Dealer:" required />
                        <Select className="text-sm" options={YES_NO} value={opt(YES_NO, form.competitionDealer)} onChange={(e: any) => setField({ competitionDealer: e?.value ?? '' })} />
                    </div>
                    <div className="md:col-span-2">
                        <FieldLabel label="Has the proposed dealer entered into any financial transaction with any employee of Berger Paints India Ltd. or friend/ relative of any employee of Berger?:" required />
                        <Select className="text-sm" options={YES_NO} value={opt(YES_NO, form.financialTranYn)} onChange={(e: any) => setField({ financialTranYn: e?.value ?? '' })} />
                    </div>
                    <div className="md:col-span-2">
                        <FieldLabel label="Remarks:" required />
                        <input className="w-full border rounded form-input text-sm" value={form.financialTranRemark} onChange={(e) => setField({ financialTranRemark: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                        <FieldLabel label="Whether the proposed dealer is a relative or friend of a relative of any existing Berger employee :" required />
                        <Select className="text-sm" options={YES_NO} value={opt(YES_NO, form.relativeOrFriend)} onChange={(e: any) => setField({ relativeOrFriend: e?.value ?? '' })} />
                    </div>
                    <div className="md:col-span-2">
                        <FieldLabel label="Please specify the Details Remarks:" required />
                        <input className="w-full border rounded form-input text-sm" value={form.relativeOrFriendRemark} onChange={(e) => setField({ relativeOrFriendRemark: e.target.value })} />
                    </div>
                    {showCredit && (
                        <>
                            <div>
                                <FieldLabel label="Payment Terms:" required />
                                <Select className="text-sm" options={paymentTermsOptions} value={opt(paymentTermsOptions, form.paymentTerms)} onChange={(e: any) => setField({ paymentTerms: e?.value ?? '' })} />
                            </div>
                            <div>
                                <FieldLabel label="TLV Amount:" required />
                                <input className="w-full border rounded form-input text-sm" autoComplete="off" value={form.tlvAmount} onKeyDown={allowNumericKey} onChange={(e) => setField({ tlvAmount: e.target.value })} />
                            </div>
                            <div>
                                <FieldLabel label="Proposed Credit Limit:" required />
                                <input className="w-full border rounded form-input text-sm" autoComplete="off" value={form.creditLimit} onKeyDown={allowNumericKey} onChange={(e) => setField({ creditLimit: e.target.value })} />
                            </div>
                            <div>
                                <FieldLabel label="Proposed Credit Days:" required />
                                <input className="w-full border rounded form-input text-sm" autoComplete="off" value={form.creditDays} onKeyDown={allowNumericKey} onChange={(e) => setField({ creditDays: e.target.value })} />
                            </div>
                        </>
                    )}

                    <SectionHeader title="- DN SLAB -" />
                    {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} className="md:col-span-2 grid grid-cols-4 gap-2">
                            <FieldLabel label={`Dn${n} Day:`} />
                            <input
                                className="w-full border rounded form-input text-sm"
                                autoComplete="off"
                                value={(form as any)[`dn${n}Day`]}
                                onKeyDown={allowNumericKey}
                                onChange={(e) => setField({ [`dn${n}Day`]: e.target.value } as any)}
                            />
                            <FieldLabel label={`Dn${n} %:`} />
                            <input
                                className="w-full border rounded form-input text-sm"
                                autoComplete="off"
                                value={(form as any)[`dn${n}Percent`]}
                                onKeyDown={allowDecimalUpTo2}
                                onChange={(e) => setField({ [`dn${n}Percent`]: e.target.value } as any)}
                            />
                        </div>
                    ))}
                </div>

                <div className="mb-3">
                    <SectionHeader title="- Document Details -" />
                    <div className="mt-2 p-pl-table-item">
                        <MantineReactTable table={docTable} />
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 my-4">
                    {showHoActions && (
                        <>
                            <button type="button" className="bg-green-600 text-white px-4 py-2 rounded text-xs" onClick={handleApprove}>Approve</button>
                            <button type="button" className="bg-red-600 text-white px-4 py-2 rounded text-xs" onClick={() => openRemarks('REJECT')}>Reject</button>
                        </>
                    )}
                    <button type="button" className="bg-slate-700 text-white px-4 py-2 rounded text-xs" onClick={goBack}>Back</button>
                </div>

                <div>
                    <SectionHeader title="- Approval Log Details -" />
                    <div className="mt-2 p-pl-table-item">
                        <MantineReactTable table={logTable} />
                    </div>
                </div>
            </div>

            {remarksModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg p-4 w-full max-w-md">
                        <h6 className="font-semibold mb-2">Message: Dealer Creation ADD/UPDATE</h6>
                        <p className="text-red-600 text-sm mb-1">Please Enter Remarks</p>
                        <textarea
                            className="w-full border rounded form-input text-sm min-h-[80px]"
                            maxLength={500}
                            placeholder="Enter Remarks..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                        <div className="flex justify-center gap-2 mt-3">
                            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded text-xs" onClick={submitRemarks}>Submit</button>
                            <button type="button" className="bg-slate-600 text-white px-4 py-2 rounded text-xs" onClick={() => setRemarksModal({ open: false, type: '' })}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
                    <div role="status" className="animate-spin">
                        <svg aria-hidden="true" className="h-8 w-8 fill-blue-600 text-gray-200" viewBox="0 0 100 101" fill="none">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    </div>
                </div>
            )}
        </>
    );
};

function dcStr(row: any, key: string) {
    const v = row?.[key];
    return v == null ? '' : String(v);
}

function dcDate(value: string) {
    if (!value) return '';
    if (value.includes('/')) return value.split(' ')[0];
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${d.getFullYear()}`;
}

function mapDcDetails(row: any): Partial<FormState> {
    const altBiz = dcStr(row, 'dcm_alternate_business')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
        .map((value) => ({ value, label: value }));
    return {
        requestId: dcStr(row, 'dcm_id'),
        reqDate: dcDate(dcStr(row, 'dcm_requisition_date')),
        codeGenerationNo: dcStr(row, 'dcm_orig_system_customer_ref'),
        newAccountCode: dcStr(row, 'dcm_new_act_number'),
        newBillToCode: dcStr(row, 'dcm_new_bill_to'),
        region: dcStr(row, 'depot_regn'),
        depot: dcStr(row, 'dcm_warehouse_code'),
        businessChannel: dcStr(row, 'dcm_business_channel'),
        subFunction: dcStr(row, 'dcm_sub_function'),
        customerClass: dcStr(row, 'dcm_customer_class'),
        customerType: dcStr(row, 'dcm_cust_type_code'),
        customerSubType: dcStr(row, 'dcm_cust_type_sub_code'),
        leadId: dcStr(row, 'dcm_lead_id'),
        leadMobile: dcStr(row, 'dcm_lead_mobile_no'),
        territory: dcStr(row, 'dcm_sales_territory_code'),
        gstinAvailable: dcStr(row, 'dcm_gst_available'),
        gstFull: dcStr(row, 'dcm_cust_site_st_lst_reg_no'),
        gstType: dcStr(row, 'dcm_tax_payer_type'),
        gstDate: dcDate(dcStr(row, 'dcm_gst_date_of_reg')),
        panNo: dcStr(row, 'dcm_cust_site_it_pan_no'),
        firmType: dcStr(row, 'dcm_firm_type'),
        aadhar: dcStr(row, 'dcm_proprietor_aadhaar_no'),
        motherAccountCode: dcStr(row, 'dcm_mother_account_no'),
        distributorParentAcc: dcStr(row, 'dcm_distributor_parent_account'),
        retailerContactNo: dcStr(row, 'dcm_retailer_contact_no'),
        retailerAlternateContactNo: dcStr(row, 'dcm_retailer_altr_contact_no'),
        clubClass: dcStr(row, 'dcm_club_class'),
        accountName: dcStr(row, 'dcm_cust_name'),
        primarySite: dcStr(row, 'dcm_primary_site_use_flag') || 'Y',
        state: dcStr(row, 'dcm_state'),
        district: dcStr(row, 'dcm_district'),
        city: dcStr(row, 'dcm_city'),
        country: dcStr(row, 'dcm_country') || 'INDIA',
        discountType: dcStr(row, 'dcm_site_name'),
        address1: dcStr(row, 'dcm_address_line_1'),
        address2: dcStr(row, 'dcm_address_line_2'),
        address3: dcStr(row, 'dcm_address_line_3'),
        postalCode: dcStr(row, 'dcm_postal_code'),
        isWhatsapp: !!dcStr(row, 'dcm_whatsapp_number'),
        primaryContactNo: dcStr(row, 'dcm_prim_phone_number'),
        primaryContactPerson: dcStr(row, 'dcm_prim_person_name'),
        altContact1: dcStr(row, 'dcm_secd_phone_number'),
        altPerson1: dcStr(row, 'dcm_secd_person_name'),
        securityAmount: dcStr(row, 'dcm_security_amount'),
        securityAccNo: dcStr(row, 'dcm_security_deposit_ac_no'),
        securityCheque: dcStr(row, 'dcm_security_cheque_collected'),
        chequeNumber: dcStr(row, 'dcm_security_cheque_number'),
        reason: dcStr(row, 'dcm_reason'),
        bankAccount: dcStr(row, 'dcm_cust_acct_number'),
        confirmBankAcc: dcStr(row, 'dcm_cust_acct_number'),
        ifsc: dcStr(row, 'dcm_ifsc_code'),
        bankBranch: dcStr(row, 'dcm_cust_branch_name'),
        bankName: dcStr(row, 'dcm_cust_bank_name'),
        bankAcType: dcStr(row, 'dcm_bank_ac_type'),
        tradeNameBill: dcStr(row, 'dcm_trade_name'),
        legalNameBill: dcStr(row, 'dcm_legal_name'),
        tradeNameShip: dcStr(row, 'dcm_ship_to_trade_name'),
        legalNameShip: dcStr(row, 'dcm_ship_to_legal_name'),
        accountNo: dcStr(row, 'dcm_new_act_number'),
        billToCode: dcStr(row, 'dcm_new_bill_to'),
        shipAddress1: dcStr(row, 'dcm_ship_to_address_street_1'),
        shipAddress2: dcStr(row, 'dcm_ship_to_address_street_2'),
        shipAddress3: dcStr(row, 'dcm_ship_to_address_street_3'),
        shipState: dcStr(row, 'dcm_ship_to_state'),
        shipDistrict: dcStr(row, 'dcm_ship_to_district'),
        shipCity: dcStr(row, 'dcm_ship_to_city'),
        shipPostal: dcStr(row, 'dcm_ship_to_postal_code'),
        shipGstType: dcStr(row, 'dcm_ship_to_gst_tax_payee_type'),
        shipGstFull: dcStr(row, 'dcm_ship_to_gst_no'),
        shipPanNo: dcStr(row, 'dcm_ship_to_pan_no'),
        alternateBusiness: altBiz,
        email: dcStr(row, 'dcm_email_address'),
        competitionDealer: dcStr(row, 'dcm_competition_dealer_yn'),
        financialTranYn: dcStr(row, 'dcm_financial_tran_yn'),
        financialTranRemark: dcStr(row, 'dcm_financial_tran_remark'),
        relativeOrFriend: dcStr(row, 'dcm_relative_or_friend_yn'),
        relativeOrFriendRemark: dcStr(row, 'dcm_relative_or_friend_remark'),
        paymentTerms: dcStr(row, 'dcm_payment_terms_type'),
        tlvAmount: dcStr(row, 'dcm_tlv_amount'),
        creditLimit: dcStr(row, 'dcm_credit_limit'),
        creditDays: dcStr(row, 'dcm_proposed_credit_days'),
    };
}

function normalizeDcRuleValue(value: string) {
    return (value || '').trim().toUpperCase();
}

function is58RetailerSubTypeSelected(subTypeValue: string, subTypeText: string, clubClassValue: string, clubClassText: string) {
    const subVal = normalizeDcRuleValue(subTypeValue);
    const subTxt = normalizeDcRuleValue(subTypeText);
    const clubVal = normalizeDcRuleValue(clubClassValue);
    const clubTxt = normalizeDcRuleValue(clubClassText);
    const is58Retailer =
        subVal === '58-RETAILER' ||
        subVal === '58-REATILER' ||
        subTxt === '58-RETAILER' ||
        subTxt === '58-REATILER';
    if (!is58Retailer) return false;
    if (clubVal === 'FUSION' || clubTxt === 'FUSION') return false;
    return true;
}

async function validateMotherAccountGstFor58Retailer(args: {
    subTypeValue: string;
    subTypeText: string;
    clubClassValue: string;
    clubClassText: string;
    motherCode: string;
    distributorParentAcc: string;
    gstNo: string;
}): Promise<string> {
    if (
        !is58RetailerSubTypeSelected(
            args.subTypeValue,
            args.subTypeText,
            args.clubClassValue,
            args.clubClassText
        )
    ) {
        return '';
    }

    let motherCode = (args.motherCode || '').trim();
    if (!motherCode) motherCode = (args.distributorParentAcc || '').trim();
    const gstNo = (args.gstNo || '').trim().toUpperCase();
    if (!motherCode || !gstNo) return '';

    try {
        const response: any = await ValidateDcMotherCodeGst({ motherCode, gstNo });
        const row = response?.data?.table?.[0];
        if (!row) return 'Unable to validate Mother Account GSTN. Please try again.';
        const isMatched = String(row.is_gst_matched || '').trim().toUpperCase();
        if (isMatched === 'Y') return '';
        return 'Invalid GSTN. Please enter Mother Account valid GSTN number.';
    } catch {
        return 'Unable to validate Mother Account GSTN. Please try again.';
    }
}

export default DealerCreationDetails;
