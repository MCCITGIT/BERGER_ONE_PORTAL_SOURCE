import { useEffect, useMemo, useState } from "react";
import * as common from '../../../services/api/users/UserProfile';
import * as Epca from '../../../services/api/protectonEpca/EpcaList';
import * as Billing from '../../../services/api/protectonTransact/TransactBilling';
import { UseAuthStore } from "../../../services/store/AuthStore";
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import { CiSearch } from "react-icons/ci";
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { Button, Group, Modal } from "@mantine/core";
import { useNavigate } from 'react-router-dom';

const TransactBilling = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>({
        regionList: [],
        depotList: [],
        terrList: [],
        selectedRegion: '',
        selectedDepot: '',
        selectedTerr: '',
        fromdt: '',
        todt: '',
        billingList: [],
        billingDetailsList: [],
    });

    const [modalBillingOpen, setModalBillingOpen] = useState(false);
    const [modalInvoiceOpen, setModalInvoiceOpen] = useState(false);

    const user = UseAuthStore((state: any) => state.userDetails);

    const GetRegion = async () => {
        setLoading(true);
        const data: any = {
            user_group: user.group_code,
            app_id: '15',
            user_appl_yn: 'Y'
        };
        try {
            const response: any = await common.GetProtectonRegion(data);
            setData((prevData: any) => ({
                ...prevData,
                regionList: response.data.table || [],
            }));

        } catch (error) {
            return;
        }
        setLoading(false);
    }

    const Getdepot = async (region: string) => {
        setLoading(true);

        const payload: any = {
            user_id: user.user_id,
            region: region,
            app_id: '15',
        };
        try {
            const response: any = await Epca.GetApplicableDepotList(payload);
            setData((prevData: any) => ({
                ...prevData,
                depotList: response.data || [],
                selectedRegion: region,
                selectedDepot: ''
            }));
        } catch (error) {
            return;
        }
        setLoading(false);
    }

    const GetTerr = async (region: string) => {
        setLoading(true);
        const payload: any = {
            region: region,
            app_id: '15',
            user_appl_yn: 'Y'
        };
        try {
            const response: any = await common.GetProtectonApplicableTerr(payload);
            setData((prevData: any) => ({
                ...prevData,
                terrList: response.data.table || [],
                selectedRegion: region,
                selectedTerr: ''
            }));
        } catch (error) {
            return;
        }
        setLoading(false);
    }

    const GetBillingList = async () => {
        setLoading(true);
        const payload: any = {
            FromDate: data.fromdt,
            ToDate: data.todt,
            Region: data.selectedRegion,
            DepotCode: data.selectedDepot,
            TerrCode: data.selectedTerr,
        };
        try {
            const response: any = await Billing.GetBillingList(payload);
            setData((prevData: any) => ({
                ...prevData,
                billingList: response.data.table || [],
            }));
        } catch (error) {
            return;
        }
        setLoading(false);
    }

    type BillingType = {
        dlr_name: string;
        dlr_code: string;
        depot_regn: string;
        depot_name: string;
        terr_name: string;
        order_date: string;
        order_id: number;
        billto_code: string;
    };

    type BillingDetailsType = {
        sku_desc: string;
        bpd_sku_id: string;
        bpd_approved_rate: string;
        sku_pack_size: string;
        bpd_no_of_pack: string;
        bpd_total_amount: string;
    };

    const columnsBilling = useMemo<MRT_ColumnDef<BillingType>[]>(
        () => [
            {
                accessorKey: 'dlr_name',
                header: 'Dealer Name',
                size: 50,
            },
            {
                accessorKey: 'dlr_code',
                header: 'Dealer Code',
                size: 50,
            },
            {
                accessorKey: 'depot_regn',
                header: 'Region',
                size: 50,
            },
            {
                accessorKey: 'depot_name',
                header: 'Depot',
                size: 50,
            },
            {
                accessorKey: 'terr_name',
                header: 'Territory By',
                size: 50,
            },
            {
                accessorKey: 'order_date',
                header: 'Order Date',
                size: 50,
            },
            {
                accessorKey: 'order_id',
                header: 'Order ID',
                size: 50,
            },
            {
                accessorKey: 'billto_code',
                header: 'Bill To',
                size: 50,
            },
        ],
        []
    );
    const columnsBillingDetails = useMemo<MRT_ColumnDef<BillingDetailsType>[]>(
        () => [
            {
                accessorKey: 'sku_desc',
                header: 'SKU Description',
                size: 50,
            },
            {
                accessorKey: 'bpd_sku_id',
                header: 'SKU ID',
                size: 50,
            },
            {
                accessorKey: 'bpd_approved_rate',
                header: 'Billing Rate (Ltr/Kg)',
                size: 50,
            },
            {
                accessorKey: 'sku_pack_size',
                header: 'Pack Size (Ltr/Kg)',
                size: 50,
            },
            {
                accessorKey: 'bpd_no_of_pack',
                header: 'NOP',
                size: 50,
            },
            {
                accessorKey: 'bpd_total_amount',
                header: 'Total Amount',
                size: 50,
            },
        ],
        []
    );

    const tableBilling = useMantineReactTable({
        columns: columnsBilling,
        data: data.billingList,
        enableColumnResizing: true,
        enableTopToolbar: false,
        enableSorting: false,
        enableColumnActions: false,
        columnResizeMode: 'onChange',
        enableRowActions: true,
        positionActionsColumn: 'last',
        renderRowActions: ({ row }) => (
            <Group spacing="xs" pr="xs" position="center">
                <Button size="xs" variant="outline"
                    onClick={() => openInvoiceDetails(row.original)}
                >
                    Invoice
                </Button>
                <Button
                    size="xs"
                    variant="outline"
                    onClick={() => openBillingDetails(row.original)}
                >
                    Billing
                </Button>
            </Group>
        ),
        mantineTableContainerProps: {
            style: {
                overflowX: 'hidden',
            },
        },
    });

    const tableBillingDetails = useMantineReactTable({
        columns: columnsBillingDetails,
        data: data.billingDetailsList.table1 ? data.billingDetailsList.table1 : [],
        enableColumnResizing: true,
        enableTopToolbar: false,
        enableSorting: false,
        enableColumnActions: false,
        enablePagination: false,
        columnResizeMode: 'onChange',
        mantineTableContainerProps: {
            style: {
                overflowX: 'hidden',
            },
        },
    });

    const tableInvoiceDetails = useMantineReactTable({
        columns: columnsBillingDetails,
        data: data.billingDetailsList.table2 ? data.billingDetailsList.table2 : [],
        enableColumnResizing: true,
        enableTopToolbar: false,
        enableSorting: false,
        enableColumnActions: false,
        enablePagination: false,
        columnResizeMode: 'onChange',
        mantineTableContainerProps: {
            style: {
                overflowX: 'hidden',
            },
        },
    });

    const openBillingDetails = async (row: any) => {
        setModalBillingOpen(true);
        setLoading(true);
        const payload: any = {
            OrderId: row.order_id,
        };
        try {
            const response: any = await Billing.GetBillingDetails(payload);
            setData((prevData: any) => ({
                ...prevData,
                billingDetailsList: response.data || [],
            }));
        } catch (error) {
            return;
        }
        setLoading(false);
    };

    const openInvoiceDetails = async (row: any) => {
        setModalInvoiceOpen(true);
        setLoading(true);
        const payload: any = {
            OrderId: row.order_id,
        };
        try {
            const response: any = await Billing.GetBillingDetails(payload);
            setData((prevData: any) => ({
                ...prevData,
                billingDetailsList: response.data || [],
            }));
        } catch (error) {
            return;
        }
        setLoading(false);
    }

    const handleCreateBilling = () => {
        navigate('/Protecton/Transact/TransactBillingCreate');
    }

    useEffect(() => {
        GetRegion();
        setData((prevData: any) => ({
            ...prevData, todt: new Date(),
            fromdt: new Date(new Date().setDate(new Date().getDate() - 7))
        }));
    }, []);

    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
                <h5 className="text-lg font-semibold dark:text-white-light">Transact Billing</h5>
            </div>

            <div className="bg-white rounded-lg px-4 py-2 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">

                    <div>
                        <label htmlFor="dsr-date" className="block text-sm font-semibold mb-1">From Date:</label>
                        <Flatpickr
                            value={data.fromdt ? [data.fromdt] : []}
                            onChange={(dates: Date[]) => setData((prevData: any) => ({ ...prevData, fromdt: dates[0] || null }))}
                            options={{
                                dateFormat: 'd/m/Y',
                            }}
                            className="tableInput"
                        />
                    </div>

                    <div>
                        <label htmlFor="dsr-date" className="block text-sm font-semibold mb-1">To Date:</label>
                        <Flatpickr
                            value={data.todt ? [data.todt] : []}
                            onChange={(dates: Date[]) => setData((prevData: any) => ({ ...prevData, todt: dates[0] || null }))}
                            options={{
                                dateFormat: 'd/m/Y',
                            }}
                            className="tableInput"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Region:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            options={[
                                ...data.regionList.map((d: any) => ({
                                    value: d.depot_regn,
                                    label: d.regn_new,
                                })),
                            ]}
                            value={
                                data.selectedRegion
                                    ? { value: data.selectedRegion, label: data.selectedRegion }
                                    : null
                            }
                            onChange={(event) => {
                                Getdepot(event?.value);
                                GetTerr(event?.value);
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Depot:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            options={[
                                { value: '', label: 'ALL' },
                                ...data.depotList.map((d: any) => ({
                                    value: d.depot_code,
                                    label: d.depot_name,
                                })),
                            ]}
                            value={
                                data.selectedDepot
                                    ? { value: data.selectedDepot, label: data.depotList.find((d: any) => d.depot_code === data.selectedDepot)?.depot_name }
                                    : null
                            }
                            onChange={(event) => {
                                setData((pre: any) => ({ ...pre, selectedDepot: event?.value }))
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Territory:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            options={[
                                { value: '', label: 'ALL' },
                                ...data.terrList.map((d: any) => ({
                                    value: d.terr_code,
                                    label: d.terr_name,
                                })),
                            ]}
                            value={
                                data.selectedTerr
                                    ? { value: data.selectedTerr, label: data.terrList.find((d: any) => d.terr_code === data.selectedTerr)?.terr_name }
                                    : null
                            }
                            onChange={(event) => {
                                setData((pre: any) => ({ ...pre, selectedTerr: event?.value }))
                            }}
                        />
                    </div>

                    <div className="flex items-end space-x-2">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 space-x-2 rounded hover:bg-blue-600 text-sm flex items-center"
                            onClick={(e) => {
                                e.preventDefault();
                                GetBillingList();
                            }}>
                            <CiSearch /> <span>Search</span>
                        </button>

                        <button
                            className="bg-red-500 text-white px-4 py-2 space-x-2 rounded hover:bg-red-600 text-sm flex items-center"
                            onClick={(e) => {
                                e.preventDefault();
                                handleCreateBilling();
                            }}>
                            <span>Create</span>
                        </button>
                    </div>

                </div>
            </div>

            <div className="mb-2 overflow-y-auto">
                <MantineReactTable table={tableBilling} />
            </div>

            <Modal
                opened={modalBillingOpen}
                onClose={() => {
                    setModalBillingOpen(false);
                    setData((prevData: any) => ({
                        ...prevData,
                        billingDetailsList: [],
                    }));
                }}
                size="80vw"
            >

                <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
                    <h5 className="text-lg font-semibold dark:text-white-light">Billing Details</h5>
                </div>

                {data.billingDetailsList.table && data.billingDetailsList.table.length > 0 &&
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg shadow-md">
                        <div className="text-sm font-medium text-gray-800">
                            <span className="font-semibold text-gray-600">Dealer: </span>
                            {data.billingDetailsList.table[0].dlr_name}
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                            <span className="font-semibold text-gray-600">Order Date: </span>
                            {data.billingDetailsList.table[0].order_date}
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                            <span className="font-semibold text-gray-600">Depot: </span>
                            {data.billingDetailsList.table[0].depot_name}
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                            <span className="font-semibold text-gray-600">Territory: </span>
                            {data.billingDetailsList.table[0].terr_name}
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                            <span className="font-semibold text-gray-600">Order ID: </span>
                            {data.billingDetailsList.table[0].order_id}
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                            <span className="font-semibold text-gray-600">Bill To: </span>
                            {data.billingDetailsList.table[0].billto_code}
                        </div>
                    </div>}

                {data.billingDetailsList.table1 && data.billingDetailsList.table1.length > 0 &&
                    <div>

                        <div className="my-4 overflow-y-auto">
                            <MantineReactTable table={tableBillingDetails} />
                        </div>

                        <div className="flex justify-end p-4 bg-gray-50">
                            <span className="font-semibold text-lg text-slate-800">
                                Total Billing Amount: {data.billingDetailsList.table1.reduce((acc: number, item: any) => acc + parseFloat(item.bpd_total_amount || '0'), 0).toFixed(2)}
                            </span>
                        </div>

                    </div>
                }
            </Modal>


            <Modal
                opened={modalInvoiceOpen}
                onClose={() => {
                    setModalInvoiceOpen(false);
                    setData((prevData: any) => ({
                        ...prevData,
                        billingDetailsList: [],
                    }));
                }}
                size="80vw"
            >
                <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
                    <h5 className="text-lg font-semibold dark:text-white-light">Invoice Details</h5>
                </div>

                {data.billingDetailsList.table && data.billingDetailsList.table.length > 0 &&
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg shadow-md">
                        <div className="text-sm font-medium text-gray-800">
                            <span className="font-semibold text-gray-600">Dealer: </span>
                            {data.billingDetailsList.table[0].dlr_name}
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                            <span className="font-semibold text-gray-600">Order Date: </span>
                            {data.billingDetailsList.table[0].order_date}
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                            <span className="font-semibold text-gray-600">Depot: </span>
                            {data.billingDetailsList.table[0].depot_name}
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                            <span className="font-semibold text-gray-600">Territory: </span>
                            {data.billingDetailsList.table[0].terr_name}
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                            <span className="font-semibold text-gray-600">Order ID: </span>
                            {data.billingDetailsList.table[0].order_id}
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                            <span className="font-semibold text-gray-600">Bill To: </span>
                            {data.billingDetailsList.table[0].billto_code}
                        </div>
                    </div>}

                {data.billingDetailsList.table2 && data.billingDetailsList.table2.length > 0 &&
                    <div>

                        <div className="my-4 overflow-y-auto">
                            <MantineReactTable table={tableBillingDetails} />
                        </div>

                        <div className="flex justify-end p-4 bg-gray-50">
                            <span className="font-semibold text-lg text-slate-800">
                                Total Invoice Amount: {data.billingDetailsList.table2.reduce((acc: number, item: any) => acc + parseFloat(item.bpd_total_amount || '0'), 0).toFixed(2)}
                            </span>
                        </div>

                    </div>
                }

            </Modal>

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

export default TransactBilling;