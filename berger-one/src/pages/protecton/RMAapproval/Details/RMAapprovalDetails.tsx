import { useEffect, useMemo, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { IoReturnUpBack } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import * as RMA from '../../../../services/api/protectonRMA/RMAList';
import { commonAlert } from '../../../../services/functions/commonAlert';
import { commonErrorToast, commonSuccessToast } from '../../../../services/functions/commonToast';

// ─── Component ────────────────────────────────────────────────────────────────

const RMAapprovalDetails = () => {
    const navigate = useNavigate();

    const [header, setHeader] = useState<any>(null);
    const [skuData, setSkuData] = useState<any[]>([]);
    const [depotStats, setDepotStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionVisibility, setActionVisibility] = useState<{ showApprove: boolean; showReject: boolean }>({
        showApprove: false,
        showReject: false,
    });

    // Remarks modal state (shared for Approve & Reject)
    const [showRemarksModal, setShowRemarksModal] = useState(false);
    const [remarksAction, setRemarksAction] = useState<'Y' | 'N'>('Y'); // Y = Approve, N = Reject
    const [remarks, setRemarks] = useState('');
    const [remarksError, setRemarksError] = useState('');

    // ── Load header from sessionStorage ──────────────────────────────────────

    useEffect(() => {
        const stored = sessionStorage.getItem('rmaApprovalDtl');
        if (stored) {
            try {
                setHeader(JSON.parse(stored));
            } catch {
                setHeader(null);
            }
        }
    }, []);

    // ── Load SKU details + action visibility when header is available ──────────

    useEffect(() => {
        if (header?.id) {
            loadSkuDetails(header.id);
        }
        if (header?.approval_status) {
            loadActionVisibility(header.approval_status);
        }
    }, [header]);

    const loadActionVisibility = async (approvalStatus: string) => {
        try {
            const res: any = await RMA.GetRmaApprovalActionVisibility({ approvalStatus });
            const av = res?.actionVisibility ?? res?.data ?? {};
            setActionVisibility({
                showApprove: av.showApprove ?? false,
                showReject: av.showReject ?? false,
            });
        } catch {
            setActionVisibility({ showApprove: false, showReject: false });
        }
    };

    const loadSkuDetails = async (id: number) => {
        setLoading(true);
        try {
            const res: any = await RMA.GetInvoiceReturnDetails({ headerid: id });
            setSkuData(res?.data?.table ?? []);
            setDepotStats(res?.data?.table1 ?? []);
        } catch {
            setSkuData([]);
            setDepotStats([]);
        } finally {
            setLoading(false);
        }
    };

    // ── Open modal ────────────────────────────────────────────────────────────

    const openRemarksModal = (action: 'Y' | 'N') => {
        setRemarksAction(action);
        setRemarks('');
        setRemarksError('');
        setShowRemarksModal(true);
    };

    // ── Submit (Approve / Reject) ──────────────────────────────────────────────

    const handleRemarksSubmit = async () => {
        if (!remarks.trim()) {
            setRemarksError('Please enter remarks.');
            return;
        }
        setRemarksError('');
        setShowRemarksModal(false);

        const actionLabel = remarksAction === 'Y' ? 'approve' : 'reject';
        commonAlert(`Are you sure you want to ${actionLabel} this invoice?`, '', 'warning').then(async (result: any) => {
            if (result.value) {
                setLoading(true);
                try {
                    const res: any = await RMA.InvoiceReturnApprove({
                        reqId: header?.id,
                        approvedYn: remarksAction,
                        approvalRemarks: remarks.trim(),
                    });
                    if (res?.success || res?.response_message) {
                        commonSuccessToast(`Invoice ${actionLabel}d successfully`);
                        sessionStorage.setItem('rmaApprovalListReturnFromDetails', '1');
                        navigate('/Protecton/RMA/RMAApprovalList/');
                    } else {
                        commonErrorToast(res?.message || `Action failed. Please try again.`);
                    }
                } catch {
                    commonErrorToast(`Action failed. Please try again.`);
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    // ── Back ──────────────────────────────────────────────────────────────────

    const handleBack = () => {
        sessionStorage.setItem('rmaApprovalListReturnFromDetails', '1');
        navigate('/Protecton/RMA/RMAApprovalList/');
    };

    // ── SKU table columns ─────────────────────────────────────────────────────

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'sls_sku_code',
                header: 'SKU Code',
                size: 140,
            },
            {
                accessorKey: 'sku_desc',
                header: 'SKU Name',
                size: 220,
            },
            {
                accessorKey: 'sls_vol',
                header: 'Volume',
                size: 80,
            },
            {
                accessorKey: 'sku_qty',
                header: 'Quantity',
                size: 80,
            },
            {
                accessorKey: 'sku_val',
                header: 'Value',
                size: 90,
            },
        ],
        []
    );

    const table = useMantineReactTable({
        columns,
        data: skuData,
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

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <>
            {/* Page title */}
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
                <h5 className="text-lg font-semibold dark:text-white-light">RMA Approval Details</h5>
            </div>

            {/* ── Header Details ─────────────────────────────────────────────── */}
            <div className="bg-white rounded-lg shadow-md mb-2 px-4 py-2">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
                    <span className="font-bold text-sm text-gray-700">{header?.dlr_name || '—'}</span>
                    <span className="text-gray-400">{header?.dlr_code}</span>
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-500">Region: <span className="font-semibold text-gray-700">{header?.region || '—'}</span></span>
                    <span className="text-gray-500">Depot: <span className="font-semibold text-gray-700">{header?.depot || '—'}</span></span>
                    <span className="text-gray-500">Invoice: <span className="font-semibold text-gray-700">{header?.invoice_num || '—'}</span></span>
                    <span className="text-gray-500">Date: <span className="font-semibold text-gray-700">{header?.invoice_date || '—'}</span></span>
                </div>
            </div>

            {/* ── SKU Details ────────────────────────────────────────────────── */}
            <div className="bg-white rounded-lg shadow-md mb-2 overflow-hidden">
                {/* <div className="bg-[#7F0037] text-white text-xs font-bold px-3 py-2 rounded-t-lg">
                    SKU Details
                </div> */}

                <div className="p-3">
                    {/* SKU table */}
                    <div className="mb-3 p-pl-table-item">
                        <MantineReactTable table={table} />
                    </div>

                    {/* Depot Stats (table1) */}
                    {/* {depotStats.length > 0 && (
                        <div className="mb-3 overflow-x-auto">
                            <table className="w-full text-xs border-collapse">
                                <thead>
                                    <tr className="bg-[#7F0037] text-white">
                                        <th className="border border-gray-300 px-3 py-2 text-left">Depot Code</th>
                                        <th className="border border-gray-300 px-3 py-2 text-left">Year/Month</th>
                                        <th className="border border-gray-300 px-3 py-2 text-right">Total Sales Value</th>
                                        <th className="border border-gray-300 px-3 py-2 text-right">Total RMA Value</th>
                                        <th className="border border-gray-300 px-3 py-2 text-right">RMA %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {depotStats.map((row: any, i: number) => (
                                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="border border-gray-200 px-3 py-2">{row.depot_code || '—'}</td>
                                            <td className="border border-gray-200 px-3 py-2">{row.year_month || '—'}</td>
                                            <td className="border border-gray-200 px-3 py-2 text-right">{row.total_sls_val}</td>
                                            <td className="border border-gray-200 px-3 py-2 text-right">{row.total_rma_val}</td>
                                            <td className="border border-gray-200 px-3 py-2 text-right">{row.rma_percentage}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )} */}

                    {/* Remarks */}
                    <div className="flex gap-3 items-start mb-4">
                        <label className="text-xs font-bold text-[#7F0037] whitespace-nowrap pt-2">Remarks :</label>
                        <textarea
                            readOnly
                            className="w-full border border-gray-300 rounded text-xs p-2 resize-none bg-gray-50"
                            rows={3}
                            value={skuData[0]?.remarks || ''}
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-center gap-3 pb-1">
                        {actionVisibility.showApprove && (
                            <button
                                type="button"
                                className="bg-gradient-to-b from-green-400 to-green-700 text-white text-sm font-semibold px-6 py-2 rounded-full hover:opacity-90"
                                onClick={() => openRemarksModal('Y')}
                            >
                                Approve
                            </button>
                        )}
                        {actionVisibility.showReject && (
                            <button
                                type="button"
                                className="bg-gradient-to-b from-red-300 to-red-800 text-white text-sm font-semibold px-6 py-2 rounded-full hover:opacity-90"
                                onClick={() => openRemarksModal('N')}
                            >
                                Reject
                            </button>
                        )}
                        <button
                            type="button"
                            className="bg-gradient-to-b from-yellow-300 to-yellow-600 text-black text-sm font-semibold px-6 py-2 rounded-full hover:opacity-90 flex items-center gap-1"
                            onClick={handleBack}
                        >
                            <IoReturnUpBack /> Back
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Remarks Modal (Approve / Reject) ──────────────────────────── */}
            <Transition appear show={showRemarksModal} as={Fragment}>
                <Dialog as="div" onClose={() => setShowRemarksModal(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50 z-[998]" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-sm bg-white rounded-lg shadow-xl overflow-hidden">
                                {/* Modal header */}
                                <div className="flex items-center justify-between bg-[#7F0037] px-4 py-2">
                                    <Dialog.Title className="text-sm font-bold text-white">
                                        {remarksAction === 'Y' ? 'Approve' : 'Reject'} — Remarks
                                    </Dialog.Title>
                                    <button
                                        onClick={() => setShowRemarksModal(false)}
                                        className="text-white hover:text-gray-200"
                                    >
                                        <RxCross2 />
                                    </button>
                                </div>

                                {/* Modal body */}
                                <div className="p-4">
                                    {remarksError && (
                                        <p className="text-red-500 text-xs mb-2">{remarksError}</p>
                                    )}
                                    <textarea
                                        className="w-full border border-gray-300 rounded text-sm p-2 resize-none"
                                        rows={4}
                                        maxLength={500}
                                        placeholder="Enter remarks..."
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                    />
                                </div>

                                {/* Modal actions */}
                                <div className="flex justify-center gap-3 pb-4">
                                    <button
                                        type="button"
                                        className={`text-white text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 ${
                                            remarksAction === 'Y'
                                                ? 'bg-gradient-to-b from-green-400 to-green-700'
                                                : 'bg-gradient-to-b from-red-300 to-red-800'
                                        }`}
                                        onClick={handleRemarksSubmit}
                                    >
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-gradient-to-b from-yellow-300 to-yellow-600 text-black text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90"
                                        onClick={() => setShowRemarksModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>

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

export default RMAapprovalDetails;
