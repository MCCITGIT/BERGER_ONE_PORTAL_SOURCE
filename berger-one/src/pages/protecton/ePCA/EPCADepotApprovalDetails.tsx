import { EpcaDepotApprovalStore } from '../../../services/store/Protecton/EpcaDepotApprovalStore';
import Select from 'react-select';
import { Select as MantineSelect } from '@mantine/core';
import { Button } from '@mantine/core';
import { useMemo, useState, useEffect, type ChangeEvent, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from 'react';
import * as Epca from '../../../services/api/protectonEpca/EpcaList';
import * as EpcaDetails from '../../../services/api/protectonEpca/EpcaDetails';
import * as EpcaDepotApproval from '../../../services/api/protectonEpca/EPCADepotApproval';
import { UseAuthStore } from '../../../services/store/AuthStore';
import { GetProdDevImgRouteBuilder } from '../../../services/functions/getProdDevUrlBuilder';
import { commonErrorToast, commonSuccessToast } from '../../../services/functions/commonToast';
import { commonAlert } from '../../../services/functions/commonAlert';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { IoMdSave } from 'react-icons/io';
import { FiEye } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { IoReturnUpBack } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';


export interface SELECTED_DROPDOWN {
    Appldepot: number;
    Applterritory: number;
    Dealer: number;
    BilltoCode: number;
    FactoryCode: number;
    Userstatus: number;
    UsersubStatus: number;
}
const selectedDropdownInit: SELECTED_DROPDOWN = {
    Appldepot: -1,
    Applterritory: -1,
    Dealer: -1,
    BilltoCode: -1,
    FactoryCode: -1,
    Userstatus: 0,
    UsersubStatus: -1,
};

interface PcaBesicViewInit {
    sku_id: any;
    sku_code: any;
    sku_desc: any;
    sku_uom: any;
    sku_pack_size: any;
}
const PcaBesicViewDto: PcaBesicViewInit = {
    sku_id: '',
    sku_code: '',
    sku_desc: '',
    sku_uom: '',
    sku_pack_size: '',
};

interface PcaDetailViewInit {
    pdl_auto_id: any;
    pdl_billto_code: any;
    pdl_sku_id: any;
    pdl_factory: any;
    pdl_rate: any;
    pdl_qty: any;
    pdl_valid_from: any;
    pdl_valid_till: any;
    pdl_status: any;
    status_code: any;
    pdl_remarks: any;
    created_date: any;
}
const PcaDetailViewDto: PcaDetailViewInit = {
    pdl_auto_id: '',
    pdl_billto_code: '',
    pdl_sku_id: '',
    pdl_factory: '',
    pdl_rate: '',
    pdl_qty: '',
    pdl_valid_from: '',
    pdl_valid_till: '',
    pdl_status: '',
    status_code: '',
    pdl_remarks: '',
    created_date: '',
};

export interface validationObj {
    auto_id: any;
    billto_code: any;
    sku_id: any;
    factory: any;
    rate: any;
    qty: any;
    valid_from: any;
    valid_till: any;
    status: any;
    remarks: any;
    app_name: any;
    user_id: any;
    mrp: any;
    depot: any;
    terr: any;
    dealer: any;
    billto: any;
    projectid: any;
}
export const allErrorMsg: validationObj = {
    auto_id: '',
    billto_code: '',
    sku_id: '',
    factory: '',
    rate: '',
    qty: '',
    valid_from: '',
    valid_till: '',
    status: '',
    remarks: '',
    app_name: '',
    user_id: '',
    mrp: '',
    depot: '',
    terr: '',
    dealer: '',
    billto: '',
    projectid: '',
};

type PcaDetailsType = {
    // set custom column headings
    currentStatus: string,
    bill_to: string;
    dealer_code: string;
    dealer_name: string;
    sku_id: string;
    sku_desc: string;
    sku_uom: string;
    sku_pack_size: string;
    factory_code: string;
    factory: string;
    rate: string;
    qty: string;
    valid_from: string;
    valid_till: string;
    status_code: string;
    status_value: string;
    remarks: string;
    pd_auto_id: string;
    pd_mrp: string;
    submit_yn: string;
    pd_resubmit_yn: string;
    pca_auto_id: any;
    approved_type: string;
    rejected_type: string;
    editable_yn: string;
};

interface PcaEntity {
    AutoId: number;
    BillTo: string;
    SkuCode: string;
    FactoryCode: string;
    Nop: number;
    RatePerPack: number;
    ValidFrom: string | undefined;
    ValidTill: string | undefined;
    CurrentStatus: string;
    RejectionRemarks: string;
}

const EPCADepotApprovalDetails = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    // const currentCustomerDetails: any = EpcaDepotApprovalStore((state) => state.selectedCustomerProfile);
    let currentCustomerDetails: any = EpcaDepotApprovalStore((state) => state.selectedCustomerProfile);
    const [selectedDropdown, setSelectedDropdown] = useState<SELECTED_DROPDOWN>(selectedDropdownInit);
    const [depot, setDepot] = useState<any>({ label: '', value: '', depot_name: '', depot_code: '' });
    const [applTerr, setApplTerr] = useState<any>([]);
    const [dealer, setDealer] = useState<any>([]);
    const [pdAppl, setPdAppl] = useState<any>('Y');
    // const [_, setProjectData] = useState<any>([]);
    // const [_, setSkuData] = useState<any>([]);
    const [projectSearchValue] = useState('');
    const [billToData, setbillToData] = useState<any>([]);
    // const [errMsg, setErrMsg] = useState<validationObj>(allErrorMsg);
    const [data, setData] = useState<PcaDetailsType[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [approveStatus, setApproveStatus] = useState<any>([]);
    const [showPCAModal, setShowPCAModal] = useState(false);
    const [pcaBesicData, setPcaBesicData] = useState<PcaBesicViewInit[]>([PcaBesicViewDto]);
    const [pcaDetailData, setPcaDetailData] = useState<PcaDetailViewInit[]>([PcaDetailViewDto]);
    const user = UseAuthStore((state: any) => state.userDetails);
    const [mainStatus] = useState([
        { label: 'Pending', value: 'PENDING' },
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Rejected', value: 'REJECTED' },
    ]);

    useEffect(() => {
        GetApplicableDepot();
        GetPcaStatusData('PENDING').then(() => {
            // Set the default value after dropdown data is populated
            setSelectedDropdown((prev) => ({
                ...prev,
                UsersubStatus: 1,
            }));
        });
    }, []);

    useEffect(() => { }, [currentCustomerDetails]);

    const findSelectedTypeValue = (arr: any[], arrPropName: string, checkValue: string) => {
        if (arr && arr.length > 0) {
            const selectedValue = arr.findIndex((item: any) => item[arrPropName] == checkValue);
            return selectedValue == -1 ? -1 : selectedValue;
        } else return -1;
    };

    const handleTypeSelect = (e: any, flag: 'USER_DEPOT' | 'USER_TERR' | 'DEALER' | 'BILL_TO' | 'USER_STATUS' | 'USER_SUB_STATUS') => {
        if (flag == 'USER_DEPOT' && e && e.target.innerText && depot.length > 0) {
            let getIndex = findSelectedTypeValue(depot, 'label', e.target.innerText);
            setSelectedDropdown((prev) => ({ ...prev, Appldepot: getIndex }));
            GetApplicableTerritory(depot[getIndex].depot_code);
            if (selectedDropdown.Applterritory != -1) GetApplicableProject(depot[getIndex].depot_code, applTerr[selectedDropdown.Applterritory].terr_code, projectSearchValue);
        }

        if (flag == 'USER_TERR' && e && e.target.innerText && applTerr.length > 0) {
            let getIndex = findSelectedTypeValue(applTerr, 'label', e.target.innerText);
            setSelectedDropdown((prev) => ({ ...prev, Applterritory: getIndex }));
            GetDealerList(depot[selectedDropdown.Appldepot].depot_code, applTerr[getIndex].terr_code);
            if (selectedDropdown.Appldepot != -1) GetApplicableProject(depot[selectedDropdown.Appldepot].depot_code, applTerr[getIndex].terr_code, projectSearchValue);
        }

        if (flag == 'DEALER' && e && e.target.innerText && dealer.length > 0) {
            let getIndex = findSelectedTypeValue(dealer, 'label', e.target.innerText);
            setSelectedDropdown((prev) => ({ ...prev, Dealer: getIndex }));
            if (getIndex != -1) {
                GetApplicableBillto(depot[selectedDropdown.Appldepot].depot_code, dealer[getIndex].dealer_code, pdAppl);
            }
        }

        if (flag == 'BILL_TO' && e && e.target.innerText && billToData.length > 0) {
            let getIndex = findSelectedTypeValue(billToData, 'label', e.target.innerText);
            setSelectedDropdown((prev) => ({ ...prev, BilltoCode: getIndex }));
        }

        if (flag == 'USER_STATUS' && e && e.target.innerText && mainStatus.length > 0) {
            let getIndex = findSelectedTypeValue(mainStatus, 'label', e.target.innerText);
            setSelectedDropdown((prev) => ({ ...prev, Userstatus: getIndex }));
            GetPcaStatusData(mainStatus[getIndex].value);
        }

        if (flag == 'USER_SUB_STATUS' && e && e.target.innerText && approveStatus.length > 0) {
            let getIndex = findSelectedTypeValue(approveStatus, 'lov_code', e.target.innerText);
            setSelectedDropdown((prev) => ({ ...prev, UsersubStatus: getIndex }));
        }
    };

    const handlePdCheck = (event: any) => {
        if (event.target.checked) setPdAppl('Y');
        else setPdAppl('N');
        const newPdAppl = event.target.checked ? 'Y' : 'N';

        GetApplicableBillto(depot[selectedDropdown.Appldepot].depot_code, dealer[selectedDropdown.Dealer].dealer_code, newPdAppl);
    };

    const GetApplicableDepot = async () => {
        // setLoading(true);
        const data: any = {
            user_id: user.user_id,
            region: '',
            app_id: '15',
        };
        try {
            const response: any = await Epca.GetApplicableDepotList(data);

            const updatedDepotList = [
                { label: 'Select...', value: '', depot_name: '', depot_code: '' },
                ...response.data.map((item: any) => ({
                    label: item.depot_name,
                    value: item.depot_code,
                    depot_name: item.depot_name,
                    depot_code: item.depot_code,
                })),
            ];

            setDepot(updatedDepotList);
            if (currentCustomerDetails?.depot_code != '' && currentCustomerDetails?.depot_code != null)
                setSelectedDropdown((prev) => ({ ...prev, Appldepot: findSelectedTypeValue(updatedDepotList, 'depot_code', currentCustomerDetails?.depot_code) }));
        } catch (error) {
            setDepot([]);
        }
        // finally {
        // setLoading(false);
        // }
    };

    const GetDealerList = async (depotcode: any, terrcode: any) => {
        // setLoading(true);
        const data: any = {
            depot_code: depotcode,
            terr_code: terrcode,
            sbl_code: '4',
        };
        try {
            const response: any = await EpcaDetails.GetPcaDealersList(data);
            if (response.data != null && response.data != undefined) {
                const updatedDealertList = [
                    { label: 'Select...', value: '', dealer_name: '', dealer_code: '' },
                    ...response.data.map((item: any) => ({
                        label: item.dealer_name,
                        value: item.dealer_code,
                        dealer_name: item.dealer_name,
                        dealer_code: item.dealer_code,
                    })),
                ];

                setDealer(updatedDealertList);
                if (currentCustomerDetails?.dlr_dealer_code != '' && currentCustomerDetails?.dlr_dealer_code != null)
                    setSelectedDropdown((prev) => ({ ...prev, Dealer: findSelectedTypeValue(updatedDealertList, 'dealer_code', currentCustomerDetails?.dlr_dealer_code) }));
            } else setDealer([]);
        } catch (error) {
            setDealer([]);
        }
        // finally {
        // setLoading(false);
        // }
    };

    const GetApplicableTerritory = async (depotCode: any) => {
        // setLoading(true);
        const data: any = {
            user_id: 'murthy',
            depot_code: depotCode,
            app_id: '15',
        };
        try {
            const response: any = await Epca.GetApplicableTerrList(data);
            if (response.data != null && response.data != undefined) {
                const updatedTerrList = [
                    { label: 'Select...', value: '' },
                    ...response.data.map((item: any) => ({
                        label: item.terr_name,
                        value: item.terr_code,
                        terr_name: item.terr_name,
                        terr_code: item.terr_code,
                    })),
                ];
                setApplTerr(updatedTerrList);
                if (currentCustomerDetails?.dlr_terr_code != '' && currentCustomerDetails?.dlr_terr_code != null)
                    setSelectedDropdown((prev) => ({ ...prev, Applterritory: findSelectedTypeValue(updatedTerrList, 'terr_code', currentCustomerDetails?.dlr_terr_code) }));
            } else setApplTerr([]);
        } catch (error) {
            setApplTerr([]);
        }
        // finally {
        //     setLoading(false);
        // }
    };

    const GetApplicableProject = async (depotCode: any, terrcode: any, srch: string) => {
        // setLoading(true);
        const data: any = {
            depot_code: depotCode,
            terr_code: terrcode,
            srch: srch,
        };
        try {
            const response: any = await EpcaDetails.GetPcaProjectListByDepotTerr(data);
            if (response.data != null && response.data != undefined) {
                const data = transformProjectResults(response.data);
                // setProjectData(data);
            }
            // else setProjectData([]);
        } catch (error) {
            // setApplTerr([]);
            return;
        }
        // finally {
        //     setLoading(false);
        // }
    };

    const GetSkuData = async (srch: any) => {
        setLoading(true);
        const data: any = {
            PrefixText: srch,
            app_id: '15',
        };
        try {
            const response: any = await EpcaDetails.GetSKUList(data);
            if (response.data != null && response.data.table != null && response.data.table != undefined) {
                const data = transformSKUResults(response.data.table);
                // setSkuData(data);
            }
            // else setSkuData([]);
        } catch (error) {
            return;
        }
        setLoading(false);
    };

    const GetApplicableBillto = async (depotcode: any, dlrcode: any, pdAppl: string) => {
        // setLoading(true);
        const data: any = {
            depot_code: depotcode,
            dealer_code: dlrcode,
        };
        try {
            const response: any = await EpcaDetails.GetPcaBillToList(data);
            if (response.data != null && response.data != undefined) {
                const updatedBillToList = [
                    { label: 'Select...', value: '', bill_to_name: '', bill_to: '' },
                    ...response.data
                        .filter((item: any) => item.pd_appl_yn === pdAppl) // Filtering based on pd_appl_yn
                        .map((item: any) => ({
                            label: item.bill_to_name,
                            value: item.bill_to,
                            bill_to_name: item.bill_to_name,
                            bill_to: item.bill_to,
                        })),
                ];

                setbillToData(updatedBillToList);
                if (currentCustomerDetails?.dlr_bill_to != '' && currentCustomerDetails?.dlr_bill_to != null) {
                    setSelectedDropdown((prev) => ({ ...prev, BilltoCode: findSelectedTypeValue(updatedBillToList, 'bill_to', currentCustomerDetails?.dlr_bill_to) }));
                }
            } else {
                setbillToData([]);
            }
        } catch (error) {
            setbillToData([]);
        }
        finally {
            // setLoading(false);
        }
    };

    const GetFactorydata = async (skucode: string) => {
        const data = {
            sku_code: skucode,
            app_id: '15',
        };
        try {
            const response: any = await EpcaDetails.GetFactoryListBySKU(data);
            if (response.data && Array.isArray(response.data)) {
                const updatedFactoryList: any = response.data.map((item: any) => ({
                    label: item.org_name,
                    value: item.org_code, // org_code is used as the value
                }));
                return updatedFactoryList;
            } else {
                return [];
            }
        } catch (error) {
            // setFactory([]);
            return [];
        } finally {
            // setLoading(false);
        }
    };

    const GetPcaStatusData = async (selectedStatus: string) => {
        // setLoading(true);
        const data: any = {
            app_id: '15',
        };
        try {
            const response: any = await Epca.GetPcaStatusList(data);

            // Filter the data based on selectedStatus
            const dt = response.data.filter((item: any) => item.lov_field1_value === selectedStatus);

            let filteredData = dt;

            const selectedTable = dt.filter((item: any) => item.lov_value.includes('DEPOT'));
            if (selectedTable.length > 0) {
                filteredData = selectedTable;
            }

            const updatedStatusList = [
                { label: 'Select...', value: '', lov_value: '', lov_code: '' },
                ...filteredData.map((item: any) => ({
                    label: item.lov_value,
                    value: item.lov_code,
                    lov_value: item.lov_value,
                    lov_code: item.lov_code,
                })),
            ];

            setApproveStatus(updatedStatusList);

            const currentUsersubStatusExists = updatedStatusList.some((item) => item.lov_code === selectedDropdown.UsersubStatus);

            if (!currentUsersubStatusExists) {
                setSelectedDropdown((prev) => ({
                    ...prev,
                    UsersubStatus: 0,
                }));
            }
        } catch (error) {
            setApproveStatus([]);
        } finally {
            // setLoading(false);
        }
    };

    const GetePCADetailsData = async () => {
        setLoading(true);
        const data: any = {
            depotCode: currentCustomerDetails?.depot_code != '' ? currentCustomerDetails?.depot_code : '',
            territoryCode: currentCustomerDetails?.dlr_terr_code != '' ? currentCustomerDetails?.dlr_terr_code : '',
            billToCode: currentCustomerDetails?.dlr_bill_to != '' ? currentCustomerDetails?.dlr_bill_to : '',
            dealerCode: currentCustomerDetails?.dlr_dealer_code != '' ? currentCustomerDetails?.dlr_dealer_code : '',
            dealerName: currentCustomerDetails?.dlr_dealer_name != '' ? currentCustomerDetails?.dlr_dealer_name : '',
            sblCode: '4',
            approvedStatus: selectedDropdown.UsersubStatus != -1 ? approveStatus[selectedDropdown.UsersubStatus].lov_code : 'PENDING_DEPOT',
            mainStatus: selectedDropdown.Userstatus != -1 ? mainStatus[selectedDropdown.Userstatus].value : 'PENDING',
        };
        try {
            const response: any = await EpcaDepotApproval.GetePCADepotApprovalDetails(data);
            if (response && response.data != null && response.data != undefined) setData(response.data.table.map((t: any) => ({ ...t, currentStatus: "A" })));
            else setData([]);
        } catch (error) {
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const transformSKUResults = (results: any[]) => {
        return results.map((item: { sku_code: any; sku_desc: any; sku_id: any; sku_uom: any; sku_pack_size: any; sku_mrp: any; }) => ({
            value: `${item.sku_code || ''} - ${item.sku_desc || ''}`,
            details: {
                sku_id: item.sku_id,
                sku_code: item.sku_code,
                sku_desc: item.sku_desc,
                sku_uom: item.sku_uom,
                sku_pack_size: item.sku_pack_size,
                sku_mrp: item.sku_mrp,
            },
        }));
    };

    const transformProjectResults = (results: any[]) => {
        return results.map((item: { ProjectName: any; ProjectId: any; }) => ({
            value: item.ProjectName,
            details: item.ProjectId,
        }));
    };

    const customStylesForStatusSelect = {
        option: (base: any, { data }: any) => {
            return {
                ...base,
                fontSize: 12,
                fontWeight: 'bold',
                color: data.value == 'PENDING' ? 'orange' : data.value == 'APPROVED' ? 'green' : 'red',
            };
        },
    };

    const hasEditableRows = useMemo(() => {
        return data.some((row) => row.editable_yn === 'Y');
    }, [data]);

    useEffect(() => {
        if (currentCustomerDetails == '' || currentCustomerDetails == null || currentCustomerDetails == undefined) {
            const isExist: any = sessionStorage.getItem('epcaDepotDtlList');
            if (isExist != null) {
                const epcaDepotDtlList = JSON.parse(sessionStorage.getItem('epcaDepotDtlList') || '');
                currentCustomerDetails = epcaDepotDtlList;
            }
        }
        if (currentCustomerDetails ?? '') {
            setIsEditMode(true);
            GetePCADetailsData();
            GetApplicableTerritory(currentCustomerDetails.depot_code);
            GetDealerList(currentCustomerDetails.depot_code, currentCustomerDetails.dlr_terr_code);
            GetApplicableBillto(currentCustomerDetails.depot_code, currentCustomerDetails.dlr_dealer_code, currentCustomerDetails.pd_appl_yn);
            setPdAppl(currentCustomerDetails.pd_appl_yn);
        } else {
            setIsEditMode(false);
            GetApplicableDepot();
        }
    }, [currentCustomerDetails]);

    const handleEditChange = (e: any, rowIndex: number, field: string) => {
        // console.log('e', e, 'rowIndex', rowIndex, 'field', field)
        const value = e instanceof Date ? e : e.target.value;
        setData((prevData) => prevData.map((row, index) => (index === rowIndex ? { ...row, [field]: value } : row)));
    };

    const handleView = (row: any) => {
        GetPcaDetailsView(row.sku_id, row.pca_auto_id);
    };

    const GetPcaDetailsView = async (skucode: any, autoid: any) => {
        setLoading(true);
        const data: any = {
            skuCode: skucode,
            autoId: autoid,
        };
        try {
            const response: any = await EpcaDepotApproval.GetePCADetailsView(data);
            setPcaBesicData(response.data.table);
            setPcaDetailData(response.data.table1);
        } catch (error) {
            setPcaBesicData([]);
            setPcaDetailData([]);
        } finally {
            setLoading(false);
        }
    };

    const BesicDetailTable = ({ data }: any) => {
        return (
            <table className="custTableView w-full border-collapse">
                <thead>
                    <tr>
                        <th style={{ width: '25%', textAlign: 'center', verticalAlign: 'middle' }}>PROJECT NAME</th>
                        <th style={{ width: '25%', textAlign: 'center', verticalAlign: 'middle' }}>SKU CODE</th>
                        <th style={{ width: '25%', textAlign: 'center', verticalAlign: 'middle' }}>SKU NAME</th>
                        <th style={{ width: '15%', textAlign: 'center', verticalAlign: 'middle' }}>UOM</th>
                        <th style={{ width: '10%', textAlign: 'center', verticalAlign: 'middle' }}>PACK SIZE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{data[0].project_name}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{data[0].sku_code}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{data[0].sku_desc}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{data[0].sku_uom}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{data[0].sku_pack_size}</td>
                    </tr>
                </tbody>
            </table>
        );
    };

    const PCADetailsGrid = ({ data }: any) => {
        return (
            <table className="custTableView w-full border-collapse">
                <thead>
                    <tr>
                        <th style={{ width: '15%', textAlign: 'center' }}>Date</th>
                        <th style={{ width: '10%', textAlign: 'center' }}>Rate/Pack</th>
                        <th style={{ width: '10%', textAlign: 'center' }}>NOP</th>
                        <th style={{ width: '10%', textAlign: 'center' }}>REQUIRED FROM</th>
                        <th style={{ width: '10%', textAlign: 'center' }}>Valid From</th>
                        <th style={{ width: '10%', textAlign: 'center' }}>Valid Till</th>
                        <th style={{ width: '15%', textAlign: 'center' }}>Status</th>
                        <th style={{ width: '20%', textAlign: 'center' }}>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row: { created_date: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; pdl_rate: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; pdl_qty: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; pdl_factory: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; pdl_valid_from: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; pdl_valid_till: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; pdl_status: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; pdl_remarks: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.created_date}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.pdl_rate}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.pdl_qty}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.pdl_factory}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.pdl_valid_from}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.pdl_valid_till}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.pdl_status}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.pdl_remarks}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={Number(8)} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                No record(s) found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    };

    const columns = useMemo<MRT_ColumnDef<PcaDetailsType>[]>(
        () => [
            {
                accessorKey: 'sku_desc',
                header: 'SKU Name',
                size: 100,
            },
            {
                accessorKey: 'sku_uom',
                header: 'UOM',
                size: 50,
            },
            {
                accessorKey: 'sku_pack_size',
                header: 'Pack Size',
                size: 50,
            },
            {
                accessorKey: 'sku_pca',
                header: 'Declared PCA(Lt/Kg)',
                size: 50,
            },
            {
                accessorKey: 'rate',
                header: 'Rate(Lt/Kg)',
                size: 50,
                Cell: ({ row }) => <input className="tableInput" autoComplete="off" type="text" value={row.original.rate} onChange={(e) => handleEditChange(e, row.index, 'rate')} />,
            },
            {
                accessorKey: 'qty',
                header: 'NOP(Lt/Kg)',
                size: 50,
                Cell: ({ row }) => <input className="tableInput" autoComplete="off" type="text" value={row.original.qty} onChange={(e) => handleEditChange(e, row.index, 'qty')} />,
            },

            {
                accessorKey: 'valid_from',
                header: 'Valid From',
                size: 50,
                Cell: ({ row }) => {
                    const parseDate = (dateStr: string) => {
                        const [day, month, year] = dateStr.split('/');
                        return new Date(`${year}-${month}-${day}`);
                    };

                    const validFrom = row.original.valid_from ? parseDate(row.original.valid_from) : null;

                    return (
                        <Flatpickr
                            value={validFrom || ''}
                            onChange={(dates) => {
                                handleEditChange(dates[0], row.index, 'valid_from');
                            }}
                            options={{
                                dateFormat: 'd/m/Y',
                            }}
                            className="tableInput"
                            disabled
                        />
                    );
                },
            },
            {
                accessorKey: 'valid_till',
                header: 'Valid Till',
                size: 50,
                Cell: ({ row }) => {
                    const parseDate = (dateStr: string | number | Date) => {
                        if (typeof dateStr === 'string' && dateStr.includes('/')) {
                            const [day, month, year] = dateStr.split('/');
                            return new Date(`${year}-${month}-${day}`);
                        } else if (typeof dateStr === 'object') {
                            const date = new Date(dateStr);
                            const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
                            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                            const year = date.getFullYear();
                            return new Date(`${year}-${month}-${day}`);
                        }
                        return null; // Return null if the date string is invalid or not in the expected format
                    };

                    const validFrom = row.original.valid_from ? parseDate(row.original.valid_from) : null;
                    const validTill = row.original.valid_till ? parseDate(row.original.valid_till) : null;

                    return (
                        <Flatpickr
                            value={validTill || ''}
                            onChange={(dates) => handleEditChange(dates[0], row.index, 'valid_till')}
                            options={{
                                dateFormat: 'd/m/Y',
                                minDate: validFrom ? validFrom : undefined, // Disable dates before validFrom
                            }}
                            className="tableInput"
                        />
                    );
                },
            },

            {
                accessorKey: 'factory',
                header: 'Required From',
                size: 60,
                Cell: ({ row }) => {
                    const [options, setOptions] = useState<any[]>([]);
                    const [selectedFactory, setSelectedFactory] = useState<string>('');

                    const staticFactoryValue = row.original.factory || ''; // Full value like '300:Howrah - Mfg'
                    const factoryCode = staticFactoryValue.split(':')[0]; // Extract the factory code (e.g., '300')

                    useEffect(() => {
                        setLoading(true);
                        const fetchOptions = async () => {
                            const factoryOptions = await GetFactorydata(row.original.sku_id);
                            setOptions(factoryOptions);

                            // Find the corresponding option in the dropdown
                            const selectedOption = factoryOptions.find((option: { value: string; }) => option.value === factoryCode);
                            if (selectedOption) {
                                setSelectedFactory(selectedOption.value); // Set the selected factory code
                            }
                        };

                        fetchOptions();
                        setLoading(false);
                    }, [row.original.sku_id, factoryCode]);

                    const handleFactoryChange = (value: string) => {
                        setSelectedFactory(value); // Update the selected factory when user selects an option
                    };

                    return (
                        <MantineSelect
                            data={options || []}
                            value={selectedFactory}
                            onChange={handleFactoryChange} // Add onChange handler
                            placeholder="Select"
                            withinPortal={true}
                        // className="tableInput"
                        />
                    );
                },
            },
            {
                accessorKey: 'currentStatus',
                header: 'Status',
                size: 60,
                Cell: ({ row }) => {
                    return (
                        <MantineSelect
                            data={[
                                { label: 'Approve', value: 'A' },
                                { label: 'Reject', value: 'R' },
                            ]}
                            value={row.original?.currentStatus || 'A'}
                            onChange={(value: any) => {
                                value && handleEditChange({ target: { value } }, row.index, 'currentStatus')
                            }}
                            placeholder="Select"
                            withinPortal={true}
                            clearable
                        />
                    );
                },
            },
            {
                accessorKey: 'remarks',
                header: 'Remarks',
                size: 50,
                Cell: ({ row }) => <input autoComplete="off" className="tableInput" type="text" value={row.original.remarks} onChange={(e) => handleEditChange(e, row.index, 'remarks')} />,
            },
            {
                id: 'action',
                header: 'Action',
                size: 50,
                Cell: ({ row }) => {
                    // const isDisabled = row.original.status_code === 'PENDING_DEPOT';
                    return (
                        <Button
                            variant="outline"
                            color="blue"
                            style={{ padding: 5 }}
                            leftIcon={<FiEye size={16} style={{ paddingRight: "2px" }} />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleView(row.original);
                                setShowPCAModal(true);
                            }}
                        >
                            View
                        </Button>
                    );
                },
            },
        ],
        [handleEditChange]
    );

    const [rowSelection, setRowSelection]: any = useState({});
    const [selectedRowIds, setselectedRowIds]: any = useState([]);

    const table = useMantineReactTable({
        columns,
        data,
        enableRowSelection: true, // Enable row selection with checkboxes
        enableStickyHeader: true,
        enableTopToolbar: false,
        enableSorting: false,
        enableColumnActions: false,
        state: {
            rowSelection,
        },
        onRowSelectionChange: (updater) => {
            const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
            setRowSelection(newSelection);
            const selectedRowIds = Object.keys(newSelection);
            const selectedRows = selectedRowIds.map((id) => data[Number(id)].pca_auto_id);
            setselectedRowIds([...selectedRows])
            // console.log('Selected Row Data:', selectedRows);
        },

        mantineTableProps: {
            className: 'custom-table',
        },

        // Configure row selection behavior
        mantineTableBodyRowProps: ({ row }) => ({
            onClick: row.original.editable_yn === 'Y' ? row.getToggleSelectedHandler() : undefined,
            sx: { cursor: row.original.editable_yn === 'Y' ? 'pointer' : 'not-allowed', height: '50px' },
        }),

        // Disable checkboxes when editable_yn is 'N'
        mantineSelectCheckboxProps: ({ row }) => ({
            disabled: row.original.editable_yn !== 'Y',
            checked: row.getIsSelected(),
            onChange: () => row.getToggleSelectedHandler()({}), // Pass an empty object as the event
        }),

        mantineTableHeadCellProps: {
            sx: { textAlign: 'left' },
        },
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        mantineTableContainerProps: {
            style: {
                overflowX: 'hidden',
            },
        },
        mantineTableBodyCellProps: () => ({
            onClick: (e) => {
                const tag = (e.target as HTMLElement).tagName.toLowerCase();
                if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'button') {
                    e.stopPropagation(); // Prevent input clicks from toggling row selection
                }
            },
            // sx: { textAlign: 'left' },
        }),
    });

    // async function DeletePca(autoId: any) {
    //     setLoading(true);
    //     commonAlert('Are you sure you want to delete this item?', '', 'warning').then(async (result: any) => {
    //         if (result.value) {
    //             const response: any = await EpcaDetails.DeletePcaDetails({ auto_id: autoId });

    //             if (response.response_message) {
    //                 commonSuccessToast('PCA Details Deleted Successfully');
    //                 router.push('/Protecton/ePCA/EPCAList/');
    //             }
    //         }
    //     });
    //     setLoading(false);
    // }

    const handleBackButton = () => {
        setLoading(true);
        // commonAlert('Are you sure?', '', 'warning').then(async (result: any) => {
        //     if (result.value) {
        sessionStorage.setItem('epcaDepotApprovalListReturnFromDetails', '1');
        navigate('/Protecton/ePCA/EPCADepotApprovalList/');
        //     }
        // });
        setLoading(false);
    };

    const handleSearch = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        GetePCADetailsData();
    };

    function convertDateFormat(dateString: string | number | Date) {
        if (typeof dateString === 'string' && dateString.includes('/')) {
            const [day, month, year] = dateString.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else if (typeof dateString === 'object') {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = date.getFullYear();
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
    }

    const handleFormSubmit = async () => {
        setLoading(true);
        const selectedRows = table.getSelectedRowModel().rows;
        const formattedData: PcaEntity[] = [];
        for (const row of selectedRows) {
            const original = row.original;
            const minRateResponse: any = await EpcaDetails.GetPcaMinRateBySku_Vr1({
                sku_code: original.sku_id,
                bill_to: original.bill_to,
            });
            // console.log(original)
            let minRate = 0;
            if (minRateResponse && minRateResponse.data && minRateResponse.data.length > 0) minRate = parseFloat(minRateResponse.data[0].smr_rebate);

            if (original.status_value === 'R' || parseFloat(original.rate) >= minRate) {
                const entity: PcaEntity = {
                    AutoId: original.pca_auto_id,
                    BillTo: original.bill_to,
                    SkuCode: original.sku_id,
                    FactoryCode: original.factory_code,
                    Nop: parseInt(original.qty, 10),
                    RatePerPack: parseFloat(original.rate),
                    ValidFrom: convertDateFormat(original.valid_from),
                    ValidTill: convertDateFormat(original.valid_till),

                    CurrentStatus: original.currentStatus === 'A' ? original.approved_type : original.rejected_type,
                    RejectionRemarks: original.remarks,
                };
                formattedData.push(entity);
                if (formattedData.length > 0) showSubmitAlert(formattedData);
                else commonErrorToast('Please select atleast one row');
            } else commonErrorToast(`PCA (${original.sku_id}) cannot go beyond the limit set by Accounts!`);
        }
        // console.log(formattedData)
        setLoading(false);
    };

    async function showSubmitAlert(data: any) {
        setLoading(true);
        commonAlert('Are you want to submit the PCA Depot Approval Info?', '', 'warning').then(async (result: any) => {
            if (result.value) {
                const transformedData = {
                    pca_Request_Dtl_List: data.map((item: { AutoId: any; BillTo: any; SkuCode: any; FactoryCode: any; Nop: any; RatePerPack: any; ValidFrom: string | number | Date; ValidTill: string | number | Date; CurrentStatus: any; RejectionRemarks: any; }) => ({
                        autoId: item.AutoId,
                        billTo: item.BillTo,
                        skuCode: item.SkuCode,
                        factoryCode: item.FactoryCode,
                        nop: item.Nop,
                        ratePerPack: item.RatePerPack,
                        validFrom: new Date(item.ValidFrom).toISOString(), // Convert to ISO format
                        validTill: new Date(item.ValidTill).toISOString(), // Convert to ISO format
                        currentStatus: item.CurrentStatus,
                        rejectionRemarks: item.RejectionRemarks,
                    })),
                };
                console.log(transformedData)
                const response: any = await EpcaDepotApproval.PcaApprovalDetailsSubmit(transformedData);
                if (response.response_message) {
                    commonSuccessToast('PCA Depot Approval details Updated Successfully');
                    sessionStorage.setItem('epcaDepotApprovalListReturnFromDetails', '1');
                    navigate('/Protecton/ePCA/EPCADepotApprovalList/');
                }
            }
        });
        setLoading(false);
    }

    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
                <h5 className="text-lg font-semibold dark:text-white-light">e-PCA Depot Approval Details</h5>
            </div>

            <div className="bg-white rounded-lg px-4 py-2 shadow-md mb-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Depot */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Depot:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={depot[selectedDropdown.Appldepot]}
                            options={depot}
                            isDisabled={isEditMode}
                            onChange={() => {
                                handleTypeSelect(event, 'USER_DEPOT');
                            }}
                        />
                    </div>

                    {/* Territory */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Territory:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={applTerr[selectedDropdown.Applterritory]}
                            options={applTerr}
                            isDisabled={isEditMode}
                            onChange={() => {
                                handleTypeSelect(event, 'USER_TERR');
                            }}
                        />
                    </div>

                    {/* Customer Name */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Customer:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={dealer[selectedDropdown.Dealer]}
                            options={dealer}
                            isDisabled={isEditMode}
                            onChange={() => {
                                handleTypeSelect(event, 'DEALER');
                            }}
                        />
                    </div>

                    {/* PD Applicable */}
                    <div>
                        <label className="formLabel">PD Applicable:</label>
                        <div className="mt-2 flex">
                            <label className="relative h-6 w-12">
                                <input
                                    autoComplete="off"
                                    type="checkbox"
                                    defaultChecked={pdAppl === 'Y'}
                                    className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                    id="custom_switch_checkbox1"
                                    checked={pdAppl === 'Y'}
                                    disabled={isEditMode}
                                    onChange={() => {
                                        handlePdCheck(event);
                                    }}
                                />
                                <span
                                    className={`outline_checkbox bg-icon block h-full rounded-full border-2 border-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-[#ebedf2] before:bg-[url(${GetProdDevImgRouteBuilder(
                                        '/assets/images/close.svg'
                                    )})] before:bg-center before:bg-no-repeat before:transition-all before:duration-300 peer-checked:border-primary peer-checked:before:left-7 peer-checked:before:bg-primary peer-checked:before:bg-[url(${GetProdDevImgRouteBuilder(
                                        '/assets/images/checked.svg'
                                    )})] dark:border-white-dark dark:before:bg-white-dark`}
                                ></span>
                            </label>
                        </div>
                    </div>

                    {/* Bill To */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Bill To:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={billToData[selectedDropdown.BilltoCode]}
                            options={billToData}
                            isDisabled={isEditMode}
                            onChange={() => {
                                handleTypeSelect(event, 'BILL_TO');
                            }}
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Status:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={mainStatus[selectedDropdown.Userstatus]}
                            options={mainStatus}
                            onChange={() => {
                                handleTypeSelect(event, 'USER_STATUS');
                            }}
                            styles={customStylesForStatusSelect}
                        />
                    </div>

                    {/* Sub Status */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Sub Status:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={approveStatus[selectedDropdown.UsersubStatus]}
                            options={approveStatus}
                            onChange={() => {
                                handleTypeSelect(event, 'USER_SUB_STATUS');
                            }}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-end space-x-2">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 space-x-2 rounded hover:bg-blue-600 text-xs flex items-center" onClick={handleSearch}>
                            <CiSearch /> <span>Search</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-2 p-pl-table-item" style={{ maxHeight: '45vh', overflowY: 'auto' }}>{data.length > 0 && <MantineReactTable table={table} />}</div>

            {/* <div className="panel mb-2">
                <form className=" border-1 space-y-5">
                    <div className="grid grid-cols-4 grid-rows-1 gap-2">
                        <div className="col-span-4 sm:col-span-2 md:col-span-1">
                            <label className="formLabel">Depot:</label>
                            <Select
                                isSearchable={true}
                                value={depot[selectedDropdown.Appldepot]}
                                options={depot}
                                isDisabled={isEditMode}
                                onChange={() => {
                                    handleTypeSelect(event, 'USER_DEPOT');
                                }}
                            />
                            {errMsg && errMsg.depot ? <div className="mt-1 text-danger">{errMsg.depot}</div> : ''}
                        </div>

                        <div className="col-span-4 sm:col-span-2 md:col-span-1">
                            <label className="formLabel">Territory:</label>
                            <Select
                                isSearchable={true}
                                value={applTerr[selectedDropdown.Applterritory]}
                                options={applTerr}
                                isDisabled={isEditMode}
                                onChange={() => {
                                    handleTypeSelect(event, 'USER_TERR');
                                }}
                            />
                            {errMsg && errMsg.terr ? <div className="mt-1 text-danger">{errMsg.terr}</div> : ''}
                        </div>

                        <div className="col-span-4 sm:col-span-2 md:col-span-1">
                            <label className="formLabel">Customer:</label>
                            <Select
                                isSearchable={true}
                                value={dealer[selectedDropdown.Dealer]}
                                options={dealer}
                                isDisabled={isEditMode}
                                onChange={() => {
                                    handleTypeSelect(event, 'DEALER');
                                }}
                            />
                            {errMsg && errMsg.dealer ? <div className="mt-1 text-danger">{errMsg.dealer}</div> : ''}
                        </div>

                        <div className="col-span-2 sm:col-span-2 md:col-span-1">
                            <label className="formLabel">PD Applicable:</label>
                            <div className="mt-2 flex">
                                <label className="relative h-6 w-12">
                                    <input
                                        autoComplete="off"
                                        type="checkbox"
                                        defaultChecked={pdAppl === 'Y'}
                                        className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                        id="custom_switch_checkbox1"
                                        checked={pdAppl === 'Y'}
                                        disabled={isEditMode}
                                        onChange={() => {
                                            handlePdCheck(event);
                                        }}
                                    />
                                    <span
                                        className={`outline_checkbox bg-icon block h-full rounded-full border-2 border-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-[#ebedf2] before:bg-[url(${GetProdDevImgRouteBuilder(
                                            '/assets/images/close.svg'
                                        )})] before:bg-center before:bg-no-repeat before:transition-all before:duration-300 peer-checked:border-primary peer-checked:before:left-7 peer-checked:before:bg-primary peer-checked:before:bg-[url(${GetProdDevImgRouteBuilder(
                                            '/assets/images/checked.svg'
                                        )})] dark:border-white-dark dark:before:bg-white-dark`}
                                    ></span>
                                </label>
                            </div>
                        </div>

                        <div className="col-span-4 sm:col-span-2 md:col-span-1">
                            <label className="formLabel">Bill To:</label>
                            <Select
                                isSearchable={true}
                                value={billToData[selectedDropdown.BilltoCode]}
                                options={billToData}
                                isDisabled={isEditMode}
                                onChange={() => {
                                    handleTypeSelect(event, 'BILL_TO');
                                }}
                            />
                            {errMsg && errMsg.billto ? <div className="mt-1 text-danger">{errMsg.billto}</div> : ''}
                        </div>

                        <div className="col-span-4 sm:col-span-2 md:col-span-1">
                            <label className="formLabel">Status:</label>
                            <Select
                                isSearchable={true}
                                value={mainStatus[selectedDropdown.Userstatus]}
                                options={mainStatus}
                                onChange={() => {
                                    handleTypeSelect(event, 'USER_STATUS');
                                }}
                                styles={customStylesForStatusSelect}
                            />
                        </div>

                        <div className="col-span-4 sm:col-span-2 md:col-span-1">
                            <label className="formLabel">Sub Status:</label>
                            <Select
                                isSearchable={true}
                                value={approveStatus[selectedDropdown.UsersubStatus]}
                                options={approveStatus}
                                onChange={() => {
                                    handleTypeSelect(event, 'USER_SUB_STATUS');
                                }}
                            />
                        </div>

                        <div className="col-span-4 sm:col-span-2 md:col-span-1">
                            <div className="sm-justify-center flex space-x-2">
                                <Button className="btn btn-info mt-4 w-24 rounded-full" variant="filled" onClick={handleSearch}>
                                    <CiSearch />
                                    <span className="whiteTx"> Search</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div> */}
            {/* Modal PopUp */}

            <div>
                <Transition appear show={showPCAModal} as={Fragment}>
                    <Dialog as="div" open={showPCAModal} onClose={() => setShowPCAModal(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 "
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div id="slideIn_down_modal" className="fixed inset-0 z-[200] overflow-y-auto bg-[black]/60">
                            <div className="flex min-h-screen items-start justify-center px-4">
                                <Dialog.Panel className="panel animate__animated animate__slideInDown my-8 w-full max-w-7xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="grid-cols-12 items-center justify-between bg-secondary-light px-2 py-1 md:flex">
                                        <div className="flex items-center justify-between bg-secondary-light px-2" style={{ width: `100%` }}>
                                            <div className="flex">
                                                {/* <img className="mr-2 h-8 w-auto" src={GetProdDevImgRouteBuilder('/assets/images/meeting.png')} alt="" /> */}
                                                <h5 className="text-lg font-bold">View</h5>
                                            </div>
                                            <button onClick={() => setShowPCAModal(false)} type="button" className="justify-end text-white-dark hover:text-dark">
                                                <RxCross2 />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="px-3 pt-2">
                                        <div className="table-responsive pb-2">
                                            <BesicDetailTable data={pcaBesicData} />
                                        </div>
                                        <div className="table-responsive">
                                            <PCADetailsGrid data={pcaDetailData} />
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>

            <div className="flex items-center justify-center gap-1 pb-3">
                {hasEditableRows && (
                    <button
                        type="button"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm flex items-center"
                        onClick={() => {
                            handleFormSubmit();
                        }}
                    >
                        {' '}
                        <IoMdSave /> &nbsp; Submit
                    </button>
                )}
                <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm flex items-center"
                    onClick={() => {
                        handleBackButton();
                    }}
                >
                    <IoReturnUpBack />  &nbsp; Back
                </button>
            </div>

            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
                    <div role="status" className="animate-spin">
                        <svg aria-hidden="true" className="h-8 w-8 fill-blue-600 text-gray-200" viewBox="0 0 100 101" fill="none">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                        <span className="sr-only text-white">Please Wait...</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default EPCADepotApprovalDetails;
