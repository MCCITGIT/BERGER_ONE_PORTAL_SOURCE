import { UseAuthStore } from '../../../services/store/AuthStore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import * as Epca from '../../../services/api/protectonEpca/EpcaList';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { EpcaHoApprovalDetailsStore } from '../../../services/store/Protecton/EpcaCustomerDetailsStore';
import { useNavigate } from 'react-router-dom';
import { CiSearch } from "react-icons/ci"

type EpcaDepotApprovalCustomerDetails = {
    depot_code: string;
    depot_name: string;
    dlr_terr_code: string;
    acctNo: string;
    customerName: string;
    billTo: string;
    main_status: string;
    aprv_status: string;
    sblcode?: string;
};

/**
 * In-memory snapshot; only applied when returning to the list from EPCADepotApprovalDetails
 * (sessionStorage epcaDepotApprovalListReturnFromDetails). Cleared on full reload or any other list entry.
 */
let epcaDepotApprovalListFiltersCache: EpcaDepotApprovalCustomerDetails | null = null;

const EPCA_DEPOT_APPROVAL_LIST_RETURN_KEY = 'epcaDepotApprovalListReturnFromDetails';

const DEPOT_SELECT_PLACEHOLDER = { depot_code: '', depot_name: 'Select...' };
const TERR_SELECT_PLACEHOLDER = { terr_code: '', terr_name: 'Select...' };

