import { UseAuthStore } from '../../../../services/store/AuthStore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import * as RMA from '../../../../services/api/protectonRMA/RMAList';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { useNavigate } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';

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
const REGION_PLACEHOLDER = { region_code: '', region_name: 'Select...' };

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

const STATUS_OPTIONS = [
    { value: '', label: 'Select...' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
];

const RETURN_TYPE_OPTIONS = [
    { value: '', label: 'Select...' },
    { value: 'DAMAGE', label: 'Damage' },
    { value: 'EXPIRY', label: 'Expiry' },
    { value: 'OTHER', label: 'Other' },
];

const defaultFilters = (): RMAFilter => ({
    year: String(currentYear),
    month: String(new Date().getMonth() + 1).padStart(2, '0'),
    region_code: '',
    depot_code: '',
    depot_name: '',
    status: 'PENDING',
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

    // ── Helpers ──────────────────────────────────────────────────────────────

    const saveFilters = (f: RMAFilter) => {
        rmaListFiltersCache = { ...f };
    };

    const setFilter = (patch: Partial<RMAFilter>) =>
        setFilters((prev) => ({ ...prev, ...patch }));

    // ── API calls ────────────────────────────────────────────────────────────

    const loadRegions = async (): Promise<any[]> => {
        try {
            const res: any = await RMA.GetRMAApplicableRegionList({ user_id: user.user_id, app_id: '15' });
            const list = [{ ...REGION_PLACEHOLDER }, ...(res.data || [])];
            setRegions(list);
            return list;
        } catch {
            setRegions([{ ...REGION_PLACEHOLDER }]);
            return [];
        }
    };

    const loadDepots = async (regionCode: string) => {
        if (!regionCode) {
            setDepots([{ ...DEPOT_PLACEHOLDER }]);
            return;
        }
        setLoading(true);
        try {
            const res: any = await RMA.GetRMAApplicableDepotList({
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

    const fetchList = async (overrideFilters?: RMAFilter) => {
        const f = overrideFilters ?? filters;
        setLoading(true);
        try {
            const res: any = await RMA.GetRMAApprovalList({
                year: f.year,
                month: f.month,
                regionCode: f.region_code,
                depotCode: f.depot_code,
                status: f.status,
                returnType: f.return_type,
                dealer: f.dealer,
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
            const exists = regionList.some((r: any) => r.region_code === f.region_code);
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
                size: 80,
            },
            {
                accessorKey: 'depot_name',
                header: 'Depot',
                size: 120,
            },
            {
                accessorKey: 'dealer_name',
                header: 'Dealer',
                size: 160,
                Cell: ({ cell }) => (
                    <span
                        className="text-blue-600 cursor-pointer"
                        onClick={() => openRow(cell.row.original)}
                    >
                        {cell.row.original.dealer_name}
                    </span>
                ),
            },
            {
                accessorKey: 'invoice_no',
                header: 'Invoice No',
                size: 100,
            },
            {
                accessorKey: 'invoice_date',
                header: 'Invoice Date',
                size: 100,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 80,
            },
            {
                id: 'action',
                header: 'Action',
                size: 80,
                enableSorting: false,
                Cell: ({ cell }) => (
                    <div className="flex justify-center">
                        <button
                            className="bg-gradient-to-b from-green-500 to-green-700 text-white text-xs px-4 py-1 rounded-full hover:opacity-90"
                            onClick={() => openRow(cell.row.original)}
                        >
                            View
                        </button>
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
        () => regions.map((r: any) => ({ value: r.region_code, label: r.region_name })),
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
        STATUS_OPTIONS.find((o) => o.value === filters.status) ?? STATUS_OPTIONS[0];

    const returnTypeSelectValue =
        RETURN_TYPE_OPTIONS.find((o) => o.value === filters.return_type) ?? RETURN_TYPE_OPTIONS[0];

    // ── Mount ─────────────────────────────────────────────────────────────────

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const regionList = await loadRegions();
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
                            options={STATUS_OPTIONS}
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
                            options={RETURN_TYPE_OPTIONS}
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
