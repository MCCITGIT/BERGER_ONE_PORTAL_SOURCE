import React from 'react';
import Select from 'react-select';
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useCallback, useMemo, useState, useEffect } from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import * as Epca from '../../../services/api/protectonEpca/EpcaList';
import { TlvModuleStore } from '../../../services/store/Protecton/TlvModuleAllStore';
import { IoEyeSharp } from 'react-icons/io5';
import { IoMdDownload } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { selectStyles } from '../../../styles/select-styles';

export interface SELECTED_DROPDOWN {
    Userdepot: number;
    Userterritory: number;
    Userstatus: number;
    UsersubStatus: number;
}
const selectedDropdownInit: SELECTED_DROPDOWN = {
    Userdepot: -1,
    Userterritory: -1,
    Userstatus: 0,
    UsersubStatus: -1,
};

type StoredTlvRevisionListFilters = {
    depotCode: string;
    terrCode: string;
    mainStatusValue: string;
    subStatusLovCode: string;
    acctNo: string;
    customerName: string;
    billTo: string;
};

/** In-memory snapshot; applied when returning from TLVRevisionRequestDetails (sessionStorage tlvRevisionListReturnFromDetails). */
let tlvRevisionListFiltersCache: StoredTlvRevisionListFilters | null = null;

const TLV_LIST_RETURN_FROM_DETAILS_KEY = 'tlvRevisionListReturnFromDetails';
const TLV_REVISION_REQUEST_LIST_PATH = '/Protecton/TLV/TLVRevisionRequestList/';

type PcaType = {
    // set custom column headings
    depot_regn: string;
    depot_name: string;
    dlr_terr_code: string;
    dlr_dealer_code: string;
    dlr_dealer_name: string;
    dlr_bill_to: string;
    current_tlv: number;
    td_proposed_tlv: number;
    credit_days: number;
    td_proposed_cr_days: number;
    status_value: string;
    td_remarks: string;
    file_doc: string;
};

