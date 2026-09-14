import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { CiSearch } from 'react-icons/ci';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { UseAuthStore } from '../../services/store/AuthStore';
import * as Epca from '../../services/api/protectonEpca/EpcaList';
import { GetDcBusinessChannel, GetDcHoSalesList, GetDcLovDetails, GetDcSubFunction, DcApprovalUpdate, GetDealerCreationDetails } from '../../services/api/DealerCreation/DealerCreation';
import { commonErrorToast, commonSuccessToast } from '../../services/functions/commonToast';

type DealerCreationHoSalesRow = {
    id: number;
    depot: string;
    dealerName: string;
    businessLine: string;
    customerType: string;
    cancelationReason: string;
    status: string;
    pendingAt: string;
    depotCode: string;
    businessChannel: string;
    subFunction: string;
    statusCode: string;
};

type FilterState = {
    depot_code: string;
    business_channel: string;
    sub_function: string;
    status: string;
    dealer_name: string;
};

const SELECT_PLACEHOLDER = { value: '', label: 'Select' };

const defaultFilters = (): FilterState => ({
    depot_code: '',
    business_channel: '',
    sub_function: '',
    status: 'HOSAP',
    dealer_name: '',
});

const mapHoSalesRow = (row: any): DealerCreationHoSalesRow => ({
    id: Number(row.dc_request_id || row.dcm_id || 0),
    depot: row.depot_name || '',
    dealerName: row.dealer_name || '',
    businessLine: row.dcm_business_channel || '',
    customerType: row.dc_cus_type_name || '',
    cancelationReason: row.dcm_reject_reason || '',
    status: row.approval_status || '',
    pendingAt: row.approval_pending_users || '',
    depotCode: row.depot_code || '',
    businessChannel: row.dcm_business_channel || '',
    subFunction: row.dcm_sub_function || '',
    statusCode: row.dcm_status_code || '',
});

