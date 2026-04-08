'use client';
import Select from 'react-select';
import { FaPlus } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { useCallback, useMemo, useState, useEffect } from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import * as Epca from '../../../services/api/protectonEpca/EpcaList';
import Cookies from 'js-cookie';
import { UseAuthStore } from '../../../services/store/AuthStore';
import { EpcaCustomerStore } from '../../../services/store/Protecton/EpcaCustomerDetailsStore';
import { useNavigate } from 'react-router-dom';

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

type StoredEpcaListFilters = {
    depotCode: string;
    terrCode: string;
    mainStatusValue: string;
    subStatusLovCode: string;
    acctNo: string;
    customerName: string;
    billTo: string;
};

/**
 * In-memory snapshot; only applied when returning to the list from EPCADetails (see sessionStorage epcaListReturnFromDetails).
 * Cleared on full page reload and when opening the list any other way.
 */
let epcaListFiltersCache: StoredEpcaListFilters | null = null;

const EPCA_LIST_RETURN_FROM_DETAILS_KEY = 'epcaListReturnFromDetails';
type PcaType = {
    // set custom column headings
    depot_regn: string;
    depot_name: string;
    dlr_terr_code: string;
    dlr_dealer_code: string;
    dlr_dealer_name: string;
    dlr_bill_to: string;
    pd_appl_yn: string;
    pca_count: string;
    pca_approved: string;
    pca_pending: string;
    pca_rejected: string;
};