const TLVRevisionRequestList = () => {
    const { setCustomerProfile } = TlvModuleStore((state) => state);
    const navigate = useNavigate();

    const [data, setData] = useState<PcaType[]>([]);
    const [pcaParam, setPcaParam] = useState({
        acctNo: '',
        customerName: '',
        billTo: '',
        sblcode: '',
    });
    const [selectedDropdown, setSelectedDropdown] = useState<SELECTED_DROPDOWN>(selectedDropdownInit);
    const [depot, setDepot] = useState<any>([]);
    const [applTerr, setApplTerr] = useState<any>([]);
    const [approveStatus, setApproveStatus] = useState<any>([]);
    const [mainStatus, setMainStatus] = useState([
        { label: 'Pending', value: 'PENDING' },
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Rejected', value: 'REJECTED' },
    ]);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const labelValueConverter = (arr: any[], propertyNameLabel: string, propertyNameValue: string) => {
        arr.forEach((element) => {
            element['value'] = element[propertyNameValue];
            element['label'] = element[propertyNameLabel];
        });
        return arr;
    };
    const findSelectedTypeValue = (arr: any[], arrPropName: string, checkValue: string) => {
        if (arr && arr.length > 0) {
            const selectedValue = arr.findIndex((item: any) => item[arrPropName] == checkValue);
            return selectedValue == -1 ? -1 : selectedValue;
        } else return -1;
    };

    const handleTypeSelect = (e: any, flag: 'USER_DEPOT' | 'USER_TERR' | 'USER_STATUS' | 'USER_SUB_STATUS') => {
        if (flag == 'USER_DEPOT' && e && e.target.innerText && depot.length > 0) {
            let getIndex = findSelectedTypeValue(depot, 'label', e.target.innerText);
            setSelectedDropdown((prev) => ({ ...prev, Userdepot: getIndex }));
            GetApplicableTerritory(depot[getIndex].depot_code);
        }

        if (flag == 'USER_TERR' && e && e.target.innerText && applTerr.length > 0) {
            let getIndex = findSelectedTypeValue(applTerr, 'label', e.target.innerText);
            setSelectedDropdown((prev) => ({ ...prev, Userterritory: getIndex }));
        }

        if (flag == 'USER_STATUS' && e && e.target.innerText && mainStatus.length > 0) {
            let getIndex = findSelectedTypeValue(mainStatus, 'label', e.target.innerText);
            setSelectedDropdown((prev) => ({ ...prev, Userstatus: getIndex }));
            GetPcaStatusData(mainStatus[getIndex].value);
        }

        if (flag == 'USER_SUB_STATUS' && e && e.target.innerText && approveStatus.length > 0) {
            let getIndex = findSelectedTypeValue(approveStatus, 'label', e.target.innerText);
            setSelectedDropdown((prev) => ({ ...prev, UsersubStatus: getIndex }));
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setPcaParam((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    type GetTlvListOverrides = {
        selected?: SELECTED_DROPDOWN;
        depotList?: any[];
        applTerrList?: any[];
        approveStatusList?: any[];
        pcaParamOverride?: { acctNo: string; customerName: string; billTo: string; sblcode?: string };
    };

    const saveFiltersSnapshot = (
        sel: SELECTED_DROPDOWN,
        dep: any[],
        terr: any[],
        approve: any[],
        pca: { acctNo: string; customerName: string; billTo: string; sblcode?: string }
    ) => {
        try {
            const subLov =
                sel.UsersubStatus != -1 && approve[sel.UsersubStatus] ? approve[sel.UsersubStatus].lov_code : '';
            const f: StoredTlvRevisionListFilters = {
                depotCode: sel.Userdepot != -1 && dep[sel.Userdepot] ? dep[sel.Userdepot].depot_code : '',
                terrCode: sel.Userterritory != -1 && terr[sel.Userterritory] ? terr[sel.Userterritory].terr_code : '',
                mainStatusValue:
                    sel.Userstatus != -1 && mainStatus[sel.Userstatus] ? mainStatus[sel.Userstatus].value : 'PENDING',
                subStatusLovCode: subLov,
                acctNo: pca.acctNo,
                customerName: pca.customerName,
                billTo: pca.billTo,
            };
            tlvRevisionListFiltersCache = f;
        } catch {
            /* ignore */
        }
    };

    const GetTlvRevisionListData = async (overrides?: GetTlvListOverrides) => {
        setLoading(true);
        const sel = overrides?.selected ?? selectedDropdown;
        const dep = overrides?.depotList ?? depot;
        const terr = overrides?.applTerrList ?? applTerr;
        const approve = overrides?.approveStatusList ?? approveStatus;
        const pca = overrides?.pcaParamOverride ?? pcaParam;

        const approvedStatus =
            sel.UsersubStatus != -1 && approve[sel.UsersubStatus]?.lov_code
                ? approve[sel.UsersubStatus].lov_code
                : 'PENDING_DEPOT';

        const data: any = {
            app_id: 15,
            DepotCode: sel.Userdepot != -1 && dep[sel.Userdepot] ? dep[sel.Userdepot].depot_code : '',
            TerritoryCode: sel.Userterritory != -1 && terr[sel.Userterritory] ? terr[sel.Userterritory].terr_code : '',
            BillToCode: pca.billTo != '' ? pca.billTo : '',
            AcctNo: pca.acctNo != '' ? pca.acctNo : '',
            DealerName: pca.customerName != '' ? pca.customerName : '',
            SblCode: pca.sblcode != null && pca.sblcode !== '' ? pca.sblcode : '4',
            ApprovedStatus: approvedStatus,
            MainStatus: sel.Userstatus != -1 && mainStatus[sel.Userstatus] ? mainStatus[sel.Userstatus].value : 'PENDING',
        };
        try {
            const response: any = await Epca.GetTlvRevisionList(data);
            if (response && response.data != null && response.data != undefined) setData(response.data.table);
            else setData([]);
            saveFiltersSnapshot(sel, dep, terr, approve, pca);
        } catch (error) {
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const loadListInitialOrRestore = async (depotList: any[]) => {
        const returnFromDetails = sessionStorage.getItem(TLV_LIST_RETURN_FROM_DETAILS_KEY) === '1';
        sessionStorage.removeItem(TLV_LIST_RETURN_FROM_DETAILS_KEY);

        if (!returnFromDetails) {
            tlvRevisionListFiltersCache = null;
            GetPcaStatusData('PENDING').then(() => {
                setSelectedDropdown((prev) => ({
                    ...prev,
                    UsersubStatus: -1,
                }));
                GetTlvRevisionListData();
            });
            return;
        }

        const restored = await tryRestoreTlvRevisionListFilters(depotList);
        if (!restored) {
            GetPcaStatusData('PENDING').then(() => {
                setSelectedDropdown((prev) => ({
                    ...prev,
                    UsersubStatus: -1,
                }));
                GetTlvRevisionListData();
            });
        }
    };

    const tryRestoreTlvRevisionListFilters = async (depotList: any[]): Promise<boolean> => {
        const f = tlvRevisionListFiltersCache;
        if (!f) return false;
        const depIdx = f.depotCode ? depotList.findIndex((d: any) => d.depot_code === f.depotCode) : 0;
        if (f.depotCode && depIdx < 0) return false;

        const mainIdx = Math.max(0, mainStatus.findIndex((m: any) => m.value === f.mainStatusValue));

        let terrList: any[] = [];
        if (f.depotCode) {
            terrList = (await GetApplicableTerritory(f.depotCode, f.terrCode)) ?? [];
        } else {
            terrList = [{ label: 'Select...', value: '', terr_name: '', terr_code: '' }];
            setApplTerr(terrList);
        }

        const subArg =
            f.subStatusLovCode && f.subStatusLovCode !== '' ? f.subStatusLovCode : '';
        const statusList = (await GetPcaStatusData(f.mainStatusValue || 'PENDING', subArg)) ?? [];

        const terrIdx =
            f.terrCode && terrList.length > 0
                ? Math.max(0, terrList.findIndex((t: any) => t.terr_code === f.terrCode))
                : 0;
        const subIdx =
            f.subStatusLovCode && f.subStatusLovCode !== '' && statusList.length > 0
                ? Math.max(0, statusList.findIndex((s: any) => s.lov_code === f.subStatusLovCode))
                : -1;

        const restoredSelected: SELECTED_DROPDOWN = {
            Userdepot: depIdx >= 0 ? depIdx : 0,
            Userterritory: terrIdx,
            Userstatus: mainIdx,
            UsersubStatus: subIdx,
        };

        const mergedPca = {
            acctNo: f.acctNo ?? '',
            customerName: f.customerName ?? '',
            billTo: f.billTo ?? '',
        };

        setPcaParam((prev) => ({ ...prev, ...mergedPca }));
        setSelectedDropdown(restoredSelected);

        await GetTlvRevisionListData({
            selected: restoredSelected,
            depotList,
            applTerrList: terrList,
            approveStatusList: statusList,
            pcaParamOverride: { ...pcaParam, ...mergedPca },
        });
        return true;
    };

    const GetApplicableDepot = async () => {
        setLoading(true);
        const data: any = {
            user_id: 'murthy',
            region: '',
            app_id: '15',
        };
        let updatedDepotList: any[] = [];
        try {
            const response: any = await Epca.GetApplicableDepotList(data);
            updatedDepotList = [
                { label: 'Select...', value: '', depot_name: '', depot_code: '' },
                ...response.data.map((item: any) => ({
                    label: item.depot_name,
                    value: item.depot_code,
                    depot_name: item.depot_name,
                    depot_code: item.depot_code,
                })),
            ];

            setDepot(updatedDepotList);
        } catch (error) {
            setDepot([]);
        } finally {
            if (updatedDepotList.length > 0) {
                void loadListInitialOrRestore(updatedDepotList);
            } else {
                setLoading(false);
            }
        }
    };

    const GetApplicableTerritory = async (depotCode: any, selectTerrCode?: string) => {
        setLoading(true);
        const data: any = {
            user_id: 'murthy',
            depot_code: depotCode,
            app_id: '15',
        };
        try {
            let updatedTerrList: any[] = [];
            if (depotCode) {
                const response: any = await Epca.GetApplicableTerrList(data);
                if (response.data != null && response.data != undefined) {
                    updatedTerrList = [
                        { label: 'Select...', value: '', terr_name: '', terr_code: '' },
                        ...response.data.map((item: any) => ({
                            label: item.terr_name,
                            value: item.terr_code,
                            terr_name: item.terr_name,
                            terr_code: item.terr_code,
                        })),
                    ];
                    setApplTerr(updatedTerrList);
                } else {
                    updatedTerrList = [];
                    setApplTerr([]);
                }
            } else {
                updatedTerrList = [{ label: 'Select...', value: '', terr_name: '', terr_code: '' }];
                setApplTerr(updatedTerrList);
            }

            setSelectedDropdown((prev) => {
                let terrIdx = 0;
                if (selectTerrCode && updatedTerrList.length > 0) {
                    const found = updatedTerrList.findIndex((t: any) => t.terr_code === selectTerrCode);
                    terrIdx = found >= 0 ? found : 0;
                }
                return {
                    ...prev,
                    Userterritory: terrIdx,
                };
            });
            return updatedTerrList;
        } catch (error) {
            setApplTerr([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const GetPcaStatusData = async (selectedStatus: any, preferredLovCode?: string) => {
        const data: any = {
            app_id: '15',
        };
        try {
            const response: any = await Epca.GetPcaStatusList(data);
            const dt = response.data.filter((item: any) => item.lov_field1_value === selectedStatus);
            let filteredData = dt;
            if (selectedStatus.toUpperCase() === 'REJECTED') {
                const selectedTable = dt.filter((item: any) => !item.lov_value.includes('DEPOT'));
                if (selectedTable.length > 0) filteredData = selectedTable;
            } else {
                const selectedTable = dt;
                filteredData = selectedTable.length > 0 ? selectedTable : dt;
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

            if (preferredLovCode === '') {
                setSelectedDropdown((prev) => ({
                    ...prev,
                    UsersubStatus: -1,
                }));
            } else if (preferredLovCode != null && preferredLovCode !== '') {
                const subIdx = updatedStatusList.findIndex((item: any) => item.lov_code === preferredLovCode);
                setSelectedDropdown((prev) => ({
                    ...prev,
                    UsersubStatus: subIdx >= 0 ? subIdx : 0,
                }));
            } else {
                const currentItem = updatedStatusList[selectedDropdown.UsersubStatus];
                const currentUsersubStatusExists =
                    selectedDropdown.UsersubStatus >= 0 &&
                    currentItem &&
                    updatedStatusList.some((item) => item.lov_code === currentItem.lov_code);
                if (!currentUsersubStatusExists)
                    setSelectedDropdown((prev) => ({
                        ...prev,
                        UsersubStatus: 0,
                    }));
            }
            return updatedStatusList;
        } catch (error) {
            setApproveStatus([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetApplicableDepot();
    }, []);

    const handleSearch = (e: any) => {
        e.preventDefault();
        GetTlvRevisionListData(); // Call the API with current state values
    };

    const setValueInSessionStorage = (key: string, value: string) => {
        const storage = sessionStorage;
        storage.setItem(key, JSON.stringify(value));
    };

    const handleDownload = (event: React.MouseEvent<HTMLButtonElement>, fileUrl: string) => {
        event.preventDefault();
        // Check if the fileUrl is valid before proceeding
        if (fileUrl) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.target = '_blank';  // Open the file in a new tab
            link.click();  // Trigger the download
        } else {
            alert('No file available for download');
        }
    };

    const selectedCustomer = useCallback(
        (Lead: any) => {
            saveFiltersSnapshot(selectedDropdown, depot, applTerr, approveStatus, pcaParam);
            sessionStorage.setItem('tlvDetailsReturnPath', TLV_REVISION_REQUEST_LIST_PATH);
            setCustomerProfile(Lead);
            setValueInSessionStorage('epcaTLVDtlList', Lead);
            setValueInSessionStorage('epcaTLVDtlEntryType', 'View');
            navigate('/Protecton/TLV/TLVRevisionRequestDetails/');
        },
        [selectedDropdown, depot, applTerr, approveStatus, pcaParam, setCustomerProfile, navigate]
    );
    /*
    Inline CSS found in the code:

    1. In the MantineReactTable config:
    mantineTableContainerProps: {
        style: {
            overflowX: 'hidden', // hides horizontal scrollbar
        },
    },

    2. In the Action column Cell:
    style={{ fontSize: '20px', marginRight: '10px' }}
    style={{ fontSize: '20px' }}

    3. In the mainStatus Select label:
    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>

    4. In the approveStatus Select label:
    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>

    5. In the MantineReactTable wrapper:
    <div className="mb-2" style={{ maxHeight: '45vh', overflowY: 'auto' }}>
    */

    const AddNewTLVRevisionRequest = () => {
        saveFiltersSnapshot(selectedDropdown, depot, applTerr, approveStatus, pcaParam);
        sessionStorage.setItem('tlvDetailsReturnPath', TLV_REVISION_REQUEST_LIST_PATH);
        setCustomerProfile(null);
        setValueInSessionStorage('epcaTLVDtlEntryType', 'New');
        navigate('/Protecton/TLV/TLVRevisionRequestDetails/');
    };

    const columns = useMemo<MRT_ColumnDef<PcaType>[]>(
        () => [
            {
                accessorKey: 'depot_regn',
                header: 'Region',
                size: 50,
            },
            {
                accessorKey: 'depot_name',
                header: 'Depot',
                size: 80,
            },
            {
                accessorKey: 'dlr_terr_code',
                header: 'Territory',
                size: 50,
            },
            {
                accessorKey: 'dlr_bill_to',
                header: 'Bill To',
                size: 50,
            },
            {
                accessorKey: 'dlr_dealer_code',
                header: 'Acct. No.',
                size: 50,
            },
            {
                accessorKey: 'dlr_dealer_name',
                header: 'Dealer Name',
                size: 100,
                Cell: ({ cell }) => {
                    return (
                        <span
                            className='text-blue-600 cursor-pointer'
                            onClick={() => selectedCustomer(cell.row.original)}
                        >
                            {cell.row.original.dlr_dealer_name}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'current_tlv',
                header: 'Current TLV',
                size: 50,
            },
            {
                accessorKey: 'td_proposed_tlv',
                header: 'Requested TLV',
                size: 50,
            },
            {
                accessorKey: 'credit_days',
                header: 'Credit Days',
                size: 50,
            },
            {
                accessorKey: 'td_proposed_cr_days',
                header: 'Proposed Credit Days',
                size: 80,
            },
            {
                accessorKey: 'status_value',
                header: 'Status',
                size: 100,
            },
            {
                accessorKey: 'td_remarks',
                header: 'Remarks',
                size: 100,
            },
            {
                header: 'Action',
                size: 70,
                Cell: ({ cell }) => {
                    return (
                        <>
                            <span
                                className={`${cell.row.original.dlr_dealer_name && cell.row.original.dlr_dealer_name != '' ? 'cursor-pointer text-primary' : ''} text-xl mr-2.5`}
                                onClick={() => selectedCustomer(cell.row.original)}
                                title="View"
                            >
                                {cell.row.original.dlr_dealer_name && cell.row.original.dlr_dealer_name != '' ? (
                                    <>
                                        <div className="flex items-center justify-center">
                                            <button type="button" className="btn btn-primary" onClick={() => setModal(true)}>
                                                <IoEyeSharp />
                                            </button>
                                        </div>{' '}
                                    </>
                                ) : (
                                    ''
                                )}
                            </span>

                            {/* <span className="border-b border-[#ebedf2] p-3 text-center dark:border-[#191e3a]">
                                <Tippy content="Delete">
                                    <button type="button">
                                        <svg>...</svg>
                                    </button>
                                </Tippy>
                            </span> */}

                            <span
                                className={`${cell.row.original.dlr_dealer_name && cell.row.original.dlr_dealer_name != '' ? 'cursor-pointer text-info' : ''} text-xl`}
                                // onClick={() => selectedCustomer(cell.row.original)}
                                onClick={() => setModal(true)}
                                title="Download"
                            >
                                {cell.row.original.dlr_dealer_name && cell.row.original.dlr_dealer_name !== '' && cell.row.original.file_doc ? (
                                    <div className="flex items-center justify-center">
                                        <button
                                            type="button"
                                            className="btn btn-info"
                                            onClick={(e) => handleDownload(e, cell.row.original.file_doc)}
                                        >
                                            <IoMdDownload />
                                        </button>
                                    </div>
                                ) : null}
                            </span>
                        </>
                    );
                },
            },
        ],
        [selectedCustomer]
    );

    const table = useMantineReactTable({
        columns,
        data,
        enableColumnResizing: true,
        enableStickyHeader: true,
        enableTopToolbar: false,
        enableSorting: false,
        enableColumnActions: false,
        columnResizeMode: 'onChange',
        mantineTableContainerProps: {
            style: {
                overflow: 'auto',
                maxHeight: '16rem',
            },
        }
    });

    // useEffect(() => {
    //     console.log(pcaParam)
    // }, [pcaParam])
    // useEffect(() => {
    //     console.log(selectedDropdown)
    // }, [selectedDropdown])

    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
                <h5 className="text-lg font-semibold dark:text-white-light">TLV Revision Request List</h5>
            </div>

            <div className="bg-white rounded-lg px-4 py-1 shadow-md mb-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Depot:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={(() => {
                                const row =
                                    selectedDropdown.Userdepot >= 0
                                        ? depot[selectedDropdown.Userdepot]
                                        : null;
                                const code = row?.depot_code;
                                return code
                                    ? depot.find((option: any) => option.value === code) ?? null
                                    : null;
                            })()}
                            options={depot}
                            onChange={(opt: any) => {
                                if (!opt) return;
                                const getIndex = depot.findIndex((d: any) => d.depot_code === opt.depot_code);
                                if (getIndex < 0) return;
                                setSelectedDropdown((prev) => ({ ...prev, Userdepot: getIndex }));
                                GetApplicableTerritory(depot[getIndex].depot_code);
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Territory:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={applTerr[selectedDropdown.Userterritory]}
                            options={applTerr}
                            onChange={() => {
                                handleTypeSelect(event, 'USER_TERR');
                            }}
                            styles={selectStyles}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Acct. No.:</label>
                        <input type="text" placeholder="Acct. No." className="w-full border rounded form-input text-sm" name="acctNo" value={pcaParam.acctNo} onChange={handleChange} autoComplete="off" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Customer Name:</label>
                        <input type="text" placeholder="Customer Name" className="w-full border rounded form-input text-sm" name="customerName" value={pcaParam.customerName} onChange={handleChange} autoComplete="off" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Bill To:</label>
                        <input type="number" placeholder="Bill To" className="w-full border rounded form-input text-sm" name="billTo" value={pcaParam.billTo} onChange={handleChange} autoComplete="off" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Status:<span className="text-red-500 ml-0.5">*</span></label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={mainStatus[selectedDropdown.Userstatus]}
                            options={mainStatus}
                            onChange={() => {
                                handleTypeSelect(event, 'USER_STATUS');
                            }}
                            styles={selectStyles}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Sub Status:<span className="text-red-500 ml-0.5">*</span></label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={approveStatus[selectedDropdown.UsersubStatus]}
                            options={approveStatus}
                            onChange={() => {
                                handleTypeSelect(event, 'USER_SUB_STATUS');
                            }}
                            styles={selectStyles}
                        // styles={statusSelectStyles}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-end space-x-2">
                        <button className="bg-blue-500 text-white px-4 py-2 space-x-2 text-xs rounded hover:bg-blue-600 flex items-center" onClick={handleSearch}>
                            <CiSearch /> <span>Search</span>
                        </button>
                        <button className="bg-blue-500 text-white px-4 py-2 text-xs space-x-2 rounded hover:bg-blue-600 flex items-center" onClick={() => AddNewTLVRevisionRequest()}>
                            <FaPlus /> <span>New TLV Revision Request</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-2 p-pl-table-item">
                <MantineReactTable table={table} />
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

export default TLVRevisionRequestList;
