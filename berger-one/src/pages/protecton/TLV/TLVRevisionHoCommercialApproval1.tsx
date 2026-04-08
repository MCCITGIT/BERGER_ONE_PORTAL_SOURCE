import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from 'react'
import { flushSync } from 'react-dom'
import CommonFilterComponent from './CommonFilterComponent'
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table'
import { UseAuthStore } from '../../../services/store/AuthStore';
import * as Epca from '../../../services/api/protectonEpca/EpcaList';
import * as Tlv from '../../../services/api/protectonEpca/TLVRevisionRSMApproval';
import * as TlvHoCom from '../../../services/api/protectonEpca/TLVRevisionHoCommercialApproval';
import { useNavigate } from 'react-router-dom';
import { EpcaCustomerStore } from '../../../services/store/Protecton/EpcaCustomerDetailsStore';
import Select from 'react-select';
import { Group, Tooltip } from '@mantine/core';
import { Dialog, Transition } from '@headlessui/react';
import { IconDownload, IconCheck, IconX, IconEye, IconRotate } from '@tabler/icons-react';
import { commonSuccessToast } from '../../../services/functions/commonToast';
import { commonAlert } from '../../../services/functions/commonAlert';

type TLVType = {
    // set custom column headings
    depot_regn: string;
    depot_name: string;
    dlr_terr_code: string;
    dlr_dealer_code: string;
    dlr_dealer_name: string;
    current_tlv: number;
    td_proposed_tlv: number;
    credit_days: number;
    td_proposed_cr_days: number;
    status_value: string;
    td_auto_id: number;
    td_remarks: string;
    auto_id: string;
    file_doc: string;
};

interface TlvLogInit {
    depot_regn: any;
    depot_code: any;
    depot_name: any;
    terr_code: any;
    bill_to: any;
    dealer_code: any;
    dealer_name: any;
    auto_id: any;
    created_date: any;
    current_tlv: any;
    credit_days: any;
    proposed_tlv: any;
    proposed_cr_days: any;
    status_value: any;
    remarks: any;
    td_submission_type: any;
}

const TlvLogDto: TlvLogInit = {
    depot_regn: '',
    depot_code: '',
    depot_name: '',
    terr_code: '',
    bill_to: '',
    dealer_code: '',
    dealer_name: '',
    auto_id: '',
    created_date: '',
    current_tlv: '',
    credit_days: '',
    proposed_tlv: '',
    proposed_cr_days: '',
    status_value: '',
    remarks: '',
    td_submission_type: '',
};

const TLV_DETAILS_RETURN_HO_COMMERCIAL_APPROVAL = '/Protecton/TLV/TLVRevisionHoCommercialApproval';

type StoredTlvApprovalListFilters = {
    depotCode: string;
    terrCode: string;
    billToCode: string;
    dealerCode: string;
    dealerName: string;
    mainStatus: string;
    aprvStatus: string;
};

let tlvHoCommercialApprovalFiltersCache: StoredTlvApprovalListFilters | null = null;
const TLV_HO_COMMERCIAL_APPROVAL_RETURN_FROM_DETAILS_KEY = 'tlvHoCommercialApprovalReturnFromDetails';

