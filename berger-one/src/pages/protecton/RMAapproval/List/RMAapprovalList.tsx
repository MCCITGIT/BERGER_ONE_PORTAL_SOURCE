import { UseAuthStore } from '../../../../services/store/AuthStore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import * as RMA from '../../../../services/api/protectonRMA/RMAList';
import * as Epca from '../../../../services/api/protectonEpca/EpcaList';
import { CommonLovDetails, GetRegion } from '../../../../services/api/users/UserProfile';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { useNavigate } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import { FiEye } from 'react-icons/fi';

// ─── Types ───────────────────────────────────────────────────────────────────

type RMAFilter = {
    year: string;
    month: string;
    region_code: string;
    depot_code: string;
    depot_name: string;
    status: string;
    return_type: string;
    dealer: string;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const RETURN_KEY = 'rmaApprovalListReturnFromDetails';
let rmaListFiltersCache: RMAFilter | null = null;

const DEPOT_PLACEHOLDER = { depot_code: '', depot_name: 'Select...' };
const REGION_PLACEHOLDER = { depot_regn: '', regn_new: 'Select...' };

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => {
    const y = String(currentYear - i);
    return { value: y, label: y };
});

const MONTH_OPTIONS = [
    { value: '', label: 'Select...' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

const LOV_PLACEHOLDER = { value: '', label: 'Select...' };

const defaultFilters = (): RMAFilter => ({
    year: String(currentYear),
    month: String(new Date().getMonth() + 1).padStart(2, '0'),
    region_code: '',
    depot_code: '',
    depot_name: '',
    status: '',
    return_type: '',
    dealer: '',
});

// ─── Component ───────────────────────────────────────────────────────────────

const RMAapprovalList = () => {
    const user = UseAuthStore((state: any) => state.userDetails);
    const navigate = useNavigate();

    const [data, setData] = useState<any[]>([]);
    const [filters, setFilters] = useState<RMAFilter>(defaultFilters());
    const [loading, setLoading] = useState(false);
    const [regions, setRegions] = useState<any[]>([{ ...REGION_PLACEHOLDER }]);
    const [depots, setDepots] = useState<any[]>([{ ...DEPOT_PLACEHOLDER }]);
    const [statusOptions, setStatusOptions] = useState<{ value: string; label: string }[]>([LOV_PLACEHOLDER]);
    const [returnTypeOptions, setReturnTypeOptions] = useState<{ value: string; label: string }[]>([LOV_PLACEHOLDER]);

    // ── Helpers ──────────────────────────────────────────────────────────────

    const saveFilters = (f: RMAFilter) => {
        rmaListFiltersCache = { ...f };
    };

    const setFilter = (patch: Partial<RMAFilter>) =>
        setFilters((prev) => ({ ...prev, ...patch }));

    // ── API calls ────────────────────────────────────────────────────────────

    const loadRegions = async (): Promise<any[]> => {
        try {
            const res: any = await GetRegion({ user_group: user.group_code, app_id: '15' });
            const list = [{ ...REGION_PLACEHOLDER }, ...(res.data.table || [])];
            setRegions(list);
            return list;
        } catch {
            setRegions([{ ...REGION_PLACEHOLDER }]);
            return [];
        }
    };

    const loadDepots = async (regionCode = '') => {
        setLoading(true);
        try {
            const res: any = await Epca.GetApplicableDepotList({
                user_id: user.user_id,
                region: regionCode,
                app_id: '15',
            });
            setDepots([{ ...DEPOT_PLACEHOLDER }, ...(res.data || [])]);
        } catch {
            setDepots([{ ...DEPOT_PLACEHOLDER }]);
        } finally {
            setLoading(false);
        }
    };

    const loadStatusOptions = async () => {
        try {
            const res: any = await CommonLovDetails({ lov_type: 'INVOICE_RETURN_SUB_STATUS_TYPE', active: 'Y' });
            setStatusOptions([LOV_PLACEHOLDER, ...(res.data.table || []).map((d: any) => ({ value: d.lov_code, label: d.lov_value }))]);
        } catch {
            setStatusOptions([LOV_PLACEHOLDER]);
        }
    };

    const loadReturnTypeOptions = async () => {
        try {
            const res: any = await CommonLovDetails({ lov_type: 'INVOICE_RETURN_TYPE', active: 'Y' });
            setReturnTypeOptions([LOV_PLACEHOLDER, ...(res.data.table || []).map((d: any) => ({ value: d.lov_code, label: d.lov_value }))]);
        } catch {
            setReturnTypeOptions([LOV_PLACEHOLDER]);
        }
    };

    const fetchList = async (overrideFilters?: RMAFilter) => {
        const f = overrideFilters ?? filters;
        setLoading(true);
        try {
            const res: any = await RMA.GetApprovalPendingReturnInvoiceList({
                year: f.year,
                month: f.month,
                region: f.region_code,
                depot: f.depot_code,
                status: f.status,
                returnType: f.return_type,
                searchText: f.dealer,
            });
            setData(res?.data?.table ?? res?.data ?? []);
            saveFilters(f);
        } catch {
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    // ── Restore on back-navigation ────────────────────────────────────────────

    const tryRestore = async (regionList: any[]): Promise<boolean> => {
        const f = rmaListFiltersCache;
        if (!f) return false;
        if (f.region_code) {
            const exists = regionList.some((r: any) => r.depot_regn === f.region_code);
            if (!exists) return false;
            await loadDepots(f.region_code);
        }
        setFilters(f);
        await fetchList(f);
        return true;
    };

    const initialLoad = async (regionList: any[]) => {
        const returnFromDetails = sessionStorage.getItem(RETURN_KEY) === '1';
        sessionStorage.removeItem(RETURN_KEY);

        if (!returnFromDetails) {
            rmaListFiltersCache = null;
            await fetchList();
            return;
        }
        const restored = await tryRestore(regionList);
        if (!restored) await fetchList();
    };

    // ── Navigation ────────────────────────────────────────────────────────────

    const openRow = useCallback(
        (row: any) => {
            saveFilters(filters);
            sessionStorage.setItem('rmaApprovalDtl', JSON.stringify(row));
            sessionStorage.setItem(RETURN_KEY, '1');
            navigate('/Protecton/RMA/RMAApprovalDetails/');
        },
        [filters, navigate]
    );

    // ── Columns ───────────────────────────────────────────────────────────────

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'region',
                header: 'Region',
                size: 90,
            },
            {
                accessorKey: 'depot',
                header: 'Depot',
                size: 130,
            },
            {
                accessorKey: 'dlr_name',
                header: 'Dealer',
                size: 160,
            },
            {
                accessorKey: 'dlr_code',
                header: 'Dealer Code',
                size: 90,
            },
            {
                accessorKey: 'invoice_num',
                header: 'Invoice No',
                size: 100,
            },
            {
                accessorKey: 'invoice_date',
                header: 'Invoice Date',
                size: 100,
            },
            {
                accessorKey: 'return_type1',
                header: 'Return Type',
                size: 110,
            },
            {
                accessorKey: 'approval_status',
                header: 'Status',
                size: 90,
            },
            {
                id: 'action',
                header: 'Action',
                size: 80,
                enableSorting: false,
                Cell: ({ cell }) => (
                    <div className="flex justify-center">
                        <FiEye
                            className="text-blue-600 cursor-pointer hover:text-blue-800"
                            size={17}
                            onClick={() => openRow(cell.row.original)}
                        />
                    </div>
                ),
            },
        ],
        [openRow]
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
            style: { overflow: 'auto', maxHeight: '16rem' },
        },
    });

    // ── Select options/values ─────────────────────────────────────────────────

    const regionSelectOptions = useMemo(
        () => regions.map((r: any) => ({ value: r.depot_regn, label: r.regn_new })),
        [regions]
    );
    const regionSelectValue =
        regionSelectOptions.find((o) => o.value === filters.region_code) ??
        regionSelectOptions[0] ?? { value: '', label: 'Select...' };

    const depotSelectOptions = useMemo(
        () => depots.map((d: any) => ({ value: d.depot_code, label: d.depot_name })),
        [depots]
    );
    const depotSelectValue =
        depotSelectOptions.find((o) => o.value === filters.depot_code) ??
        depotSelectOptions[0] ?? { value: '', label: 'Select...' };

    const yearSelectValue =
        YEAR_OPTIONS.find((o) => o.value === filters.year) ?? YEAR_OPTIONS[0];

    const monthSelectValue =
        MONTH_OPTIONS.find((o) => o.value === filters.month) ?? MONTH_OPTIONS[0];

    const statusSelectValue =
        statusOptions.find((o) => o.value === filters.status) ?? statusOptions[0] ?? LOV_PLACEHOLDER;

    const returnTypeSelectValue =
        returnTypeOptions.find((o) => o.value === filters.return_type) ?? returnTypeOptions[0] ?? LOV_PLACEHOLDER;

    // ── Mount ─────────────────────────────────────────────────────────────────

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const [regionList] = await Promise.all([loadRegions(), loadDepots(), loadStatusOptions(), loadReturnTypeOptions()]);
            if (cancelled) return;
            await initialLoad(regionList);
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <>
            {/* Page title */}
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
                <h5 className="text-lg font-semibold dark:text-white-light">RMA Approval List</h5>
            </div>

            {/* Filter panel */}
            <div className="bg-white rounded-lg px-4 py-2 shadow-md mb-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">

                    {/* Year */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Year:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={yearSelectValue}
                            options={YEAR_OPTIONS}
                            onChange={(e) => setFilter({ year: e?.value ?? '' })}
                        />
                    </div>

                    {/* Month */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Month:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={monthSelectValue}
                            options={MONTH_OPTIONS}
                            onChange={(e) => setFilter({ month: e?.value ?? '' })}
                        />
                    </div>

                    {/* Region */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Region:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={regionSelectValue}
                            options={regionSelectOptions}
                            onChange={(e) => {
                                const v = e?.value ?? '';
                                setFilter({ region_code: v, depot_code: '', depot_name: '' });
                                loadDepots(v);
                            }}
                        />
                    </div>

                    {/* Depot */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Depot:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={depotSelectValue}
                            options={depotSelectOptions}
                            onChange={(e) =>
                                setFilter({ depot_code: e?.value ?? '', depot_name: e?.label ?? '' })
                            }
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Status:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={statusSelectValue}
                            options={statusOptions}
                            onChange={(e) => setFilter({ status: e?.value ?? '' })}
                        />
                    </div>

                    {/* Return Type */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Return Type:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={returnTypeSelectValue}
                            options={returnTypeOptions}
                            onChange={(e) => setFilter({ return_type: e?.value ?? '' })}
                        />
                    </div>

                    {/* Dealer */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Dealer:</label>
                        <input
                            type="text"
                            autoComplete="off"
                            placeholder="Enter dealer name"
                            className="w-full border rounded form-input text-sm"
                            value={filters.dealer}
                            onChange={(e) => setFilter({ dealer: e.target.value })}
                        />
                    </div>

                    {/* Search button */}
                    <div className="flex items-end space-x-2">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 space-x-2 rounded hover:bg-blue-600 text-xs flex items-center"
                            onClick={(e) => {
                                e.preventDefault();
                                fetchList();
                            }}
                        >
                            <CiSearch />
                            <span>Search</span>
                        </button>
                    </div>

                </div>
            </div>

            {/* Grid */}
            <div className="mb-2 p-pl-table-item">
                <MantineReactTable table={table} />
            </div>

            {/* Loading overlay */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
                    <div role="status" className="animate-spin">
                        <svg
                            aria-hidden="true"
                            className="h-8 w-8 fill-blue-600 text-gray-200"
                            viewBox="0 0 100 101"
                            fill="none"
                        >
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

export default RMAapprovalList;


// /RMA/RMAApprovalList