const DealerCreationList = () => {
    const user = UseAuthStore((state: any) => state.userDetails);
    const navigate = useNavigate();

    const [filters, setFilters] = useState<FilterState>(defaultFilters());
    const [loading, setLoading] = useState(false);
    const [depotList, setDepotList] = useState<any[]>([]);
    const [businessChannelList, setBusinessChannelList] = useState<any[]>([]);
    const [subFunctionList, setSubFunctionList] = useState<any[]>([]);
    const [statusList, setStatusList] = useState<any[]>([]);
    const [listData, setListData] = useState<DealerCreationHoSalesRow[]>([]);

    const GetApplicableDepot = async () => {
        const payload: any = {
            user_id: user.user_id,
            region: '',
            app_id: '15',
        };
        try {
            const response: any = await Epca.GetApplicableDepotList(payload);
            setDepotList(response.data || []);
        } catch {
            setDepotList([]);
        }
    };

    const GetBusinessChannel = async () => {
        try {
            const response: any = await GetDcBusinessChannel({});
            setBusinessChannelList(response.data?.table || []);
        } catch {
            setBusinessChannelList([]);
        }
    };

    const GetSubFunction = async (deptName: string) => {
        try {
            const response: any = await GetDcSubFunction({ dept_name: deptName });
            setSubFunctionList(response.data?.table || []);
        } catch {
            setSubFunctionList([]);
        }
    };

    const GetStatus = async () => {
        try {
            const response: any = await GetDcLovDetails({ lovType: 'APPROVAL_STATUS_HO_TYPE' });
            setStatusList(response.data?.table || []);
        } catch {
            setStatusList([]);
        }
    };

    const GetList = async (f?: FilterState) => {
        const current = f ?? filters;
        setLoading(true);
        try {
            const response: any = await GetDcHoSalesList({
                depot: current.depot_code,
                business_channel: current.business_channel,
                sub_function: current.sub_function,
                dealer: current.dealer_name,
                status: current.status,
            });
            const rows = response.data?.table || [];
            setListData(rows.map(mapHoSalesRow));
        } catch {
            setListData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        GetList(filters);
    };

    const handleCancelationReasonChange = useCallback((rowId: number, value: string) => {
        setListData((prev) =>
            prev.map((row) => (row.id === rowId ? { ...row, cancelationReason: value } : row))
        );
    }, []);

    const openDetails = useCallback((row: DealerCreationHoSalesRow) => {
        sessionStorage.setItem('dealerCreationDtl', JSON.stringify({ ...row, ishosales: 'Y' }));
        navigate('/DealerCreation/dealerCreationDetails');
    }, [navigate]);

    const handleListApprove = async (row: DealerCreationHoSalesRow) => {
        setLoading(true);
        try {
            const detailsRes: any = await GetDealerCreationDetails({ dcId: row.id });
            const paymentTerms = detailsRes?.data?.table?.[0]?.dcm_payment_terms_type;
            if (!paymentTerms) {
                commonErrorToast('Please update payment terms.');
                return;
            }
            const response: any = await DcApprovalUpdate({
                dcmId: row.id,
                approve_yn: 'Y',
                cancel_reason: '',
            });
            if (response?.success) {
                commonSuccessToast(response.message || 'Request approved successfully.');
                GetList();
            } else {
                commonErrorToast(response?.message || 'Error approving request.');
            }
        } catch {
            commonErrorToast('Error approving request.');
        } finally {
            setLoading(false);
        }
    };

    const handleListReject = async (row: DealerCreationHoSalesRow) => {
        if (!row.cancelationReason?.trim()) {
            commonErrorToast('Please enter reject reason.');
            return;
        }
        setLoading(true);
        try {
            const response: any = await DcApprovalUpdate({
                dcmId: row.id,
                approve_yn: 'R',
                cancel_reason: row.cancelationReason.trim(),
            });
            if (response?.success) {
                commonSuccessToast(response.message || 'Request rejected successfully.');
                GetList();
            } else {
                commonErrorToast(response?.message || 'Error rejecting request.');
            }
        } catch {
            commonErrorToast('Error rejecting request.');
        } finally {
            setLoading(false);
        }
    };

    const filteredData = listData;

    const depotSelectOptions = useMemo(
        () => [
            SELECT_PLACEHOLDER,
            ...depotList.map((d: any) => ({
                value: d.depot_code,
                label: d.depot_name ? `${d.depot_code}:${d.depot_name}` : d.depot_code,
            })),
        ],
        [depotList]
    );

    const businessChannelOptions = useMemo(
        () => [
            SELECT_PLACEHOLDER,
            ...businessChannelList.map((d: any) => ({
                value: d.ddm_dept_name,
                label: d.ddm_dept_name,
            })),
        ],
        [businessChannelList]
    );

    const subFunctionOptions = useMemo(
        () => [
            SELECT_PLACEHOLDER,
            ...subFunctionList.map((d: any) => ({
                value: d.ddm_sub_dept_name,
                label: d.ddm_sub_dept_name,
            })),
        ],
        [subFunctionList]
    );

    const statusOptions = useMemo(
        () => [
            SELECT_PLACEHOLDER,
            ...statusList.map((d: any) => ({
                value: d.lov_code,
                label: d.lov_value,
            })),
        ],
        [statusList]
    );

    const columns = useMemo<MRT_ColumnDef<DealerCreationHoSalesRow>[]>(
        () => [
            {
                id: 'rowIndex',
                header: '#',
                size: 40,
                Cell: ({ row }) => row.index + 1,
            },
            {
                accessorKey: 'depot',
                header: 'Depot',
                size: 120,
            },
            {
                accessorKey: 'dealerName',
                header: 'Dealer Name',
                size: 180,
                Cell: ({ cell }) => (
                    <span
                        className="cursor-pointer bg-cyan-100 px-1 text-blue-700"
                        onClick={() => openDetails(cell.row.original)}
                    >
                        {cell.getValue<string>()}
                    </span>
                ),
            },
            {
                accessorKey: 'businessLine',
                header: 'Business Line',
                size: 100,
            },
            {
                accessorKey: 'customerType',
                header: 'Customer Type',
                size: 180,
            },
            {
                accessorKey: 'cancelationReason',
                header: 'Cancelation Reason',
                size: 260,
                Cell: ({ cell, row }) => (
                    <textarea
                        className="form-input w-full border rounded text-xs min-h-[56px]"
                        value={cell.getValue<string>() || ''}
                        disabled={row.original.statusCode !== 'HOSAP'}
                        onChange={(e) => handleCancelationReasonChange(row.original.id, e.target.value)}
                    />
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 180,
            },
            {
                accessorKey: 'pendingAt',
                header: 'Pending At',
                size: 220,
            },
            {
                id: 'action',
                header: 'Action',
                size: 140,
                Cell: ({ row }) => {
                    if (row.original.statusCode !== 'HOSAP') return null;
                    return (
                        <div className="flex flex-col gap-1">
                            <button
                                type="button"
                                className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                                onClick={() => handleListApprove(row.original)}
                            >
                                Approve
                            </button>
                            <button
                                type="button"
                                className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                                onClick={() => handleListReject(row.original)}
                            >
                                Reject
                            </button>
                        </div>
                    );
                },
            },
        ],
        [handleCancelationReasonChange, openDetails, handleListApprove, handleListReject]
    );

    const table = useMantineReactTable({
        columns,
        data: filteredData,
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
        },
    });

    useEffect(() => {
        GetApplicableDepot();
        GetBusinessChannel();
        GetStatus();
        GetList(defaultFilters());
    }, []);

    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
                <h5 className="text-lg font-semibold dark:text-white-light">Dealer Creation HO Sales List</h5>
            </div>

            <div className="bg-white rounded-lg px-4 py-2 shadow-md mb-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Depot:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            placeholder="Select"
                            options={depotSelectOptions}
                            value={
                                depotSelectOptions.find((o) => o.value === filters.depot_code) ??
                                SELECT_PLACEHOLDER
                            }
                            onChange={(event: any) => {
                                setFilters((pre) => ({ ...pre, depot_code: event?.value ?? '' }));
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Business Channel:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            placeholder="Select"
                            options={businessChannelOptions}
                            value={
                                businessChannelOptions.find((o) => o.value === filters.business_channel) ??
                                SELECT_PLACEHOLDER
                            }
                            onChange={(event: any) => {
                                const channel = event?.value ?? '';
                                setFilters((pre) => ({ ...pre, business_channel: channel, sub_function: '' }));
                                GetSubFunction(channel);
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Sub Function:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            placeholder="Select"
                            options={subFunctionOptions}
                            value={
                                subFunctionOptions.find((o) => o.value === filters.sub_function) ??
                                SELECT_PLACEHOLDER
                            }
                            onChange={(event: any) => {
                                setFilters((pre) => ({ ...pre, sub_function: event?.value ?? '' }));
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Status:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            placeholder="Select"
                            options={statusOptions}
                            value={statusOptions.find((o) => o.value === filters.status) ?? SELECT_PLACEHOLDER}
                            onChange={(event: any) => {
                                setFilters((pre) => ({ ...pre, status: event?.value ?? '' }));
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Dealer Name:</label>
                        <input
                            type="text"
                            autoComplete="off"
                            className="w-full border rounded form-input text-sm"
                            name="dealer_name"
                            value={filters.dealer_name}
                            onChange={(e) => setFilters((pre) => ({ ...pre, dealer_name: e.target.value }))}
                        />
                    </div>
                    <div className="flex items-end space-x-2">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 space-x-2 rounded hover:bg-blue-600 text-xs flex items-center"
                            onClick={(e) => {
                                e.preventDefault();
                                handleSearch();
                            }}
                        >
                            <CiSearch /> <span>Search</span>
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

export default DealerCreationList;
