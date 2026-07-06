import 'flatpickr/dist/themes/material_green.css';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { CiSearch } from "react-icons/ci";
import Select from 'react-select';
import * as EpcaCancellation from '../../../services/api/protectonEpca/EpcaCancellation';
import * as Epca from '../../../services/api/protectonEpca/EpcaList';
import { commonAlert } from '../../../services/functions/commonAlert';
import { commonSuccessToast } from '../../../services/functions/commonToast';
import { UseAuthStore } from '../../../services/store/AuthStore';

export interface SELECTED_DROPDOWN {
    Userdepot: number;
    Userterritory: number;
}
const selectedDropdownInit: SELECTED_DROPDOWN = {
    Userdepot: -1,
    Userterritory: -1,
};
const EPCACancellation = () => {
    type PcaType = {
        // set custom column headings
        depot_regn: string;
        depot_name: string;
        dlr_terr_code: string;
        dlr_dealer_code: string;
        dlr_dealer_name: string;
        dlr_bill_to: string;
        pd_appl_yn: string;
        sku_desc: string;
        sku_uom: string;
        sku_pack_size: string;
        pd_mrp: string;
        rate: string;
        qty: string;
        valid_from: string;
        valid_till: string;
        factory: string;
        pd_auto_id: string;
        TotalRecords: number;
    };

    const [data, setData] = useState<PcaType[]>([]);
    const [loading, setLoading] = useState(false);
    const [pcaParam, setPcaParam] = useState({
        app_id: 0,
        depotCode: '',
        terrCode: '',
        billtoCode: '',
        dealerCode: '',
        dealerName: '',
        aprvStatus: '',
        mainStatus: '',
        frm_date: '',
        to_date: '',
    });
    const [selectedDropdown, setSelectedDropdown] = useState<SELECTED_DROPDOWN>(selectedDropdownInit);
    const [depot, setDepot] = useState<any>([]);
    const [applTerr, setApplTerr] = useState<any>([]);
    const user = UseAuthStore((state: any) => state.userDetails);
    //----//
    const [paginationState, _] = useState({
        pageIndex: 0, // zero-based index
        pageSize: 10, // default page size
    });
    //----//

    // const labelValueConverter = (arr: any[], propertyNameLabel: string, propertyNameValue: string) => {
    //     arr.forEach((element) => {
    //         element['value'] = element[propertyNameValue];
    //         element['label'] = element[propertyNameLabel];
    //     });
    //     return arr;
    // };
    const findSelectedTypeValue = (arr: any[], arrPropName: string, checkValue: string) => {
        if (arr && arr.length > 0) {
            const selectedValue = arr.findIndex((item: any) => item[arrPropName] == checkValue);
            return selectedValue == -1 ? -1 : selectedValue;
        } else {
            return -1;
        }
    };

    const getDate = (date: Date[], field: 'frm_date' | 'to_date') => {
        setPcaParam((prevState) => ({
            ...prevState,
            [field]: date[0],
        }));
    };

    const handleTypeSelect = (e: any, flag: 'USER_DEPOT' | 'USER_TERR') => {
        if (flag == 'USER_DEPOT' && e && e.target.innerText && depot.length > 0) {
            let getIndex = findSelectedTypeValue(depot, 'label', e.target.innerText);
            setSelectedDropdown((prev) => ({ ...prev, Userdepot: getIndex }));
            GetApplicableTerritory(depot[getIndex].depot_code);
        }

        if (flag == 'USER_TERR' && e && e.target.innerText && applTerr.length > 0) {
            let getIndex = findSelectedTypeValue(applTerr, 'label', e.target.innerText);
            setSelectedDropdown((prev) => ({ ...prev, Userterritory: getIndex }));
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setPcaParam((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        GetApplicableDepot();
        GetePCAListData(1, 10);
    }, []);

    const GetApplicableDepot = async () => {
        setLoading(true);
        const data: any = {
            user_id: user.user_id,
            region: '',
            app_id: '15',
        };
        try {
            const response: any = await Epca.GetApplicableDepotList(data);
            //labelValueConverter(response.data, 'depot_name', 'depot_code');
            const updatedDepotList = [
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
            return;
        }
        setLoading(false);
    };

    const GetApplicableTerritory = async (depotCode: any) => {
        setLoading(true);
        const data: any = {
            user_id: user.user_id,
            depot_code: depotCode,
            app_id: '15',
        };
        try {
            const response: any = await Epca.GetApplicableTerrList(data);
            //labelValueConverter(response.data, 'terr_name', 'terr_code');
            if (response.data != null && response.data != undefined) {
                const updatedTerrList = [
                    { label: 'Select...', value: '' },
                    ...response.data.map((item: any) => ({
                        label: item.terr_name,
                        value: item.terr_code,
                        terr_name: item.terr_name,
                        terr_code: item.terr_code,
                    })),
                ];
                setApplTerr(updatedTerrList);
            } else {
                setApplTerr([]);
            }
        } catch (error) {
            return;
        }
        setLoading(false);
    };

    const handleCancel = (rowData: PcaType) => {
        CanclePca(rowData.pd_auto_id);
    };

    async function CanclePca(autoId: any) {
        setLoading(true);
        commonAlert('Are you sure you want to Cancle this PCA?', '', 'warning').then(async (result: any) => {
            if (result.value) {
                const response: any = await EpcaCancellation.PcaCancellationUpdate({ auto_id: autoId });

                if (response.response_message) {
                    commonSuccessToast('ePCA Cancellation Successful.');
                }
            }
        });
        setLoading(false);
    }

    const handleSearch = (e: any) => {
        e.preventDefault();
        GetePCAListData(1, 10); // Call the API with current state values
    };

    const GetePCAListData = async (pageNumber: number, pagesize: number) => {
        setLoading(true);
        const data: any = {
            app_id: 15,
            depotCode: selectedDropdown.Userdepot != -1 ? depot[selectedDropdown.Userdepot].depot_code : '',
            terrCode: selectedDropdown.Userterritory != -1 ? applTerr[selectedDropdown.Userterritory].terr_code : '',
            billtoCode: pcaParam.billtoCode != '' ? pcaParam.billtoCode : '',
            dealerCode: pcaParam.dealerCode != '' ? pcaParam.dealerCode : '',
            dealerName: pcaParam.dealerName != '' ? pcaParam.dealerName : '',
            aprvStatus: pcaParam.aprvStatus != '' ? pcaParam.aprvStatus : '',
            mainStatus: pcaParam.mainStatus != '' ? pcaParam.mainStatus : '',
            frm_date: pcaParam.frm_date != '' ? moment(pcaParam.frm_date, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
            to_date: pcaParam.to_date != '' ? moment(pcaParam.to_date, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
            PageNumber: pageNumber,
            pagesize: pagesize,
        };
        try {
            const response: any = await EpcaCancellation.PcaCancellationGetList(data);
            if (response && response.data != null && response.data != undefined) {
                setData(response.data.table);
                //setTotalRecords(response.data.table.totalRecords);
            } else setData([]);
        } catch (error) {
            return;
        }
        setLoading(false);
    };

    React.useEffect(() => {
        GetePCAListData(paginationState.pageIndex, paginationState.pageSize);
    }, [paginationState]);


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
                size: 100,
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
                accessorKey: 'sku_desc',
                header: 'SKU',
                size: 100,
            },
            {
                accessorKey: 'sku_uom',
                header: 'UOM',
                size: 50,
            },
            {
                accessorKey: 'sku_pack_size',
                header: 'Pack Size',
                size: 50,
            },
            {
                accessorKey: 'pd_mrp',
                header: 'Declared PCA(Lt/Kg)',
                size: 50,
            },
            {
                accessorKey: 'rate',
                header: 'Rate (Lt/Kg)',
                size: 50,
            },
            {
                accessorKey: 'qty',
                header: 'NOP',
                size: 50,
            },
            {
                accessorKey: 'valid_from',
                header: 'Valid From',
                size: 50,
            },
            {
                accessorKey: 'valid_till',
                header: 'Valid Till',
                size: 50,
            },
            {
                accessorKey: 'factory',
                header: 'Required From',
                size: 50,
            },
            {
                id: 'action',
                header: 'Action',
                size: 50,
                Cell: ({ row }) => (
                    <button
                        style={{
                            padding: '4px 8px',
                            backgroundColor: '#f44336',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleCancel(row.original)}
                    >
                        Cancel
                    </button>
                ),
            },
        ],
        []
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
                overflowX: 'hidden', // hides horizontal scrollbar
            },
        }
    });

    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
                <h5 className="text-lg font-semibold dark:text-white-light">e-PCA Cancellation</h5>
            </div>

            <div className="bg-white rounded-lg px-4 py-1 shadow-md mb-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
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

                    <div>
                        <label className="block text-sm font-semibold mb-1">Acct. No.:</label>
                        <input type="text" placeholder="Acct. No." className="w-full border rounded form-input text-sm" name="dealerCode" value={pcaParam.dealerCode} autoComplete="off" onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Customer Name:</label>
                        <input type="text" placeholder="Customer Name" className="w-full border rounded form-input text-sm" autoComplete="off" name="dealerName" value={pcaParam.dealerName} onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Bill To:</label>
                        <input type="text" placeholder="Bill To" className="w-full border rounded form-input text-sm" autoComplete="off" name="billtoCode" value={pcaParam.billtoCode} onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Ho Approved From Date:<span className="reqired">*</span>
                        </label>
                        <Flatpickr value={pcaParam.frm_date} options={{ dateFormat: 'd/m/Y', position: 'auto left' }} className="w-full border rounded form-input text-sm" onChange={(date) => getDate(date, 'frm_date')} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Ho Approved To Date:<span className="reqired">*</span>
                        </label>
                        <Flatpickr value={pcaParam.to_date} options={{ dateFormat: 'd/m/Y', position: 'auto left' }} className="w-full border rounded form-input text-sm" onChange={(date) => getDate(date, 'to_date')} />
                    </div>

                    {/* Buttons */}
                    <div className="flex items-end space-x-2">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 space-x-2 rounded hover:bg-blue-600 text-xs flex items-center" onClick={handleSearch}>
                            <CiSearch />  <span>Search</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-2 p-pl-table-item" style={{ maxHeight: '45vh', overflowY: 'auto' }}>
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

export default EPCACancellation;
