import { useCallback, useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import AnimateHeight from 'react-animate-height';
import { FiPaperclip } from 'react-icons/fi';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import Swal from 'sweetalert2';
import { GetODOSApprovalDealers, GetODOSApprovalMasters, SaveODOSLegalAction } from '../../services/api/protectonEpca/Legal/Legal';
import { commonErrorToast, commonSuccessToast } from '../../services/functions/commonToast';

type SelectOption = { value: string; label: string };

type FilterState = {
    region: string;
    depot: string;
    sbl: string;
    month: string;
    year: string;
    dealerSearch: string;
    status_code: string;
    notice_yn: string;
    notice_yn_ho: string;
    from_value: string;
    to_value: string;
};

type LegalDealerRow = {
    legal_id?: number;
    region: string;
    depot_name: string;
    depot_code?: string;
    terr_name: string;
    dlr_dealer_code: string;
    dlr_dealer_name: string;
    dlr_mobile?: string;
    depot_manager_name?: string;
    depot_manager_mobile?: string;
    os_amt: number;
    odos_amount?: number;
    current_odos: number;
    os_amt_updt?: number;
    tsi_visit_count?: number;
    tsi_visit_status?: string;
    NoofVisit?: number;
    current_status?: string;
    current_status_code?: string;
    legal_status?: string;
    notice_yn_ho?: string;
    notice_yn_ho_val?: string;
    legal_byno?: string | number;
    notice_desc?: string;
    notice_desc_ho?: string;
};

const SELECT_PLACEHOLDER: SelectOption = { value: '', label: 'Select' };

const SELECT_MENU_PROPS = {
    menuPortalTarget: typeof document !== 'undefined' ? document.body : undefined,
    menuPosition: 'fixed' as const,
    styles: {
        menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
        menu: (base: any) => ({ ...base, zIndex: 9999 }),
    },
};

const defaultFilters = (): FilterState => ({
    region: '',
    depot: '',
    sbl: 'ALL',
    month: '',
    year: '',
    dealerSearch: '',
    status_code: 'ALL',
    notice_yn: '',
    notice_yn_ho: '',
    from_value: '',
    to_value: '',
});

const toOptions = (arr?: { code: string; name: string }[]): SelectOption[] =>
    (arr || []).map((item) => ({ value: item.code ?? '', label: item.name ?? item.code ?? '' }));

const optionValue = (options: SelectOption[], value: string): SelectOption =>
    options.find((o) => o.value === value) ?? options[0] ?? SELECT_PLACEHOLDER;

const formatAmount = (value: number | string | null | undefined) => {
    if (value === null || value === undefined || value === '') return 'Rs. 0';
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return `Rs. ${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
};

const DetailCell = ({ title, subtitle }: { title?: string; subtitle?: string }) => (
    <div className="leading-tight py-0.5 break-words">
        <div className="text-[11px] text-gray-800">{title || '-'}</div>
        {subtitle ? <div className="text-[10px] text-gray-500 mt-0.5">{subtitle}</div> : null}
    </div>
);

const extractDealerRows = (response: any): LegalDealerRow[] => {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.dealerList)) return response.data.dealerList;
    if (Array.isArray(response?.dealerList)) return response.dealerList;
    return [];
};

const splitDealerSearch = (search: string) => {
    const value = search.trim();
    if (!value) return { dealer_code: '', dealer_name: '' };
    if (/^\d+$/.test(value)) return { dealer_code: value, dealer_name: '' };
    return { dealer_code: '', dealer_name: value };
};

const LegalCaseApprovalListScreen = () => {
    const [data, setData] = useState<LegalDealerRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [reviewRow, setReviewRow] = useState<LegalDealerRow | null>(null);
    const [reviewHoAction, setReviewHoAction] = useState('');
    const [reviewReason, setReviewReason] = useState('');
    const [filters, setFilters] = useState<FilterState>(defaultFilters);
    const [defaults, setDefaults] = useState({ year: '', month: '' });

    const [regionOptions, setRegionOptions] = useState<SelectOption[]>([SELECT_PLACEHOLDER]);
    const [depotOptions, setDepotOptions] = useState<SelectOption[]>([SELECT_PLACEHOLDER]);
    const [sblOptions, setSblOptions] = useState<SelectOption[]>([{ value: 'ALL', label: 'ALL' }]);
    const [monthOptions, setMonthOptions] = useState<SelectOption[]>([]);
    const [yearOptions, setYearOptions] = useState<SelectOption[]>([]);
    const [statusOptions, setStatusOptions] = useState<SelectOption[]>([{ value: 'ALL', label: 'All Status' }]);
    const [asmActionOptions, setAsmActionOptions] = useState<SelectOption[]>([SELECT_PLACEHOLDER]);
    const [hoActionOptions, setHoActionOptions] = useState<SelectOption[]>([SELECT_PLACEHOLDER]);

    const setFilter = (patch: Partial<FilterState>) => setFilters((prev) => ({ ...prev, ...patch }));

    const applyMasters = (response: any, updateDefaults: boolean) => {
        const nextRegionOptions = toOptions(response?.regions);
        const nextDepotOptions = toOptions(response?.depots);
        const nextSblOptions = toOptions(response?.dealerCategories);
        const nextMonthOptions = toOptions(response?.months);
        const nextYearOptions = toOptions(response?.years);
        const nextStatusOptions = toOptions(response?.legalStatuses);
        const nextAsmOptions = toOptions(response?.depotLegalActions);
        const nextHoOptions = toOptions(response?.hoLegalActions);

        setRegionOptions(nextRegionOptions.length ? nextRegionOptions : [SELECT_PLACEHOLDER]);
        setDepotOptions(nextDepotOptions.length ? nextDepotOptions : [SELECT_PLACEHOLDER]);
        setSblOptions(nextSblOptions.length ? nextSblOptions : [{ value: 'ALL', label: 'ALL' }]);
        setMonthOptions(nextMonthOptions);
        setYearOptions(nextYearOptions);
        setStatusOptions(nextStatusOptions.length ? nextStatusOptions : [{ value: 'ALL', label: 'All Status' }]);
        setAsmActionOptions(nextAsmOptions.length ? nextAsmOptions : [SELECT_PLACEHOLDER]);
        setHoActionOptions(nextHoOptions.length ? nextHoOptions : [SELECT_PLACEHOLDER]);

        if (updateDefaults) {
            setDefaults({
                year: response?.defaultYear || nextYearOptions[0]?.value || '',
                month: response?.defaultMonth || nextMonthOptions[0]?.value || '',
            });
        }
    };

    const GetDealerListData = async (override?: FilterState) => {
        const f = override ?? filters;
        const dealer = splitDealerSearch(f.dealerSearch);
        setLoading(true);
        try {
            const response: any = await GetODOSApprovalDealers({
                year: f.year || '',
                month: f.month || '',
                region: f.region || '',
                depot: f.depot || '',
                dealer_code: dealer.dealer_code,
                dealer_name: dealer.dealer_name,
                sbl: f.sbl || '',
                notice_yn: f.notice_yn || '',
                notice_yn_ho: f.notice_yn_ho || '',
                from_value: f.from_value || '',
                to_value: f.to_value || '',
                status_code: f.status_code || '',
            });
            if (response?.success === false) {
                setData([]);
                if (response?.message) commonErrorToast(response.message);
                return;
            }
            setData(extractDealerRows(response));
        } catch {
            setData([]);
            commonErrorToast('Failed to load Legal Case Approval list');
        } finally {
            setLoading(false);
        }
    };

    const GetMastersData = async (region: string, options?: { applyDefaultFilters?: boolean; search?: boolean }) => {
        setLoading(true);
        try {
            const response: any = await GetODOSApprovalMasters({ region: region || '' });
            if (response?.success === false) {
                if (response?.message) commonErrorToast(response.message);
                return;
            }
            const payload = response?.data ?? response;
            applyMasters(payload, !!options?.applyDefaultFilters);

            if (options?.applyDefaultFilters) {
                const nextFilters: FilterState = {
                    ...defaultFilters(),
                    region: region || '',
                    sbl: payload?.dealerCategories?.[0]?.code || 'ALL',
                    month: payload?.defaultMonth || '',
                    year: payload?.defaultYear || '',
                    status_code: payload?.legalStatuses?.[0]?.code || 'ALL',
                };
                setFilters(nextFilters);
                if (options.search) {
                    await GetDealerListData(nextFilters);
                    return;
                }
            } else {
                setFilter({ depot: '' });
            }
        } catch {
            commonErrorToast('Failed to load filter masters');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: any) => {
        e.preventDefault();
        GetDealerListData();
    };

    const handleReset = () => {
        const resetValues: FilterState = {
            ...defaultFilters(),
            year: defaults.year,
            month: defaults.month,
            sbl: sblOptions[0]?.value || 'ALL',
            status_code: statusOptions[0]?.value || 'ALL',
        };
        setFilters(resetValues);
        GetMastersData('', { applyDefaultFilters: true, search: true });
    };

    const reviewHoOptions = useMemo(
        () => hoActionOptions.filter((o) => o.value === 'Y' || o.value === 'N'),
        [hoActionOptions]
    );

    const openReviewModal = useCallback((row: LegalDealerRow) => {
        const hoAction = row.notice_yn_ho === 'N' ? 'N' : 'Y';
        setReviewRow(row);
        setReviewHoAction(hoAction);
        setReviewReason(hoAction === 'N' ? (row.notice_desc_ho || row.notice_desc || '') : '');
    }, []);

    const closeReviewModal = () => {
        setReviewRow(null);
        setReviewHoAction('');
        setReviewReason('');
    };

    const handleConfirmUpdate = async () => {
        if (!reviewRow) return;
        setLoading(true);
        try {
            const response: any = await SaveODOSLegalAction({
                legalId: Number(reviewRow.legal_id || 0),
                legalByno: Number(String(reviewRow.legal_byno ?? '').trim() || 0),
                noticeYn: reviewHoAction || '',
                noticeDesc: reviewHoAction === 'N' ? reviewReason.trim() : '',
            });
            if (response?.success === false) {
                commonErrorToast(response?.message || 'Failed to update Legal Action (HO)');
                return;
            }
            commonSuccessToast(response?.message || 'Legal Action (HO) updated');
            closeReviewModal();
            await GetDealerListData();
        } catch {
            commonErrorToast('Failed to update Legal Action (HO)');
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSave = async () => {
        if (!reviewRow) return;
        if (reviewHoAction === 'N' && !reviewReason.trim()) {
            commonErrorToast('Please enter a reason');
            return;
        }
        const result = await Swal.fire({
            title: 'Confirm submission',
            text: 'Are you sure you want to approve this case and update the legal action (HO) status?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#22c55e',
            cancelButtonColor: '#ffffff',
            reverseButtons: false,
            buttonsStyling: true,
            customClass: {
                cancelButton: '!text-gray-700 !border !border-gray-300 !shadow-none',
                confirmButton: '!rounded-full',
                popup: 'rounded-2xl',
            },
        });
        if (result.isConfirmed) {
            await handleConfirmUpdate();
        }
    };

    const columns = useMemo<MRT_ColumnDef<LegalDealerRow>[]>(
        () => [
            {
                accessorKey: 'region',
                header: 'Region Name',
                size: 70,
                minSize: 60,
            },
            {
                accessorKey: 'depot_name',
                header: 'Depot Details',
                size: 100,
                minSize: 80,
                Cell: ({ row }) => <DetailCell title={row.original.depot_name} />,
            },
            {
                accessorKey: 'dlr_dealer_name',
                header: 'Dealer Details',
                size: 130,
                minSize: 100,
                Cell: ({ row }) => (
                    <span className="text-[11px] text-gray-800 break-words">{row.original.dlr_dealer_name || '-'}</span>
                ),
            },
            {
                accessorKey: 'terr_name',
                header: 'Territory Details',
                size: 100,
                minSize: 80,
                Cell: ({ row }) => <DetailCell title={row.original.terr_name} />,
            },
            {
                accessorKey: 'depot_manager_name',
                header: 'Depot Manager',
                size: 100,
                minSize: 80,
                Cell: ({ row }) => (
                    <DetailCell
                        title={row.original.depot_manager_name}
                        subtitle={row.original.depot_manager_mobile ? `Mobile - ${row.original.depot_manager_mobile}` : undefined}
                    />
                ),
            },
            {
                accessorKey: 'os_amt',
                header: 'Outstanding Amount',
                size: 85,
                minSize: 70,
                Cell: ({ row }) => (
                    <span className="text-[11px] break-words">{formatAmount(row.original.os_amt)}</span>
                ),
            },
            {
                accessorKey: 'odos_amount',
                header: 'ODOS Amount',
                size: 75,
                minSize: 65,
                Cell: ({ cell }) => <span className="text-[11px] break-words">{formatAmount(cell.getValue<number>())}</span>,
            },
            {
                accessorKey: 'current_odos',
                header: 'Current ODOS',
                size: 75,
                minSize: 65,
                Cell: ({ cell }) => <span className="text-[11px] break-words">{formatAmount(cell.getValue<number>())}</span>,
            },
            {
                id: 'adjustment',
                header: 'Adjustment',
                size: 70,
                minSize: 60,
                Cell: ({ row }) => {
                    const adjustment = Number(row.original.os_amt || 0) - Number(row.original.odos_amount || 0);
                    return <span className="text-[11px] break-words">{formatAmount(adjustment)}</span>;
                },
            },
            {
                accessorKey: 'tsi_visit_count',
                header: 'TSI Visits',
                size: 60,
                minSize: 50,
                Cell: ({ row }) => (
                    <span className="text-[11px]">{row.original.tsi_visit_count ?? 0}</span>
                ),
            },
            {
                accessorKey: 'current_status',
                header: 'Current Status',
                size: 80,
                minSize: 70,
                Cell: ({ row }) => (
                    <span className="text-[11px]">{row.original.current_status || row.original.legal_status || '-'}</span>
                ),
            },
            {
                id: 'action',
                header: 'Action',
                size: 70,
                minSize: 60,
                enableSorting: false,
                Cell: ({ row }) => (
                    <button
                        type="button"
                        className="inline-flex items-center border border-gray-300 rounded px-1.5 py-0.5 text-[11px] text-gray-700 hover:bg-gray-50"
                        onClick={() => openReviewModal(row.original)}
                    >
                        View
                    </button>
                ),
            },
        ],
        [openReviewModal]
    );

    const table = useMantineReactTable({
        columns,
        data,
        layoutMode: 'grid',
        enableColumnResizing: false,
        enableStickyHeader: true,
        enableTopToolbar: false,
        enableSorting: false,
        enableColumnActions: false,
        mantineTableProps: {
            style: {
                width: '100%',
                tableLayout: 'fixed',
                fontSize: '11px',
            },
        },
        mantineTableHeadCellProps: {
            style: {
                fontSize: '11px',
                padding: '4px 6px',
                whiteSpace: 'normal',
                lineHeight: 1.2,
                fontWeight: 600,
            },
        },
        mantineTableBodyCellProps: {
            style: {
                fontSize: '11px',
                padding: '4px 6px',
                whiteSpace: 'normal',
                lineHeight: 1.25,
                wordBreak: 'break-word',
            },
        },
        mantineTableContainerProps: {
            style: {
                overflowX: 'hidden',
                overflowY: 'auto',
                maxHeight: '24rem',
                width: '100%',
            },
        },
    });

    useEffect(() => {
        GetMastersData('', { applyDefaultFilters: true, search: true });
    }, []);

    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
                <h5 className="text-lg font-semibold dark:text-white-light">Legal Case Approval</h5>
            </div>

            <div className={`mb-2 rounded-lg border border-blue-200 bg-white ${filterOpen ? 'overflow-visible' : 'overflow-hidden'}`}>
                <button
                    type="button"
                    className="flex w-full items-center justify-between bg-[#d9e8ff] px-4 py-2 text-sm font-semibold text-gray-700"
                    onClick={() => setFilterOpen((prev) => !prev)}
                >
                    <span>Filter</span>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={filterOpen ? 'rotate-180' : ''}
                    >
                        <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </button>
                <AnimateHeight
                    duration={300}
                    height={filterOpen ? 'auto' : 0}
                    style={filterOpen ? { overflow: 'visible' } : undefined}
                >
                    <div className="space-y-2 px-4 py-3">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Region:</label>
                                <Select
                                    className="text-sm"
                                    isSearchable={true}
                                    {...SELECT_MENU_PROPS}
                                    value={optionValue(regionOptions, filters.region)}
                                    options={regionOptions}
                                    onChange={(event) => {
                                        const region = event?.value ?? '';
                                        setFilter({ region, depot: '' });
                                        GetMastersData(region);
                                    }}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Depot:</label>
                                <Select
                                    className="text-sm"
                                    isSearchable={true}
                                    {...SELECT_MENU_PROPS}
                                    value={optionValue(depotOptions, filters.depot)}
                                    options={depotOptions}
                                    onChange={(event) => setFilter({ depot: event?.value ?? '' })}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Business Line:</label>
                                <Select
                                    className="text-sm"
                                    isSearchable={true}
                                    {...SELECT_MENU_PROPS}
                                    value={optionValue(sblOptions, filters.sbl)}
                                    options={sblOptions}
                                    onChange={(event) => setFilter({ sbl: event?.value ?? '' })}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Month:</label>
                                <Select
                                    className="text-sm"
                                    isSearchable={true}
                                    {...SELECT_MENU_PROPS}
                                    value={optionValue(monthOptions, filters.month)}
                                    options={monthOptions}
                                    onChange={(event) => setFilter({ month: event?.value ?? '' })}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Year:</label>
                                <Select
                                    className="text-sm"
                                    isSearchable={true}
                                    {...SELECT_MENU_PROPS}
                                    value={optionValue(yearOptions, filters.year)}
                                    options={yearOptions}
                                    onChange={(event) => setFilter({ year: event?.value ?? '' })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-xs font-medium text-gray-600">Search Dealer:</label>
                                <input
                                    type="text"
                                    name="dealerSearch"
                                    autoComplete="off"
                                    placeholder="Dealer name or code..."
                                    className="form-input w-full rounded border text-sm"
                                    value={filters.dealerSearch}
                                    onChange={(e) => setFilter({ dealerSearch: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Status:</label>
                                <Select
                                    className="text-sm"
                                    isSearchable={true}
                                    {...SELECT_MENU_PROPS}
                                    value={optionValue(statusOptions, filters.status_code)}
                                    options={statusOptions}
                                    onChange={(event) => setFilter({ status_code: event?.value ?? '' })}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Legal Action (ASM):</label>
                                <Select
                                    className="text-sm"
                                    isSearchable={true}
                                    {...SELECT_MENU_PROPS}
                                    value={optionValue(asmActionOptions, filters.notice_yn)}
                                    options={asmActionOptions}
                                    onChange={(event) => setFilter({ notice_yn: event?.value ?? '' })}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Legal Action (HO):</label>
                                <Select
                                    className="text-sm"
                                    isSearchable={true}
                                    {...SELECT_MENU_PROPS}
                                    value={optionValue(hoActionOptions, filters.notice_yn_ho)}
                                    options={hoActionOptions}
                                    onChange={(event) => setFilter({ notice_yn_ho: event?.value ?? '' })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-5">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Outstanding Amount:</label>
                                <input
                                    type="number"
                                    autoComplete="off"
                                    placeholder="Min Amount (Rs.)"
                                    className="form-input w-full rounded border text-sm"
                                    value={filters.from_value}
                                    onChange={(e) => setFilter({ from_value: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="hidden text-xs text-gray-500 md:inline">to</span>
                                <input
                                    type="number"
                                    autoComplete="off"
                                    placeholder="Max Amount (Rs.)"
                                    className="form-input w-full rounded border text-sm"
                                    value={filters.to_value}
                                    onChange={(e) => setFilter({ to_value: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-2 pb-0.5">
                                <button
                                    type="button"
                                    className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                                    onClick={handleReset}
                                >
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    className="rounded bg-blue-500 px-3 py-1.5 text-xs text-white hover:bg-blue-600"
                                    onClick={handleSearch}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </AnimateHeight>
            </div>

            <div className="mb-2 p-pl-table-item">
                <MantineReactTable table={table} />
            </div>

            {reviewRow && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <FiPaperclip size={16} />
                            </div>
                            <div>
                                <h5 className="text-base font-semibold text-gray-800">Review Legal Action (HO)</h5>
                                <p className="mt-0.5 text-sm text-gray-500">{reviewRow.dlr_dealer_name}</p>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="mb-1.5 block text-sm text-gray-600">Legal Action (HO)</label>
                            <Select
                                className="text-sm"
                                isSearchable={false}
                                {...SELECT_MENU_PROPS}
                                value={optionValue(
                                    reviewHoOptions.length ? reviewHoOptions : [
                                        { value: 'Y', label: 'Yes' },
                                        { value: 'N', label: 'No' },
                                    ],
                                    reviewHoAction
                                )}
                                options={
                                    reviewHoOptions.length
                                        ? reviewHoOptions
                                        : [
                                              { value: 'Y', label: 'Yes' },
                                              { value: 'N', label: 'No' },
                                          ]
                                }
                                onChange={(event) => {
                                    const value = event?.value ?? '';
                                    setReviewHoAction(value);
                                    if (value !== 'N') setReviewReason('');
                                }}
                            />
                        </div>
                        {reviewHoAction === 'N' && (
                            <div className="mb-6">
                                <label className="mb-1.5 block text-sm text-gray-600">Reason</label>
                                <textarea
                                    className="form-input min-h-[88px] w-full rounded border px-3 py-2 text-sm"
                                    placeholder="Enter reason"
                                    value={reviewReason}
                                    onChange={(e) => setReviewReason(e.target.value)}
                                />
                            </div>
                        )}
                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                className="rounded-full bg-green-500 px-8 py-2 text-sm font-medium text-white hover:bg-green-600"
                                onClick={handleReviewSave}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="rounded-full border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                onClick={closeReviewModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="fixed inset-0 z-[220] flex items-center justify-center bg-white bg-opacity-75">
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

export default LegalCaseApprovalListScreen;