const EPCADepotApprovalList = () => {
    const user = UseAuthStore((state: any) => state.userDetails);
    const navigate = useNavigate();

    const [data, setData] = useState<any>([]);
    const [customerDetails, setCustomerDetails] = useState<any>({
        depot_code: "",
        depot_name: "",
        dlr_terr_code: "",
        acctNo: "",
        customerName: "",
        billTo: "",
        main_status: 'PENDING',
        aprv_status: "PENDING_DEPOT",
    });
    const [loading, setLoading] = useState(false);
    const [depot, setDepot] = useState<any>([]);
    const [applTerr, setApplTerr] = useState<any>([ { ...TERR_SELECT_PLACEHOLDER } ]);
    // const [dealer, setDealer] = useState<any>([]);
    // const [billToData, setbillToData] = useState<any>([]);
    const [approveStatus, setApproveStatus] = useState<any>([]);
    const mainStatusOptions = [
        { label: 'Select...', value: '' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Rejected', value: 'REJECTED' },
    ];

    const { setEpcaHoApprovalDetails } = EpcaHoApprovalDetailsStore((state) => state);

    const saveDepotApprovalFilters = (cd: EpcaDepotApprovalCustomerDetails) => {
        epcaDepotApprovalListFiltersCache = { ...cd };
    };

    const GetApplicableDepot = async (): Promise<any[]> => {
        const data: any = {
            user_id: user.user_id,
            region: '',
            app_id: '15',
        };
        let list: any[] = [];
        try {
            const response: any = await Epca.GetApplicableDepotList(data);
            list = [ { ...DEPOT_SELECT_PLACEHOLDER }, ...(response.data || []) ];
            setDepot(list);
        } catch (error) {
            setDepot([ { ...DEPOT_SELECT_PLACEHOLDER } ]);
        }
        return list;
    };

    const GetApplicableTerritory = async (cd: any) => {
        if (!cd) {
            setApplTerr([ { ...TERR_SELECT_PLACEHOLDER } ]);
            return;
        }
        setLoading(true);
        const data: any = {
            user_id: user.user_id,
            depot_code: cd,
            app_id: '15',
        };
        try {
            const response: any = await Epca.GetApplicableTerrList(data);
            const rows = response.data || [];
            setApplTerr([ { ...TERR_SELECT_PLACEHOLDER }, ...rows ]);
        } catch (error) {
            setApplTerr([ { ...TERR_SELECT_PLACEHOLDER } ]);
        } finally {
            setLoading(false);
        }
    };

    const GetePCAListData = async (detailsOverride?: EpcaDepotApprovalCustomerDetails) => {
        const cd = detailsOverride ?? customerDetails;
        setLoading(true);
        const data: any = {
            depotCode: cd.depot_code || '',
            territoryCode: cd.dlr_terr_code || '',
            billToCode: cd.billTo || '',
            dealerCode: cd.acctNo || '',
            dealerName: cd.customerName || '',
            sblCode: cd.sblcode || '4',
            approvedStatus: cd.aprv_status || 'PENDING_DEPOT',
            mainStatus: cd.main_status || 'PENDING',
        };
        try {
            const response: any = await Epca.GetePCADepotApprovalList(data);
            if (response && response.data != null && response.data != undefined) setData(response.data.table);
            else setData([]);
            saveDepotApprovalFilters(cd);
        } catch (error) {
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const tryRestoreDepotApprovalFilters = async (depotList: any[]): Promise<boolean> => {
        const f = epcaDepotApprovalListFiltersCache;
        if (!f) return false;
        if (f.depot_code) {
            const exists = depotList.some((d: any) => d.depot_code === f.depot_code);
            if (!exists) return false;
        }
        setCustomerDetails(f);
        if (f.depot_code) {
            await GetApplicableTerritory(f.depot_code);
        } else {
            setApplTerr([ { ...TERR_SELECT_PLACEHOLDER } ]);
        }
        await GetePCAListData(f);
        return true;
    };

    const loadDepotApprovalInitialOrRestore = async (depotList: any[]) => {
        const returnFromDetails = sessionStorage.getItem(EPCA_DEPOT_APPROVAL_LIST_RETURN_KEY) === '1';
        sessionStorage.removeItem(EPCA_DEPOT_APPROVAL_LIST_RETURN_KEY);

        if (!returnFromDetails) {
            epcaDepotApprovalListFiltersCache = null;
            await GetePCAListData();
            return;
        }

        const restored = await tryRestoreDepotApprovalFilters(depotList);
        if (!restored) {
            await GetePCAListData();
        }
    };

    const openDepotApprovalRow = useCallback(
        (row: any) => {
            saveDepotApprovalFilters(customerDetails);
            setEpcaHoApprovalDetails(row);
            sessionStorage.setItem('epcaDepotDtlList', JSON.stringify(row));
            navigate('/Protecton/ePCA/EPCADepotApprovalDetails/');
        },
        [customerDetails, setEpcaHoApprovalDetails, navigate]
    );

    const GetPcaStatusData = async () => {
        // setLoading(true);
        const data: any = {
            app_id: '15',
        };
        try {
            const response: any = await Epca.GetPcaStatusList(data);
            setApproveStatus(response.data);
            // setApproveStatus(response.data.filter((item: any) => item.lov_field1_value === cd))
            // setApproveStatus(response.data.filter((item: any) => item.lov_field1_value === cd && !item.lov_value.includes('HO')))
        } catch (error) {
            setApproveStatus([]);
        } 
        finally {
            // setLoading(false);
        }
    };

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
                            onClick={() => openDepotApprovalRow(cell.row.original)}
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
                size: 50,
                Cell: ({ cell }) => (cell.getValue() === 'Y' ? 'Yes' : 'No'),
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
        [openDepotApprovalRow]
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

    const depotSelectOptions = useMemo(
        () => depot.map((d: any) => ({ value: d.depot_code, label: d.depot_name })),
        [depot]
    );
    const depotSelectValue =
        depotSelectOptions.find((o: { value: string; label: string }) => o.value === (customerDetails?.depot_code ?? '')) ??
        depotSelectOptions[0] ?? { value: '', label: 'Select...' };

    const terrSelectOptions = useMemo(
        () => applTerr.map((d: any) => ({ value: d.terr_code, label: d.terr_name })),
        [applTerr]
    );
    const terrSelectValue =
        terrSelectOptions.find((o: { value: string; label: string }) => o.value === (customerDetails?.dlr_terr_code ?? '')) ??
        terrSelectOptions[0] ?? { value: '', label: 'Select...' };

    const subStatusSelectOptions = useMemo(() => {
        const filtered = customerDetails?.main_status
            ? approveStatus.filter((item: any) => item.lov_field1_value === customerDetails?.main_status)
            : approveStatus.filter((item: any) => item.lov_field1_value === 'PENDING');
        return [
            { value: '', label: 'Select...' },
            ...filtered.map((d: any) => ({ value: d.lov_code, label: d.lov_value })),
        ];
    }, [approveStatus, customerDetails?.main_status]);

    const subStatusSelectValue =
        subStatusSelectOptions.find((o) => o.value === (customerDetails?.aprv_status ?? '')) ??
        subStatusSelectOptions[0] ?? { value: '', label: 'Select...' };

    const mainStatusSelectValue =
        mainStatusOptions.find((m) => m.value === (customerDetails?.main_status ?? '')) ?? mainStatusOptions[0];

    useEffect(() => {
        let cancelled = false;
        (async () => {
            await GetPcaStatusData();
            const depotList = await GetApplicableDepot();
            if (cancelled) return;
            await loadDepotApprovalInitialOrRestore(depotList);
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
                <h5 className="text-lg font-semibold dark:text-white-light">e-EPCA Depot Approval List</h5>
            </div>

            <div className="bg-white rounded-lg px-4 py-2 shadow-md mb-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Depot */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Depot:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={depotSelectValue}
                            options={depotSelectOptions}
                            // isDisabled={isEditMode}
                            onChange={(event) => {
                                const v = event?.value ?? '';
                                const label = event?.label ?? 'Select...';
                                if (v) {
                                    GetApplicableTerritory(v);
                                } else {
                                    setApplTerr([ { ...TERR_SELECT_PLACEHOLDER } ]);
                                }
                                setCustomerDetails((pre: any) => ({
                                    ...pre,
                                    depot_code: v,
                                    depot_name: label,
                                    dlr_terr_code: '',
                                }));
                            }}
                        />
                    </div>

                    {/* Territory */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Territory:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={terrSelectValue}
                            options={terrSelectOptions}
                            // isDisabled={isEditMode}
                            onChange={(event) => {
                                setCustomerDetails((pre: any) => ({ ...pre, dlr_terr_code: event?.value ?? '' }))
                            }}
                        />
                    </div>

                    {/* Acct. No. */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Acct. No.:</label>
                        {/* <input type="text" placeholder="Acct. No." className="w-full border rounded form-input text-sm" name="acctNo" value={pcaParam.acctNo} onChange={handleChange} autoComplete="off" /> */}
                        <input type="text" placeholder="Acct. No." autoComplete="off" className="w-full border rounded form-input text-sm" name="acctNo" value={customerDetails.acctNo} onChange={(e) => setCustomerDetails((pre: any) => ({ ...pre, acctNo: e.target.value }))} />
                    </div>

                    {/* Customer Name */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Customer Name:</label>
                        {/* <input type="text" placeholder="Customer Name" className="w-full border rounded form-input text-sm" name="customerName" value={pcaParam.customerName} onChange={handleChange} autoComplete="off" /> */}
                        <input type="text" autoComplete="off" placeholder="Customer Name" className="w-full border rounded form-input text-sm" name="customerName" value={customerDetails.customerName} onChange={(e) => setCustomerDetails((pre: any) => ({ ...pre, customerName: e.target.value }))} />
                    </div>

                    {/* Bill To */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Bill To:</label>
                        {/* <input type="text" placeholder="Bill To" className="w-full border rounded form-input text-sm" name="billTo" value={pcaParam.billTo} onChange={handleChange} autoComplete="off" /> */}
                        <input type="text" autoComplete="off" placeholder="Bill To" className="w-full border rounded form-input text-sm" name="billTo" value={customerDetails.billTo} onChange={(e) => setCustomerDetails((pre: any) => ({ ...pre, billTo: e.target.value }))} />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Status:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={mainStatusSelectValue}
                            options={mainStatusOptions}
                            onChange={(event) => {
                                setCustomerDetails((pre: any) => ({
                                    ...pre,
                                    main_status: event?.value ?? '',
                                    aprv_status: '',
                                }));
                            }}
                        />
                    </div>

                    {/* Sub Status */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Sub Status:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={subStatusSelectValue}
                            options={subStatusSelectOptions}
                            onChange={(event) => {
                                setCustomerDetails((pre: any) => ({ ...pre, aprv_status: event?.value ?? '' }));
                            }}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-end space-x-2">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 space-x-2 rounded hover:bg-blue-600 text-xs flex items-center"
                            onClick={(e) => {
                                e.preventDefault();
                                GetePCAListData();
                            }}>
                            <CiSearch /> <span>Search</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* <div className="panel mb-2">
                <form className=" border-1 space-y-5">
                    <div className="grid grid-cols-4 grid-rows-1 gap-2">
                        <div className="col-span-4 sm:col-span-2 md:col-span-1">
                            <label className="formLabel">Depot:</label>
                            <Select
                                isSearchable={true}
                                value={{ value: customerDetails?.depot_code, label: customerDetails?.depot_name }}
                                options={depot.map((d: any) => ({ value: d.depot_code, label: d.depot_name }))}
                                // isDisabled={isEditMode}
                                onChange={(event) => {
                                    GetApplicableTerritory(event?.value);
                                    setCustomerDetails((pre: any) => ({ ...pre, depot_code: event?.value, depot_name: event?.label }))
                                }}
                            />
                        </div>

                        <div className="col-span-4 sm:col-span-2 md:col-span-1">
                            <label className="formLabel">Territory:</label>
                            <Select
                                isSearchable={true}
                                value={{ value: applTerr?.find((a: any) => a.terr_code === customerDetails?.dlr_terr_code)?.terr_code, label: applTerr.find((a: any) => a.terr_code === customerDetails?.dlr_terr_code)?.terr_name }}
                                options={applTerr.map((d: any) => ({ value: d.terr_code, label: d.terr_name }))}
                                // isDisabled={isEditMode}
                                onChange={(event) => {
                                    setCustomerDetails((pre: any) => ({ ...pre, dlr_terr_code: event?.value }))
                                }}
                            />
                        </div>

                        <div className="col-span-4 sm:col-span-2 md:col-span-1">
                            <label className="formLabel">Acct. No.:</label>
                            <input type="text" placeholder="Acct. No." autoComplete="off" className="form-input" name="acctNo" value={customerDetails.acctNo} onChange={(e) => setCustomerDetails((pre: any) => ({ ...pre, acctNo: e.target.value }))} />
                        </div>

                        <div className="col-span-4 sm:col-span-2 md:col-span-1">
                            <label className="formLabel">Customer Name:</label>
                            <input type="text" autoComplete="off" placeholder="Customer Name" className="form-input" name="customerName" value={customerDetails.customerName} onChange={(e) => setCustomerDetails((pre: any) => ({ ...pre, customerName: e.target.value }))} />
                        </div>

                        <div className="col-span-4 sm:col-span-2 md:col-span-1">
                            <label className="formLabel">Bill To:</label>
                            <input type="text" autoComplete="off" placeholder="Bill To" className="form-input" name="billTo" value={customerDetails.billTo} onChange={(e) => setCustomerDetails((pre: any) => ({ ...pre, billTo: e.target.value }))} />
                        </div>

                        <div className="col-span-4 sm:col-span-2 md:col-span-1">
                            <label className="formLabel">Status:</label>
                            <Select
                                isSearchable={true}
                                value={mainStatusOptions.find((m) => m.value === customerDetails?.main_status)}
                                options={mainStatusOptions}
                                onChange={(event) => {
                                    setCustomerDetails((pre: any) => ({ ...pre, main_status: event?.value, aprv_status: '' }))
                                }}
                            // styles={customStylesForStatusSelect}
                            />
                        </div>

                        <div className="col-span-4 sm:col-span-2 md:col-span-1">
                            <label className="formLabel">Sub Status:</label>
                            <Select
                                isSearchable={true}
                                value={{ value: approveStatus?.find((a: any) => a.lov_code === customerDetails?.aprv_status)?.lov_code, label: approveStatus?.find((a: any) => a.lov_code === customerDetails?.aprv_status)?.lov_value }}
                                options={customerDetails?.main_status ? approveStatus.filter((item: any) => item.lov_field1_value === customerDetails?.main_status).map((d: any) => ({ value: d.lov_code, label: d.lov_value })) : approveStatus.filter((item: any) => item.lov_field1_value === 'PENDING').map((d: any) => ({ value: d.lov_code, label: d.lov_value }))}
                                onChange={(event) => {
                                    setCustomerDetails((pre: any) => ({ ...pre, aprv_status: event?.value }))
                                }}
                            />
                        </div>

                        <div className="col-span-4 sm:col-span-2 md:col-span-1">
                            <div className="flex space-x-2 sm-justify-center">
                                <Button className="btn btn-info mt-4 w-24 rounded-full" variant="filled"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        GetePCAListData();
                                    }}> <CiSearch />
                                    <span className="whiteTx"> Search</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div> */}
            {/* <div className="mb-2"> */}

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
    )
}

export default EPCADepotApprovalList