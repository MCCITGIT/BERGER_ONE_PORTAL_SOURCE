import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef, type MRT_PaginationState } from 'mantine-react-table';
import { FiEye } from 'react-icons/fi';
import { CiSearch } from 'react-icons/ci';
import type { AIChatListRecord } from './demoData';
import { GetConversationList } from '../../services/api/AIassistant/AIChat';
import { commonErrorToast } from '../../services/functions/commonToast';
import { formatDateToIST } from './dateUtils';

const formatDateParam = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const getDefaultFilters = () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    return {
        fromDate: formatDateParam(oneMonthAgo),
        toDate: formatDateParam(today),
        userId: '',
        keyword: '',
    };
};

const PAGE_SIZE = 15;

const AIassistantListScreen = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<AIChatListRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [rowCount, setRowCount] = useState(0);
    const [filters, setFilters] = useState(() => getDefaultFilters());
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });

    const openDetails = useCallback(
        (chat: AIChatListRecord) => {
            navigate(`/AIassistant/AIassistantDetailsScreen/${chat.chatId}`);
        },
        [navigate]
    );

    const fetchConversationList = useCallback(async (
        fromDate: string,
        toDate: string,
        userId: string,
        keyword: string,
        pageIndex: number,
        pageSize: number
    ) => {
        if (!fromDate || !toDate) {
            commonErrorToast('Please select From Date and To Date');
            return;
        }

        setLoading(true);
        try {
            const response = await GetConversationList({
                FromDate: fromDate,
                ToDate: toDate,
                UserId: userId,
                Keyword: keyword,
                AppName: 'OneApp',
                PageNumber: pageIndex + 1,
                PageSize: pageSize,
            });

            if (response?.success && response?.data) {
                setData(response.data);
                setRowCount(
                    response.data.length < pageSize
                        ? pageIndex * pageSize + response.data.length
                        : (pageIndex + 1) * pageSize + 1
                );
            } else {
                setData([]);
                setRowCount(0);
                commonErrorToast(response?.message || 'Failed to load conversation list');
            }
        } catch {
            setData([]);
            setRowCount(0);
            commonErrorToast('Failed to load conversation list');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConversationList(
            filters.fromDate,
            filters.toDate,
            filters.userId,
            filters.keyword,
            pagination.pageIndex,
            pagination.pageSize
        );
    }, [fetchConversationList, pagination.pageIndex, pagination.pageSize]);

    const handleFilterChange = (field: 'fromDate' | 'toDate' | 'userId' | 'keyword', value: string) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleSearch = () => {
        if (pagination.pageIndex === 0) {
            fetchConversationList(
                filters.fromDate,
                filters.toDate,
                filters.userId,
                filters.keyword,
                0,
                pagination.pageSize
            );
        } else {
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }
    };

    const columns = useMemo<MRT_ColumnDef<AIChatListRecord>[]>(
        () => [
            {
                accessorKey: 'chatId',
                header: 'Chat ID',
                size: 280,
            },
            {
                accessorKey: 'title',
                header: 'Chat Title',
                size: 160,
                Cell: ({ cell }) => cell.getValue<string | null>() ?? '-',
            },
            {
                accessorKey: 'createdAt',
                header: 'Created At',
                size: 180,
                Cell: ({ cell }) => formatDateToIST(cell.getValue<string>()),
            },
            {
                accessorKey: 'user_id',
                header: 'User ID',
                size: 100,
            },
            {
                accessorKey: 'userName',
                header: 'User Name',
                size: 160,
            },
            {
                accessorKey: 'messageCount',
                header: 'Messages',
                size: 100,
            },
            {
                id: 'action',
                header: 'Details',
                size: 80,
                enableSorting: false,
                Cell: ({ row }) => (
                    <div className="flex justify-center">
                        <FiEye
                            className="cursor-pointer text-blue-600 hover:text-blue-800"
                            size={17}
                            title="View chat details"
                            onClick={() => openDetails(row.original)}
                        />
                    </div>
                ),
            },
        ],
        [openDetails]
    );

    const table = useMantineReactTable({
        columns,
        data,
        manualPagination: true,
        rowCount,
        onPaginationChange: setPagination,
        paginationDisplayMode: 'pages',
        state: {
            isLoading: loading,
            pagination,
        },
        enableColumnResizing: true,
        enableStickyHeader: true,
        enableTopToolbar: false,
        enableSorting: true,
        enableColumnActions: false,
        columnResizeMode: 'onChange',
        mantineTableContainerProps: {
            style: { overflow: 'auto', maxHeight: '24rem' },
        },
    });

    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
                <h5 className="text-lg font-semibold dark:text-white-light">AI Assistant</h5>
            </div>

            <div className="rounded-lg bg-white px-4 py-2 shadow-md">
                <div className="mb-3 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-2">
                        <label className="block w-24 pr-2 text-right text-sm font-semibold">
                            From Date:
                        </label>
                        <input
                            className="form-input w-32 rounded border text-sm"
                            type="date"
                            value={filters.fromDate}
                            onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                            style={{ padding: '5px' }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="block w-24 pr-2 text-right text-sm font-semibold">
                            To Date:
                        </label>
                        <input
                            className="form-input w-32 rounded border text-sm"
                            type="date"
                            value={filters.toDate}
                            onChange={(e) => handleFilterChange('toDate', e.target.value)}
                            style={{ padding: '5px' }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="block w-24 pr-2 text-right text-sm font-semibold">
                            User Id:
                        </label>
                        <input
                            className="form-input w-40 rounded border text-sm"
                            type="text"
                            value={filters.userId}
                            onChange={(e) => handleFilterChange('userId', e.target.value)}
                            placeholder="Enter User Id"
                            style={{ padding: '5px' }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="block w-32 pr-2 text-right text-sm font-semibold">
                            Keyword Search:
                        </label>
                        <input
                            className="form-input w-48 rounded border text-sm"
                            type="text"
                            value={filters.keyword}
                            onChange={(e) => handleFilterChange('keyword', e.target.value)}
                            placeholder="Search keyword"
                            style={{ padding: '5px' }}
                        />
                    </div>
                    <div className="flex items-center">
                        <button
                            type="button"
                            className="flex h-[38px] w-24 items-center justify-center space-x-1 rounded bg-blue-500 px-3 py-2 text-sm text-white transition-colors duration-200 hover:bg-blue-600"
                            onClick={handleSearch}
                        >
                            <CiSearch className="text-sm" />
                            <span>Search</span>
                        </button>
                    </div>
                </div>
                <MantineReactTable table={table} />
            </div>
        </>
    );
};

export default AIassistantListScreen;