const TLVRevisionHoCommercialApproval1 = () => {
    const [loading, setLoading]: any = useState(false);
    const [dgData, setDgData]: any = useState([]);
    const [selectBoxData, setSelectBoxData]: any = useState({
        depot: [],
        terr: [],
        mainStatus: [
            { label: 'Pending', value: 'PENDING' },
            { label: 'Approved', value: 'APPROVED' },
            { label: 'Rejected', value: 'REJECTED' },
        ],
        aprvStatus: []
    });
    const [filterData, setFilterData]: any = useState({ depotCode: '', terrCode: '', billToCode: '', dealerCode: '', dealerName: '', mainStatus: 'PENDING', aprvStatus: "PENDING_HO_COMMERCIAL" });
    const [tlvLogData, setTlvLogData] = useState<TlvLogInit[]>([TlvLogDto]);
    const [showTlvModal, setShowTlvModal] = useState(false);

    const filterDataRef = useRef(filterData);
    useEffect(() => {
        filterDataRef.current = filterData;
    }, [filterData]);

    const user = UseAuthStore((state: any) => state.userDetails);

    const snapApprovalFilters = (fd: typeof filterData): StoredTlvApprovalListFilters => ({
        depotCode: fd.depotCode ?? '',
        terrCode: fd.terrCode ?? '',
        billToCode: fd.billToCode ?? '',
        dealerCode: fd.dealerCode ?? '',
        dealerName: fd.dealerName ?? '',
        mainStatus: fd.mainStatus ?? 'PENDING',
        aprvStatus: fd.aprvStatus ?? '',
    });

    const saveApprovalFiltersToCache = (fd: typeof filterData) => {
        try {
            tlvHoCommercialApprovalFiltersCache = snapApprovalFilters(fd);
        } catch {
            /* ignore */
        }
    };

    // list api 
    const GetTlcHoCommercialApprovalListData = async () => {
        setLoading(true);
        const filterData = filterDataRef.current;
        const data: any = {
            depotCode: filterData?.depotCode,
            terrCode: filterData?.terrCode,
            billToCode: filterData?.billToCode,
            dealerCode: filterData?.dealerCode,
            dealerName: filterData?.dealerName,
            mainStatus: filterData?.mainStatus,
            aprvStatus: filterData?.aprvStatus,
        };
        try {
            const response: any = await TlvHoCom.GetTlvHoCommercialApprovalList(data);
            if (response.data) {
                setDgData(response.data.table);
            } else {
                setDgData([]);
            }
            saveApprovalFiltersToCache(filterDataRef.current);
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
            const updatedList = [
                { label: 'Select...', value: '' },
                ...response.data.map((item: any) => ({
                    label: item.terr_name,
                    value: item.terr_code
                })),
            ];
            setSelectBoxData((prevState: any) => ({ ...prevState, terr: updatedList }));
        } catch (error) {
            return;
        }
        setLoading(false);
    };

    const GetPcaStatusData = async () => {
        setLoading(true);
        const filterData = filterDataRef.current;
        const data: any = {
            status: filterData.mainStatus,
            type: 'HOCOMMERCIAL',
        };
        try {
            const response: any = await Tlv.GetTlvStatusList(data);
            const updatedList = [
                { label: 'Select...', value: '' },
                ...response.data.map((item: any) => ({
                    label: item.lov_value,
                    value: item.lov_code
                })),
            ];
            setSelectBoxData((prevState: any) => ({ ...prevState, aprvStatus: updatedList }));
        } catch (error) {
            return;
        }
        setLoading(false);
    };

    const tryRestoreHoCommercialApprovalFilters = async (depotList: any[]): Promise<boolean> => {
        const f = tlvHoCommercialApprovalFiltersCache;
        if (!f) return false;
        if (f.depotCode && !depotList.some((d: any) => d.value === f.depotCode)) return false;
        await GetApplicableTerritory(f.depotCode);
        const restored = snapApprovalFilters(f);
        filterDataRef.current = restored;
        flushSync(() => setFilterData(restored));
        await GetPcaStatusData();
        await GetTlcHoCommercialApprovalListData();
        return true;
    };

    const loadHoCommercialApprovalListInitialOrRestore = async (depotList: any[]) => {
        const returnFromDetails = sessionStorage.getItem(TLV_HO_COMMERCIAL_APPROVAL_RETURN_FROM_DETAILS_KEY) === '1';
        sessionStorage.removeItem(TLV_HO_COMMERCIAL_APPROVAL_RETURN_FROM_DETAILS_KEY);
        if (!returnFromDetails) {
            tlvHoCommercialApprovalFiltersCache = null;
            GetPcaStatusData().then(() => GetTlcHoCommercialApprovalListData());
            return;
        }
        const restored = await tryRestoreHoCommercialApprovalFilters(depotList);
        if (!restored) {
            GetPcaStatusData().then(() => GetTlcHoCommercialApprovalListData());
        }
    };

    const GetApplicableDepot = async () => {
        setLoading(true);
        const data: any = {
            user_id: user.user_id,
            region: '',
            app_id: '15',
        };
        let updatedDepotList: any[] = [];
        try {
            const response: any = await Epca.GetApplicableDepotList(data);
            updatedDepotList = [
                { label: 'Select...', value: '' },
                ...response.data.map((item: any) => ({
                    label: item.depot_name,
                    value: item.depot_code
                })),
            ];
            setSelectBoxData((prevState: any) => ({ ...prevState, depot: updatedDepotList }));
        } catch (error) {
            return;
        } finally {
            if (updatedDepotList.length > 0) {
                void loadHoCommercialApprovalListInitialOrRestore(updatedDepotList);
            } else {
                setLoading(false);
            }
        }
    };

    const handleSearch = () => { GetTlcHoCommercialApprovalListData(); };

    const { setCustomerProfile } = EpcaCustomerStore((state) => state);

    const setValueInSessionStorage = (key: string, value: string) => {
        const storage = sessionStorage;
        storage.setItem(key, JSON.stringify(value));
    };

    const navigate = useNavigate();

    const selectedCustomer = useCallback(
        (Lead: any) => {
            saveApprovalFiltersToCache(filterData);
            sessionStorage.setItem('tlvDetailsReturnPath', TLV_DETAILS_RETURN_HO_COMMERCIAL_APPROVAL);
            setCustomerProfile(Lead);
            setValueInSessionStorage('epcaTLVDtlList', Lead);
            setValueInSessionStorage('epcaTLVDtlEntryType', 'View');
            navigate('/Protecton/TLV/TLVRevisionRequestDetails/');
        },
        [filterData, setCustomerProfile, navigate]
    );

    const handleEditChange = (e: ChangeEvent<HTMLInputElement>, rowIndex: number, field: string) => {
        const { value } = e.target;
        setDgData((prevData: any[]) => prevData.map((row, index) => (index === rowIndex ? { ...row, [field]: value } : row)));
    };

    async function TlvApprove(data: { depot_regn?: string; depot_name?: string; dlr_terr_code?: string; dlr_dealer_code?: string; dlr_dealer_name?: string; current_tlv?: number; td_proposed_tlv: any; credit_days?: number; td_proposed_cr_days: any; dropdown_field: any; status_value?: string; td_auto_id?: number; td_remarks: any; auto_id: any; file_doc?: string; approved_type?: any; }) {
        setLoading(true);
        console.log(data)
        commonAlert('Are you sure you want to approve this TLV?', '', 'warning').then(async (result: any) => {
            if (result.value) {
                const param: any = {
                    tlv_id: String(data.auto_id),
                    approval_status: data.approved_type != '' ? data.approved_type : '',
                    remarks: data.td_remarks != '' ? data.td_remarks : '',
                    term_id: '0',
                    Proposed_tlv: String(data.td_proposed_tlv) != '' ? data.td_proposed_tlv : '',
                    proposed_credit_day: String(data.td_proposed_cr_days) != '' ? data.td_proposed_cr_days : '',
                };

                const response: any = await Tlv.TlvRevisionApproval(param);

                if (response.response_message) {
                    commonSuccessToast('TLV Revision Request Approved Successfully.');
                    GetTlcHoCommercialApprovalListData();
                    setFilterData((prevState: any) => ({ ...prevState, depotCode: '', terrCode: '', billToCode: '', dealerCode: '', dealerName: '' }));
                }
            }
        });
        setLoading(false);
    }

    async function TlvReject(data: { depot_regn?: string; depot_name?: string; dlr_terr_code?: string; dlr_dealer_code?: string; dlr_dealer_name?: string; current_tlv?: number; td_proposed_tlv: any; credit_days?: number; td_proposed_cr_days: any; status_value?: string; td_auto_id?: number; td_remarks: any; auto_id: any; file_doc?: string; rejected_type?: any; }) {
        setLoading(true);
        commonAlert('Are you sure you want to reject this TLV?', '', 'warning').then(async (result: any) => {
            if (result.value) {
                const param: any = {
                    tlv_id: String(data.auto_id),
                    approval_status: data.rejected_type != '' ? data.rejected_type : '',
                    remarks: data.td_remarks != '' ? data.td_remarks : '',
                    term_id: '0',
                    Proposed_tlv: String(data.td_proposed_tlv) != '' ? data.td_proposed_tlv : '',
                    proposed_credit_day: String(data.td_proposed_cr_days) != '' ? data.td_proposed_cr_days : '',
                };

                const response: any = await Tlv.TlvRevisionApproval(param);

                if (response.response_message) {
                    commonSuccessToast('TLV Revision Request Rejected Successfully.');
                    GetTlcHoCommercialApprovalListData();
                    setFilterData((prevState: any) => ({ ...prevState, depotCode: '', terrCode: '', billToCode: '', dealerCode: '', dealerName: '' }));
                }
            }
        });
        setLoading(false);
    }

    async function TlvRevert(data: { depot_regn?: string; depot_name?: string; dlr_terr_code?: string; dlr_dealer_code?: string; dlr_dealer_name?: string; current_tlv?: number; td_proposed_tlv: any; credit_days?: number; td_proposed_cr_days: any; status_value?: string; td_auto_id?: number; td_remarks: any; auto_id: any; file_doc?: string; reverted_type?: any; }) {
        setLoading(true);
        commonAlert('Are you sure you want to revert this TLV?', '', 'warning').then(async (result: any) => {
            if (result.value) {
                const param: any = {
                    tlv_id: String(data.auto_id),
                    approval_status: data.reverted_type != '' ? data.reverted_type : '',
                    remarks: data.td_remarks != '' ? data.td_remarks : '',
                    term_id: '0',
                    Proposed_tlv: String(data.td_proposed_tlv) != '' ? data.td_proposed_tlv : '',
                    proposed_credit_day: String(data.td_proposed_cr_days) != '' ? data.td_proposed_cr_days : '',
                };

                const response: any = await Tlv.TlvRevisionApproval(param);

                if (response.response_message) {
                    commonSuccessToast('TLV Revision Request Reverted Successfully.');
                    GetTlcHoCommercialApprovalListData();
                    setFilterData((prevState: any) => ({ ...prevState, depotCode: '', terrCode: '', billToCode: '', dealerCode: '', dealerName: '' }));
                }
            }
        });
        setLoading(false);
    }

    const GetTlvRevisionLog = async (autoid: string) => {
        setLoading(true);
        const data: any = {
            auto_id: autoid,
        };
        try {
            const response: any = await Tlv.GetTlvRevisionLogDetails(data);
            setTlvLogData(response.data.table);
        } catch (error) {
            return;
        }
        setLoading(false);
    };

    const CreditTermCell = ({ row }: any) => {
        const [options, setOptions] = useState<any[]>([]);
        const [selectedOption, setSelectedOption] = useState<any>(null);
        const [isFetching, setIsFetching] = useState<boolean>(false);

        useEffect(() => {
            let isMounted = true;
            const fetchDropdownOptions = async () => {
                const depotCode = row.original.depot_code || filterData?.depotCode;
                const billToCode = row.original.dlr_bill_to;
                if (depotCode && billToCode) {
                    setIsFetching(true);
                    const data: any = {
                        DepotCode: depotCode,
                        BillToCode: billToCode,
                    };
                    try {
                        const response: any = await TlvHoCom.TlvGetTermDetails(data);
                        const list =
                            response?.data?.table != null
                                ? [
                                      { label: 'Select...', value: '' },
                                      ...response.data.table.map((item: any) => ({
                                          label: item.tpt_description,
                                          value: item.tpt_term_id,
                                          tpt_description: item.tpt_description,
                                          tpt_term_id: item.tpt_term_id,
                                      })),
                                  ]
                                : [];
                        if (!isMounted) return;
                        setOptions(list);
                        const preselected = list.find((opt) => opt.value === row.original.td_term_id) || null;
                        setSelectedOption(preselected);
                    } catch (error) {
                        if (!isMounted) return;
                        setOptions([]);
                        setSelectedOption(null);
                    } finally {
                        setIsFetching(false);
                    }
                } else {
                    setOptions([]);
                    setSelectedOption(null);
                }
            };

            fetchDropdownOptions();
            return () => {
                isMounted = false;
            };
        }, [row.original.depot_code, filterData?.depotCode, row.original.dlr_bill_to, row.original.td_term_id]);

        if (!(row.original.td_proposed_cr_days > 0)) {
            return <span className="text-gray-500">N/A</span>;
        }

        return (
            <Select
                className="text-sm"
                isSearchable={true}
                value={selectedOption}
                options={options}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{ menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) }}
                onChange={(opt: any) => {
                    setSelectedOption(opt);
                    setDgData((prev: any[]) =>
                        prev.map((r, i) =>
                            i === row.index ? { ...r, td_term_id: opt?.value ?? '', td_term_desc: opt?.label ?? '' } : r
                        )
                    );
                }}
            />
        );
    };

    const columns = useMemo<MRT_ColumnDef<TLVType>[]>(
        () => [
            {
                accessorKey: 'depot_regn',
                header: 'Region',
                size: 50,
            },
            {
                accessorKey: 'depot_name',
                header: 'Depot',
                size: 130,
            },
            {
                accessorKey: 'dlr_terr_code',
                header: 'Territory',
                size: 70,
            },
            {
                accessorKey: 'dlr_dealer_code',
                header: 'Acct. No.',
                size: 70,
            },
            {
                accessorKey: 'dlr_dealer_name',
                header: 'Dealer Name',
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
                size: 70,
            },
            {
                accessorKey: 'current_tlv',
                header: 'Current TLV',
                size: 70,
            },
            {
                accessorKey: 'td_proposed_tlv',
                header: 'Requested TLV',
                size: 70,
                Cell: ({ row }) =>
                    row.original.td_proposed_tlv !== null && row.original.td_proposed_tlv !== undefined ? (
                        <input className="tableInput" type="number" value={row.original.td_proposed_tlv} onChange={(e) => handleEditChange(e, row.index, 'td_proposed_tlv')} />
                    ) : null,
            },
            {
                accessorKey: 'credit_days',
                header: 'Credit Days',
                size: 50,
            },
            {
                accessorKey: 'td_proposed_cr_days',
                header: 'Proposed Credit Days',
                size: 120,
                Cell: ({ row }) =>
                    row.original.td_proposed_cr_days !== null && row.original.td_proposed_cr_days !== undefined ? (
                        <input className="tableInput" type="text" value={row.original.td_proposed_cr_days} onChange={(e) => handleEditChange(e, row.index, 'td_proposed_cr_days')} />
                    ) : (
                        <span className="text-gray-500">N/A</span>
                    ),
            },
            {
                accessorKey: 'dropdown_field',
                header: 'Credit Term',
                size: 130,
                Cell: ({ row }: any) => {
                    return <CreditTermCell row={row} />;
                },
            },
            {
                accessorKey: 'status_value',
                header: 'Status',
                size: 90,
            },
            {
                accessorKey: 'td_remarks',
                header: 'Remarks',
                size: 100,
                Cell: ({ row }) => <input className="tableInput" type="text" value={row.original.td_remarks} onChange={(e) => handleEditChange(e, row.index, 'td_remarks')} />,
            },
            {
                id: 'action',
                header: 'Action',
                size: 120,

                Cell: ({ row }: any) => {
                    const status = row.original.status_value;
                    const downloadLink = row.original.file_doc ? `https://bpilmobile.bergerindia.com/VIRTUAL_DOCS/PROTECTON_MOB_APP/${row.original.file_doc}` : null;

                    const shouldShowButton = !status.includes('APPROVED') && !status.includes('REJECTED');

                    // const shouldEditShowButton = !status.includes('APPROVED') && !status.includes('REJECTED') && row.original.td_proposed_cr_days > 0;

                    // const handleEditClick = async () => {
                    //     setLoading(true);
                    //     // setIsEditMode(true);
                    //     const data: any = {
                    //         DepotCode: row.original.depot_code,
                    //         BillToCode: row.original.dlr_bill_to,
                    //     };
                    //     try {
                    //         const response: any = await TlvHoCom.TlvGetTermDetails(data);
                    //         if (response.data.table != null && response.data.table != undefined) {
                    //             const updatedList = [
                    //                 { label: 'Select...', value: '' },
                    //                 ...response.data.table.map((item: any) => ({
                    //                     label: item.tpt_description,
                    //                     value: item.tpt_term_id,
                    //                     tpt_description: item.tpt_description,
                    //                     tpt_term_id: item.tpt_term_id,
                    //                 })),
                    //             ];
                    //             setDropdownOptions(updatedList);
                    //         } else {
                    //             setDropdownOptions([]);
                    //         }
                    //     } catch (error) { }
                    //     setLoading(false);
                    // };

                    return (
                        <div className="flex justify-end">
                            <Group className="tableGroupBtn">
                                <Tooltip label="View" position="top" withArrow>
                                    <IconEye
                                        size={17}
                                        className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                                        onClick={() => {
                                            GetTlvRevisionLog(row.original.auto_id);
                                            setShowTlvModal(true);
                                        }}
                                    />
                                </Tooltip>
                                {shouldShowButton && (
                                    <Tooltip label="Approve" position="top" withArrow>
                                        <IconCheck
                                            size={17}
                                            className="text-green-600 cursor-pointer hover:text-green-800 transition-colors"
                                            onClick={() => TlvApprove(row.original)}
                                        />
                                    </Tooltip>
                                )}
                                {shouldShowButton && (
                                    <Tooltip label="Reject" position="top" withArrow>
                                        <IconX
                                            size={17}
                                            className="text-red-600 cursor-pointer hover:text-red-800 transition-colors"
                                            onClick={() => TlvReject(row.original)}
                                        />
                                    </Tooltip>
                                )}
                                {downloadLink && (
                                    <Tooltip label="Download" position="top" withArrow>
                                        <a href={downloadLink} target="_blank" rel="noopener noreferrer">
                                            <IconDownload
                                                size={17}
                                                className="text-yellow-600 cursor-pointer hover:text-yellow-800 transition-colors"
                                            />
                                        </a>
                                    </Tooltip>
                                )}
                                {shouldShowButton && (
                                    <Tooltip label="Revert" position="top" withArrow>
                                        <IconRotate
                                            size={17}
                                            className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
                                            onClick={() => TlvRevert(row.original)}
                                        />
                                    </Tooltip>
                                )}
                                {/* {shouldEditShowButton && (
                                    <Tooltip label="Edit" position="top" withArrow>
                                        <IconEdit 
                                            size={20} 
                                            className="text-violet-600 cursor-pointer hover:text-violet-800 transition-colors"
                                            onClick={handleEditClick}
                                        />
                                    </Tooltip>
                                )} */}
                            </Group>
                        </div>
                    );
                },
            },
        ],
        [selectedCustomer]
    );

    const table = useMantineReactTable<TLVType>({
        columns,
        data: dgData,
        enableColumnResizing: true,
        enableStickyHeader: true,
        enableTopToolbar: false,
        enableSorting: false,
        enableColumnActions: false,
        columnResizeMode: 'onChange'
    });

    const BesicDetailTable = ({ data }: any) => {
        return (
            <table className="custTableView w-full border-collapse">
                <thead>
                    <tr>
                        <th className="w-1/5 text-center align-middle">Region</th>
                        <th className="w-1/5 text-center align-middle">Depot</th>
                        <th className="w-1/5 text-center align-middle">Territory</th>
                        <th className="w-1/5 text-center align-middle">Acct. No.</th>
                        <th className="w-1/5 text-center align-middle">Dealer Name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="text-center align-middle">{data[0].depot_regn}</td>
                        <td className="text-center align-middle">{data[0].depot_name}</td>
                        <td className="text-center align-middle">{data[0].terr_code}</td>
                        <td className="text-center align-middle">{data[0].dealer_code}</td>
                        <td className="text-center align-middle">{data[0].dealer_name}</td>
                    </tr>
                </tbody>
            </table>
        );
    };

    const TLVDetailsGrid = ({ data }: any) => {
        return (
            <table className="custTableView w-full border-collapse">
                <thead>
                    <tr>
                        <th className="w-[15%] text-center">Date</th>
                        <th className="w-[10%] text-center">Current TLV</th>
                        <th className="w-[10%] text-center">Requested TLV</th>
                        <th className="w-[10%] text-center">Credit Days</th>
                        <th className="w-[10%] text-center">Proposed Credit Days</th>
                        <th className="w-[15%] text-center">Status</th>
                        <th className="w-[30%] text-center">Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row: { created_date: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; current_tlv: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; proposed_tlv: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; credit_days: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; proposed_cr_days: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; status_value: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; remarks: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
                            <tr key={index}>
                                <td className="text-center align-middle">{row.created_date}</td>
                                <td className="text-center align-middle">{row.current_tlv}</td>
                                <td className="text-center align-middle">{row.proposed_tlv}</td>
                                <td className="text-center align-middle">{row.credit_days}</td>
                                <td className="text-center align-middle">{row.proposed_cr_days}</td>
                                <td className="text-center align-middle">{row.status_value}</td>
                                <td className="text-center align-middle">{row.remarks}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="text-center align-middle">
                                No record(s) found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    };

    useEffect(() => {
        setSelectBoxData((prevState: any) => ({
            ...prevState,
            terr: [{ label: 'Select...', value: '' }],
        }));
        void GetApplicableTerritory(filterData?.depotCode ?? '');
    }, [filterData?.depotCode]);

    useEffect(() => {
        GetApplicableDepot();
    }, []);

    useEffect(() => {
        filterData?.mainStatus && GetPcaStatusData();
    }, [filterData?.mainStatus]);

    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-2">
                <h5 className="text-lg font-semibold dark:text-white-light">TLV Revision HO Commercial Approval</h5>
            </div>

            <div className="bg-white rounded-lg px-4 py-1 shadow-md mb-2">
                <CommonFilterComponent selectBoxData={selectBoxData} filterData={filterData} setFilterData={setFilterData} handleSearch={handleSearch} />
            </div>

            <div className="mb-2 max-h-[50vh] overflow-y-auto p-pl-table-item">
                <MantineReactTable table={table} />
            </div>

            {/* Modal PopUp */}
            <div>
                <Transition appear show={showTlvModal} as={Fragment}>
                    <Dialog as="div" open={showTlvModal} onClose={() => setShowTlvModal(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 "
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div id="slideIn_down_modal" className="fixed inset-0 z-[200] overflow-y-auto bg-[black]/60">
                            <div className="flex min-h-screen items-start justify-center px-4">
                                <Dialog.Panel className="panel animate__animated animate__slideInDown my-8 w-full max-w-7xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="grid-cols-12 items-center justify-between bg-secondary-light px-2 py-1 md:flex">
                                        <div className="flex items-center justify-between bg-secondary-light px-2 w-full">
                                            <div className="flex">
                                                {/* <img className="mr-2 h-8 w-auto" src={GetProdDevImgRouteBuilder('/assets/images/meeting.png')} alt="" /> */}
                                                <h5 className="text-lg font-bold">View</h5>
                                            </div>
                                            <button onClick={() => setShowTlvModal(false)} type="button" className="justify-end text-white-dark hover:text-dark">
                                                <IconX />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="px-3 pt-2">
                                        <div className="table-responsive pb-2">
                                            <BesicDetailTable data={tlvLogData} />
                                        </div>
                                        <div className="table-responsive">
                                            <TLVDetailsGrid data={tlvLogData} />
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
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

export default TLVRevisionHoCommercialApproval1