const EPCAList = () => {
    const [data, setData] = useState<PcaType[]>([]);
    const [selectedDropdown, setSelectedDropdown] = useState<SELECTED_DROPDOWN>(selectedDropdownInit);
    const [depot, setDepot] = useState<any>([]);
    const [applTerr, setApplTerr] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [approveStatus, setApproveStatus] = useState<any>([]);
    const { setCustomerProfile } = EpcaCustomerStore((state) => state);
    const user = UseAuthStore((state: any) => state.userDetails);
    const navigate = useNavigate();
    const [pcaParam, setPcaParam] = useState({
        acctNo: '',
        customerName: '',
        billTo: '',
        sblcode: '',
    });
    const [mainStatus, setMainStatus] = useState([
        { label: 'Pending', value: 'PENDING' },
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Rejected', value: 'REJECTED' },
    ]);

    const setValueInSessionStorage = (key: any, value: any) => {
        const storage = sessionStorage;
        storage.setItem(key, JSON.stringify(value));
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

    type GetPcaListOverrides = {
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
            const f: StoredEpcaListFilters = {
                depotCode: sel.Userdepot != -1 && dep[sel.Userdepot] ? dep[sel.Userdepot].depot_code : '',
                terrCode: sel.Userterritory != -1 && terr[sel.Userterritory] ? terr[sel.Userterritory].terr_code : '',
                mainStatusValue:
                    sel.Userstatus != -1 && mainStatus[sel.Userstatus] ? mainStatus[sel.Userstatus].value : 'PENDING',
                subStatusLovCode:
                    sel.UsersubStatus != -1 && approve[sel.UsersubStatus] ? approve[sel.UsersubStatus].lov_code : '',
                acctNo: pca.acctNo,
                customerName: pca.customerName,
                billTo: pca.billTo,
            };
            epcaListFiltersCache = f;
        } catch {
            /* ignore */
        }
    };

    const GetPcaListData = async (overrides?: GetPcaListOverrides) => {
        setLoading(true);
        const sel = overrides?.selected ?? selectedDropdown;
        const dep = overrides?.depotList ?? depot;
        const terr = overrides?.applTerrList ?? applTerr;
        const approve = overrides?.approveStatusList ?? approveStatus;
        const pca = overrides?.pcaParamOverride ?? pcaParam;

        const data: any = {
            app_id: 15,
            DepotCode: sel.Userdepot != -1 && dep[sel.Userdepot] ? dep[sel.Userdepot].depot_code : '',
            TerritoryCode: sel.Userterritory != -1 && terr[sel.Userterritory] ? terr[sel.Userterritory].terr_code : '',
            BillToCode: pca.billTo != '' ? pca.billTo : '',
            AcctNo: pca.acctNo != '' ? pca.acctNo : '',
            DealerName: pca.customerName != '' ? pca.customerName : '',
            SblCode: pca.sblcode != null && pca.sblcode !== '' ? pca.sblcode : '4',
            ApprovedStatus:
                sel.UsersubStatus != -1 && approve[sel.UsersubStatus] ? approve[sel.UsersubStatus].lov_code : '',
            MainStatus: sel.Userstatus != -1 && mainStatus[sel.Userstatus] ? mainStatus[sel.Userstatus].value : 'PENDING',
        };
        try {
            const response: any = await Epca.GetPcaList(data);
            if (response && response.data != null && response.data != undefined) setData(response.data.table);
            else setData([]);
            saveFiltersSnapshot(sel, dep, terr, approve, pca);
        } catch (error) {
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const selectedCustomer = useCallback(
        async (Lead: any) => {
            saveFiltersSnapshot(selectedDropdown, depot, applTerr, approveStatus, pcaParam);
            setCustomerProfile(Lead);
            setValueInSessionStorage('epcaDtlList', Lead);
            setValueInSessionStorage('epcaDtlListEntryType', 'View');
            await navigate('/Protecton/ePCA/EPCADetails/');
        },
        [selectedDropdown, depot, applTerr, approveStatus, pcaParam, setCustomerProfile, navigate]
    );

    const loadListInitialOrRestore = async (depotList: any[]) => {
        const returnFromDetails = sessionStorage.getItem(EPCA_LIST_RETURN_FROM_DETAILS_KEY) === '1';
        sessionStorage.removeItem(EPCA_LIST_RETURN_FROM_DETAILS_KEY);

        if (!returnFromDetails) {
            epcaListFiltersCache = null;
            GetPcaStatusData('PENDING').then(() => {
                setSelectedDropdown((prev) => ({
                    ...prev,
                    UsersubStatus: -1,
                }));
                GetPcaListData();
            });
            return;
        }

        const restored = await tryRestoreEpcaListFilters(depotList);
        if (!restored) {
            GetPcaStatusData('PENDING').then(() => {
                setSelectedDropdown((prev) => ({
                    ...prev,
                    UsersubStatus: -1,
                }));
                GetPcaListData();
            });
        }
    };

    const tryRestoreEpcaListFilters = async (depotList: any[]): Promise<boolean> => {
        const f = epcaListFiltersCache;
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

        const statusList =
            (await GetPcaStatusData(f.mainStatusValue || 'PENDING', f.subStatusLovCode)) ?? [];

        const terrIdx =
            f.terrCode && terrList.length > 0
                ? Math.max(0, terrList.findIndex((t: any) => t.terr_code === f.terrCode))
                : 0;
        const subIdx =
            f.subStatusLovCode && statusList.length > 0
                ? Math.max(0, statusList.findIndex((s: any) => s.lov_code === f.subStatusLovCode))
                : 0;

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

        await GetPcaListData({
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
        if (user) {
            const data: any = {
                user_id: user.user_id,
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
                setLoading(false);
                setDepot([]);
            } finally {
                if (user && updatedDepotList.length > 0) {
                    void loadListInitialOrRestore(updatedDepotList);
                } else if (user) {
                    setLoading(false);
                }
            }
        } else {
            localStorage.clear();
            // deleteCookie('authToken');
            Cookies.remove('authToken');
            navigate('/login/cover-login');
            // router.push('/login/cover-login');
        }
    };

    const GetApplicableTerritory = async (depotCode: any, selectTerrCode?: string) => {
        setLoading(true);
        if (user) {
            const data: any = {
                user_id: user.user_id,
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
        } else {
            localStorage.clear();
            // deleteCookie('authToken');
            Cookies.remove('authToken');
            navigate('/login/cover-login');
        }
        return [];
        //setLoading(false);
    };

    const GetPcaStatusData = async (selectedStatus: any, preferredLovCode?: string) => {
        //setLoading(true);
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

            if (preferredLovCode != null && preferredLovCode !== '') {
                const subIdx = updatedStatusList.findIndex((item: any) => item.lov_code === preferredLovCode);
                setSelectedDropdown((prev) => ({
                    ...prev,
                    UsersubStatus: subIdx >= 0 ? subIdx : 0,
                }));
            } else {
                const currentUsersubStatusExists = updatedStatusList.some(
                    (item) => item.lov_code === selectedDropdown.UsersubStatus
                );
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
        //setLoading(false);
    };

    useEffect(() => {
        GetApplicableDepot();
    }, []);

    const handleSearch = (e: any) => {
        e.preventDefault();
        GetPcaListData(); // Call the API with current state values
    };


    const AddNewPCA = () => {
        //setLoading(true);
        saveFiltersSnapshot(selectedDropdown, depot, applTerr, approveStatus, pcaParam);
        setCustomerProfile(null);
        setValueInSessionStorage('epcaDtlListEntryType', 'New');
        navigate('/Protecton/ePCA/EPCADetails/');
        //setLoading(false);
    };

    const columns = useMemo<MRT_ColumnDef<PcaType>[]>(
        () => [
            {
                accessorKey: 'depot_regn',
                header: 'Region',
                size: 60,
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
                accessorKey: 'dlr_dealer_code',
                header: 'Acct. No.',
                size: 50,
            },
            {
                accessorKey: 'dlr_dealer_name',
                header: 'Customer Name',
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
                accessorKey: 'dlr_bill_to',
                header: 'Bill To',
                size: 50,
            },
            {
                accessorKey: 'pd_appl_yn',
                header: 'PD Applicable',
                Cell: ({ cell }) => (cell.getValue() === 'Y' ? 'Yes' : 'No'),
                size: 50,
            },
            {
                accessorKey: 'pca_count',
                header: 'Total SKU',
                size: 50,
            },
            {
                accessorKey: 'pca_approved',
                header: 'Approved SKU',
                size: 50,
            },
            {
                accessorKey: 'pca_pending',
                header: 'Pending SKU',
                size: 50,
            },
            {
                accessorKey: 'pca_rejected',
                header: 'Rejected SKU',
                size: 50,
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

    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
                <h5 className="text-lg font-semibold dark:text-white-light">e-PCA List</h5>
            </div>

            <div className="bg-white rounded-lg px-4 py-2 shadow-md mb-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Depot */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Depot:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={depot[selectedDropdown.Userdepot]}
                            options={depot}
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
                            value={applTerr[selectedDropdown.Userterritory]}
                            options={applTerr}
                            onChange={() => {
                                handleTypeSelect(event, 'USER_TERR');
                            }}
                        />
                    </div>

                    {/* Acct. No. */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Acct. No.:</label>
                        <input type="text" placeholder="Acct. No." className="w-full border rounded form-input text-sm" name="acctNo" value={pcaParam.acctNo} onChange={handleChange} autoComplete="off" />
                    </div>

                    {/* Customer Name */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Customer Name:</label>
                        <input type="text" placeholder="Customer Name" className="w-full border rounded form-input text-sm" name="customerName" value={pcaParam.customerName} onChange={handleChange} autoComplete="off" />
                    </div>

                    {/* Bill To */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Bill To:</label>
                        <input type="text" placeholder="Bill To" className="w-full border rounded form-input text-sm" name="billTo" value={pcaParam.billTo} onChange={handleChange} autoComplete="off" />
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
                        <button className="bg-blue-500 text-white px-4 py-2 space-x-2 rounded hover:bg-blue-600 text-xs flex items-center" onClick={handleSearch}>
                            <CiSearch />  <span>Search</span>
                        </button>
                        <button className="bg-blue-500 text-white px-4 py-2 space-x-2 rounded hover:bg-blue-600 text-xs flex items-center" onClick={() => AddNewPCA()}>
                            <FaPlus />   <span>New e-PCA Request</span>
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

export default EPCAList;
