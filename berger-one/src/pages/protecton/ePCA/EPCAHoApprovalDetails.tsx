import { UseAuthStore } from '../../../services/store/AuthStore';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Select from 'react-select';
import * as Epca from '../../../services/api/protectonEpca/EpcaList';
import * as EpcaDetails from '../../../services/api/protectonEpca/EpcaDetails';
import * as EpcaList from '../../../services/api/protectonEpca/EpcaList';
import { GetProdDevImgRouteBuilder } from '../../../services/functions/getProdDevUrlBuilder';
import { Button } from '@mantine/core';
import * as EpcaDepotApproval from '../../../services/api/protectonEpca/EPCADepotApproval';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import { Select as MantineSelect } from '@mantine/core';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { IoMdSave } from 'react-icons/io';
import { commonAlert } from '../../../services/functions/commonAlert';
import { commonErrorToast, commonSuccessToast } from '../../../services/functions/commonToast';
import { FaInfoCircle } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { IoReturnUpBack } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';

const EPCAHoApprovalDetails = () => {
    const user = UseAuthStore((state: any) => state.userDetails);
    const navigate = useNavigate();

    // const isItemDetailsFetched = useRef(false);
    const [customerDetails, setCustomerDetails] = useState<any>({});
    const [data, setData] = useState<any>([]);

    const [loading, setLoading] = useState(false);
    const [depot, setDepot] = useState<any>([]);
    const [applTerr, setApplTerr] = useState<any>([]);
    const [dealer, setDealer] = useState<any>([]);
    const [billToData, setbillToData] = useState<any>([]);
    const [approveStatus, setApproveStatus] = useState<any>([]);
    const mainStatus = [
        { label: 'Pending', value: 'PENDING' },
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Rejected', value: 'REJECTED' },
    ];
    const [calculatedGCData, setCalculatedGCData] = useState<any>([]);
    const [header, setHeader] = useState('');
    const [header1, setHeader1] = useState('');
    const [tableData, setTableData] = useState<any[]>([]);
    const [table1Data, setTable1Data] = useState<any[]>([]);
    const [showPCAModal, setShowPCAModal] = useState(false);
    const [pcaBesicData, setPcaBesicData] = useState<any[]>([]);
    const [pcaDetailData, setPcaDetailData] = useState<any[]>([]);

    const GetePCADetailsData = async (cd: any) => {
        setLoading(true);
        const data1: any = {
            depotCode: cd?.depot_code || '',
            territoryCode: cd?.dlr_terr_code || '',
            billToCode: cd?.dlr_bill_to || '',
            dealerCode: cd?.dlr_dealer_code || '',
            dealerName: cd?.dlr_dealer_name || '',
            sblCode: cd?.dlr_sbl || '',
            approvedStatus: cd?.aprv_status || '',
            mainStatus: cd?.main_status || ''
        };
        try {
            const response: any = await EpcaList.GetePCAHoApprovalDetails(data1);
            if (response && response.data != null && response.data != undefined) {
                setHeader(response.data.table[0]?.lpo_yr_month_desc);
                setHeader1(response.data.table[0]?.wav_yr_month_desc);
                setData(response.data.table.map((t: any) => ({ ...t, currentStatus: 'A' })))
            }
        } catch (error) {
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const GetApplicableDepot = async () => {
        // setLoading(true);
        const data: any = {
            user_id: user.user_id,
            region: '',
            app_id: '15',
        };
        try {
            const response: any = await Epca.GetApplicableDepotList(data);
            setDepot(response.data);
        } catch (error) {
            setDepot([]);
        } finally {
            // setLoading(false);
        }
    };

    const GetApplicableTerritory = async ({ cd }: any) => {
        // setLoading(true);
        const data: any = {
            user_id: user.user_id,
            depot_code: cd?.depot_code,
            app_id: '15',
        };
        try {
            const response: any = await Epca.GetApplicableTerrList(data);
            setApplTerr(response.data)
        } catch (error) {
            setApplTerr([]);
        } finally {
            // setLoading(false);
        }
    };

    const GetDealerList = async (cd: any) => {
        // setLoading(true);
        const data: any = {
            depot_code: cd?.depot_code,
            terr_code: cd?.dlr_terr_code,
            sbl_code: '4',
        };
        try {
            const response: any = await EpcaDetails.GetPcaDealersList(data);
            setDealer(response.data)
        } catch (error) {
            setDealer([]);
        } finally {
            // setLoading(false);
        }
    };

    const GetApplicableBillto = async (cd: any) => {
        // setLoading(true);
        const data: any = {
            depot_code: cd?.depot_code,
            dealer_code: cd?.dlr_dealer_code,
        };
        try {
            const response: any = await EpcaDetails.GetPcaBillToList(data);
            setbillToData(response.data);
        } catch (error) {
            setbillToData([]);
        } finally {
            // setLoading(false);
        }
    };

    const GetPcaStatusData = async () => {
        // setLoading(true);
        const data: any = {
            app_id: '15',
        };
        try {
            const response: any = await Epca.GetPcaStatusList(data);
            setApproveStatus(response.data);
            // setApproveStatus(response.data.filter((item: any) => item.lov_field1_value === cd?.main_status && !item.lov_value.includes('HO')))
        } catch (error) {
            setApproveStatus([]);
        } finally {
            // setLoading(false);
        }
    };

    const GetFactorydata = async (skucode: string) => {
        const data = {
            sku_code: skucode,
            app_id: '15',
        };
        try {
            const response: any = await EpcaDetails.GetFactoryListBySKU(data);
            if (response.data && Array.isArray(response.data)) {
                return response.data.map((item: any) => ({
                    label: item.org_name,
                    value: item.org_code,
                }));
            } else return [];
        } catch (error) {
            return [];
        }
    };

    const GetPcaDetailsView = async (skucode: string, autoid: any) => {
        setLoading(true);
        const data: any = {
            skuCode: skucode,
            autoId: autoid,
        };
        try {
            const response: any = await EpcaDepotApproval.GetePCADetailsView(data);
            setPcaBesicData(response.data.table);
            setPcaDetailData(response.data.table1);
        } catch (error) {
            setPcaBesicData([]);
            setPcaDetailData([]);
        } finally {
            setLoading(false);
        }
    };

    const BesicDetailTable = ({ data }: any) => {
        return (
            <table className="custTableView w-full border-collapse">
                <thead>
                    <tr>
                        <th style={{ width: '25%', textAlign: 'center', verticalAlign: 'middle' }}>PROJECT NAME</th>
                        <th style={{ width: '25%', textAlign: 'center', verticalAlign: 'middle' }}>SKU CODE</th>
                        <th style={{ width: '25%', textAlign: 'center', verticalAlign: 'middle' }}>SKU NAME</th>
                        <th style={{ width: '8%', textAlign: 'center', verticalAlign: 'middle' }}>UOM</th>
                        <th style={{ width: '10%', textAlign: 'center', verticalAlign: 'middle' }}>PACK SIZE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{data[0]?.project_name}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{data[0]?.sku_code}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{data[0]?.sku_desc}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{data[0]?.sku_uom}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{data[0]?.sku_pack_size}</td>
                    </tr>
                </tbody>
            </table>
        );
    };

    const PCADetailsGrid = ({ data }: any) => {
        return (
            <table className="custTableView w-full border-collapse">
                <thead>
                    <tr>
                        <th style={{ width: '15%', textAlign: 'center' }}>Date</th>
                        <th style={{ width: '10%', textAlign: 'center' }}>Rate/Pack</th>
                        <th style={{ width: '10%', textAlign: 'center' }}>NOP</th>
                        <th style={{ width: '10%', textAlign: 'center' }}>REQUIRED FROM</th>
                        {/* <th style={{ width: '10%', textAlign: 'center' }}>GC @LPO Sep-23</th>
                        <th style={{ width: '10%', textAlign: 'center' }}>GC @W.Avg Jul-24</th> */}
                        <th style={{ width: '10%', textAlign: 'center' }}>Valid From</th>
                        <th style={{ width: '10%', textAlign: 'center' }}>Valid Till</th>
                        <th style={{ width: '15%', textAlign: 'center' }}>Status</th>
                        <th style={{ width: '20%', textAlign: 'center' }}>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row: { created_date: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; pdl_rate: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; pdl_qty: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; pdl_factory: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; pdl_valid_from: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; pdl_valid_till: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; pdl_status: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; pdl_remarks: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.created_date}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.pdl_rate}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.pdl_qty}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.pdl_factory}</td>
                                {/* GC @LPO Sep-23 */}
                                {/* <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.pdl_valid_from}</td> */}
                                {/* GC @W.Avg Jul-24 */}
                                {/* <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.pdl_valid_from}</td> */}
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.pdl_valid_from}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.pdl_valid_till}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.pdl_status}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.pdl_remarks}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={Number(8)} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                No record(s) found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    };

    const handleBackButton = () => {
        // commonAlert('Are you sure?', '', 'warning').then(async (result: any) => {
        //     if (result.value) 
        sessionStorage.setItem('epcaHoApprovalListReturnFromDetails', '1');
        navigate('/Protecton/ePCA/EPCAHOApprovalList/');
        // });
        setLoading(false);
    };

    const hasEditableRows = useMemo(() => {
        return data.some((row: { editable_yn: string; }) => row.editable_yn === 'Y');
    }, [data]);

    const handleSearch = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        GetePCADetailsData(customerDetails);
    };

    const handleEditChange = (e: any, rowIndex: number, field: string) => {
        const value = field === "valid_till" || field === "factory_code" ? e : e.target.value;
        // const value = e instanceof Date ? e : e.target.value;
        setData((prevData: any[]) => prevData.map((row: any, index: any) => (index === rowIndex ? { ...row, [field]: value } : row)));
    };

    type PcaDetailsType = {
        currentStatus: string,
        bill_to: string;
        dealer_code: string;
        dealer_name: string;
        sku_id: string;
        sku_desc: string;
        sku_uom: string;
        sku_pack_size: string;
        factory_code: string;
        factory: string;
        rate: string;
        qty: string;
        valid_from: string;
        valid_till: string;
        status_code: string;
        status_value: string;
        remarks: string;
        pd_auto_id: string;
        pd_mrp: string;
        submit_yn: string;
        pd_resubmit_yn: string;
        pca_auto_id: any;
        approved_type: string;
        rejected_type: string;
        editable_yn: string;
        rate_lpo: number;
        rate_wav: number;

        lpo_yr_month: string;
        lpo_material_cost: number;
        lpo_packing_cost: number;
        lpo_freight_cost: number;
        wav_yr_month: string;
        wav_material_cost: number;
        wav_packing_cost: number;
        wav_overhead_cost: number;
        wav_freight_cost: number;
    };

    const columns = useMemo<MRT_ColumnDef<PcaDetailsType>[]>(
        () => [
            {
                accessorKey: 'sku_desc',
                header: 'SKU Name',
                size: 50,
                minSize: 10,
                maxSize: 60,
            },
            {
                accessorKey: 'sku_uom',
                header: 'UOM',
                size: 10,
                minSize: 10,
                maxSize: 60,
            },
            {
                accessorKey: 'sku_pack_size',
                header: 'Pack Size',
                size: 23,
                minSize: 10,
                maxSize: 60,
            },
            {
                accessorKey: 'sku_pca',
                header: 'Declared PCA(Lt/Kg)',
                size: 40,
                minSize: 10,
                maxSize: 60,
            },
            {
                accessorKey: 'rate',
                header: 'Rate (Lt/Kg)',
                size: 25,
                minSize: 10,
                maxSize: 60,
                Cell: ({ row }) => {
                    const handleChange = (e: { target: { value: any; }; }) => {
                        (async () => {
                            const requestData = {
                                sku_code: row.original.sku_id,
                                factory_code: row.original.factory_code,
                                yr_month_lpo: row.original.lpo_yr_month,
                                yr_month_wav: row.original.wav_yr_month,
                                rate: e.target.value,
                            };
                            try {
                                const response: any = await EpcaDetails.GetCalculatedGC(requestData);
                                const notExistData = calculatedGCData.filter((sku: { table: { sku_code: any; }[]; }) => sku.table[0].sku_code !== response.data.table[0].sku_code)
                                setCalculatedGCData([...notExistData, response.data]);
                            } catch (error) {
                                setCalculatedGCData([]);
                            }
                        })();
                        const value = e.target.value;

                        // Allow only digits and a single decimal point
                        const validValue = /^(\d*\.?\d*)$/.test(value);

                        if (validValue) {
                            handleEditChange(e, row.index, 'rate');
                        }
                    };

                    return (
                        <input
                            autoComplete="off"
                            className="tableInput"
                            type="text" // Using text so we can control the input
                            value={row.original.rate}
                            onChange={handleChange}
                            pattern="^\d*\.?\d*$" // RegEx pattern for validation
                            title="Enter a valid number (0-9 and a single decimal)"
                            inputMode="decimal" // This hints to the browser to show a number pad for decimals on mobile
                        />
                    );
                },
            },
            {
                accessorKey: 'qty',
                header: 'NOP(Lt/Kg)',
                size: 25,
                minSize: 10,
                maxSize: 60,
                Cell: ({ row }) => {
                    const handleChange = (e: any) => {
                        handleEditChange(e, row.index, 'qty');
                    };

                    return <input className="tableInput" autoComplete="off" type="number" value={row.original.qty} onChange={handleChange} />;
                },
            },
            {
                accessorKey: 'rate_lpo',
                header: `Rate LPO (${header})`,
                size: 35,
                minSize: 10,
                maxSize: 60,
                Cell: ({ cell, row }) => {
                    const [isHovered, setIsHovered] = useState(false);
                    const iconRef = useRef<HTMLDivElement | null>(null);
                    const currentRate = row.original.rate || 0;
                    const rateType = cell.row.original.rate_lpo;

                    const calculateValue = (currentRate: any, rateType: number | null) => {
                        if (rateType == null) return 0;
                        if (currentRate == null || currentRate == 0) return 0;
                        return ((currentRate - rateType) / currentRate) * 100;
                    };

                    const displayedValue = calculateValue(currentRate, rateType);

                    const getTooltipPosition = () => {
                        if (iconRef.current) {
                            const rect = iconRef.current.getBoundingClientRect();
                            return {
                                top: rect.bottom,
                                left: rect.left,
                            };
                        }
                        return { top: 0, left: 0 };
                    };

                    const onMouseEnterDetails = () => {
                        setIsHovered(true);
                        setTableData([]);
                        setTable1Data([]);
                        calculatedGCAPIcall();
                    };

                    const calculatedGCAPIcall = async () => {
                        const requestData = {
                            sku_code: row.original.sku_id,
                            factory_code: row.original.factory_code,
                            yr_month_lpo: row.original.lpo_yr_month,
                            yr_month_wav: row.original.wav_yr_month,
                            rate: row.original.rate,
                        };
                        try {
                            const response: any = await EpcaDetails.GetCalculatedGC(requestData);
                            if (response && response.data) {
                                setTableData(response.data.table1 || []);
                                setTable1Data(response.data.table2 || []);
                            } else {
                                setTableData([]);
                                setTable1Data([]);
                            }
                        } catch (error) {
                            setTableData([]);
                            setTable1Data([]);
                        }
                    };

                    // const GetEpcaGpGcRateDtlsData = async (data: any) => {
                    //     try {
                    //         const response: { data: ApiResponse } = await EpcaList.GetEpcaGpGcRateDtls(data);
                    //         if (response && response.data) {
                    //             setTableData(response.data.table || []);
                    //             setTable1Data(response.data.table1 || []);
                    //         } else {
                    //             setTableData([]);
                    //             setTable1Data([]);
                    //         }
                    //     } catch (error) { }
                    //     setLoading(false);
                    // };

                    const getColor = (value: number) => {
                        return value > 30 ? 'gray' : '#D98880';
                    };

                    const onMouseLeaveDetails = () => {
                        setIsHovered(false);
                        setTableData([]);
                        setTable1Data([]);
                    };

                    return (
                        <div className="relative">
                            <div ref={iconRef} className="cursor-pointer rounded p-2" onMouseEnter={() => onMouseEnterDetails()} onMouseLeave={onMouseLeaveDetails}>
                                <div className="flex items-center" style={{ color: getColor(displayedValue) }}>
                                    {/* <FaCircleInfo className="mr-4" /> */}
                                    <FaInfoCircle />
                                    {isNaN(displayedValue) || displayedValue === 0 ? 'NA' : displayedValue.toFixed(2)}
                                </div>
                            </div>

                            {isHovered && (
                                <div
                                    className="fixed z-10 rounded bg-white shadow-lg"
                                    style={{
                                        top: `${getTooltipPosition().top}px`,
                                        left: `${getTooltipPosition().left}px`,
                                        pointerEvents: 'none',
                                    }}
                                >
                                    <table style={{ width: 350 }} className="smTable border-collapse">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "30%" }} className="whitespace-nowrap">SKU Code</th>
                                                <th style={{ width: "30%" }} className="whitespace-nowrap">Material Cost</th>
                                                <th style={{ width: "20%" }} className="whitespace-nowrap">Packing Cost</th>
                                                <th style={{ width: "20%" }} className="whitespace-nowrap">Freight Cost</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="border-t px-4 py-2">{item.lpo_sku_code || 'N/A'}</td>
                                                    <td className="border-t px-4 py-2">{item.lpo_material_cost || '-'}</td>
                                                    <td className="border-t px-4 py-2">{item.lpo_packing_cost || '-'}</td>
                                                    <td className="border-t px-4 py-2">{item.lpo_freight_cost || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'rate_wav',
                header: `Rate WAV (${header1})`,
                size: 35,
                minSize: 10,
                maxSize: 60,
                Cell: ({ cell, row }) => {
                    const [isHovered, setIsHovered] = useState(false);
                    const iconRef = useRef<HTMLDivElement | null>(null);
                    const currentRate = row.original.rate || 0;
                    const rateType = cell.row.original.rate_wav;

                    const calculateValue = (currentRate: any, rateType: number | null) => {
                        if (rateType == null) return 0;
                        if (currentRate == null || currentRate == 0) return 0;
                        return ((currentRate - rateType) / currentRate) * 100;
                    };

                    const displayedValue = calculateValue(currentRate, rateType);

                    const getTooltipPosition = () => {
                        if (iconRef.current) {
                            const rect = iconRef.current.getBoundingClientRect();
                            return {
                                top: rect.bottom,
                                left: rect.left,
                            };
                        }
                        return { top: 0, left: 0 };
                    };

                    const onMouseEnterDetails = () => {
                        setIsHovered(true);
                        setTableData([]);
                        setTable1Data([]);
                        // const data = {
                        //     skuCode: row.original.sku_id,
                        //     monthYr: row.original.lpo_yr_month,
                        //     yrMonthWAV: row.original.wav_yr_month,
                        //     orgCode: row.original.factory_code,
                        // };
                        // GetEpcaGpGcRateDtlsData(data);
                        calculatedGCAPIcall();
                    };

                    const calculatedGCAPIcall = async () => {
                        const requestData = {
                            sku_code: row.original.sku_id,
                            factory_code: row.original.factory_code,
                            yr_month_lpo: row.original.lpo_yr_month,
                            yr_month_wav: row.original.wav_yr_month,
                            rate: row.original.rate,
                        };
                        try {
                            const response: any = await EpcaDetails.GetCalculatedGC(requestData);
                            if (response && response.data) {
                                setTableData(response.data.table1 || []);
                                setTable1Data(response.data.table2 || []);
                            } else {
                                setTableData([]);
                                setTable1Data([]);
                            }
                        } catch (error) {
                            setTableData([]);
                            setTable1Data([]);
                        }
                    };

                    const onMouseLeaveDetails = () => {
                        setIsHovered(false);
                        setTableData([]);
                        setTable1Data([]);
                    };

                    const getColor = (value: number) => {
                        return value > 30 ? 'gray' : '#D98880';
                    };

                    return (
                        <div className="relative">
                            <div ref={iconRef} className="cursor-pointer rounded p-2" onMouseEnter={() => onMouseEnterDetails()} onMouseLeave={onMouseLeaveDetails}>
                                <div className="flex items-center" style={{ color: getColor(displayedValue) }}>
                                    <FaInfoCircle className="mr-4" />
                                    {isNaN(displayedValue) || displayedValue === 0 || displayedValue.toString().startsWith('.') || displayedValue.toString() === '0.'
                                        ? 'NA'
                                        : displayedValue.toFixed(2)}
                                </div>
                            </div>

                            {isHovered && (
                                <div
                                    className="fixed z-10 rounded bg-white shadow-lg"
                                    style={{
                                        top: `${getTooltipPosition().top}px`,
                                        left: `${getTooltipPosition().left}px`,
                                        pointerEvents: 'none',
                                    }}
                                >
                                    <table style={{ width: 350 }} className="smTable border-collapse">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "30%" }} className="whitespace-nowrap">SKU Code</th>
                                                <th style={{ width: "30%" }} className="whitespace-nowrap">Material Cost</th>
                                                <th style={{ width: "20%" }} className="whitespace-nowrap">Packing Cost</th>
                                                <th style={{ width: "20%" }} className="whitespace-nowrap">Freight Cost</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {table1Data.map((item, itemindexCount) => (
                                                <tr key={itemindexCount}>
                                                    <td className="border-t px-4 py-2">{item.wav_sku_code || 'N/A'}</td>
                                                    <td className="border-t px-4 py-2">{item.wav_material_cost || '-'}</td>
                                                    <td className="border-t px-4 py-2">{item.wav_packing_cost || '-'}</td>
                                                    <td className="border-t px-4 py-2">{item.wav_freight_cost || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'valid_from',
                header: 'Valid From',
                size: 20,
                minSize: 10,
                maxSize: 60,
                Cell: ({ row }) => {
                    const parseDate = (dateStr: string) => {
                        const [day, month, year] = dateStr.split('/');
                        return new Date(`${year}-${month}-${day}`);
                    };

                    const validFrom = row.original.valid_from ? parseDate(row.original.valid_from) : null;

                    return (
                        <Flatpickr
                            value={validFrom || ''}
                            onChange={(dates) => {
                                handleEditChange(dates[0], row.index, 'valid_from');
                                // If valid from date is selected, update the valid till date
                                // if (dates[0]) {
                                //     const validTill = row.original.valid_till ? parseDate(row.original.valid_till) : null;
                                //     if (validTill && validTill < dates[0]) {
                                //         // Optionally reset valid till date if it's invalid
                                //         handleEditChange('', row.index, 'valid_till');
                                //     }
                                // }
                            }}
                            options={{
                                dateFormat: 'd/m/Y',
                            }}
                            className="tableInput"
                            disabled
                        />
                    );
                },
            },
            {
                accessorKey: 'valid_till',
                header: 'Valid Till',
                size: 20,
                minSize: 10,
                maxSize: 60,
                Cell: ({ row }) => {
                    const parseDate = (dateStr: string | number | Date) => {
                        if (typeof dateStr === 'string' && dateStr.includes('/')) {
                            const [day, month, year] = dateStr.split('/');
                            return new Date(`${year}-${month}-${day}`);
                        } else if (typeof dateStr === 'object') {
                            const date = new Date(dateStr);
                            const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
                            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                            const year = date.getFullYear();
                            return new Date(`${year}-${month}-${day}`);
                        }
                        return null; // Return null if the date string is invalid or not in the expected format
                    };

                    const validFrom = row.original.valid_from ? parseDate(row.original.valid_from) : null;
                    const validTill = row.original.valid_till ? parseDate(row.original.valid_till) : null;

                    return (
                        <Flatpickr
                            value={validTill || ''}
                            onChange={(dates) => handleEditChange(dates[0], row.index, 'valid_till')}
                            options={{
                                dateFormat: 'd/m/Y',
                                minDate: validFrom ? validFrom : undefined, // Disable dates before validFrom
                            }}
                            className="tableInput"
                        />
                    );
                },
            },
            {
                accessorKey: 'factory',
                header: 'Required From',
                size: 40,
                minSize: 10,
                maxSize: 60,
                Cell: ({ row }) => {
                    const [options, setOptions] = useState<any[]>([]);
                    const [selectedFactory, setSelectedFactory] = useState<string>('');

                    const staticFactoryValue = row.original.factory || ''; // Full value like '300:Howrah - Mfg'
                    const factoryCode = staticFactoryValue.split(':')[0]; // Extract the factory code (e.g., '300')

                    useEffect(() => {
                        const fetchOptions = async () => {
                            const factoryOptions = await GetFactorydata(row.original.sku_id);
                            setOptions(factoryOptions);

                            // Find the corresponding option in the dropdown
                            const selectedOption = factoryOptions.find((option: { value: string; }) => option.value === factoryCode);
                            if (selectedOption) {
                                setSelectedFactory(selectedOption.value); // Set the selected factory code
                            }
                        };

                        fetchOptions();
                        setLoading(false);
                    }, [row.original.sku_id, factoryCode]);

                    const handleFactoryChange = (value: string) => {
                        setSelectedFactory(value); // Update the selected factory when user selects an option
                        (async () => {
                            const requestData = {
                                sku_code: row.original.sku_id,
                                factory_code: value,
                                yr_month_lpo: row.original.lpo_yr_month,
                                yr_month_wav: row.original.wav_yr_month,
                                rate: row.original.rate,
                            };
                            try {
                                const response: any = await EpcaDetails.GetCalculatedGC(requestData);
                                const notExistData = calculatedGCData.filter((sku: { table: { sku_code: any; }[]; }) => sku.table[0].sku_code !== response.data.table[0].sku_code)
                                setCalculatedGCData([...notExistData, response.data]);
                            } catch (error) {
                                setCalculatedGCData([]);
                            }
                        })();
                        handleEditChange(value, row.index, 'factory_code')
                    };

                    return (
                        <MantineSelect
                            data={options || []}
                            value={selectedFactory}
                            onChange={handleFactoryChange} // Add onChange handler
                            // placeholder="Select an option"
                            className="mantine-select"
                            withinPortal={true}
                        />
                    );
                },
            },
            // {
            //     accessorKey: 'lpo_yr_month',
            //     header: 'LpoYrMonth',
            //     size: 5,
            // },
            // {
            //     accessorKey: 'wav_yr_month',
            //     header: 'WavYrMonth',
            //     size: 5,
            // },
            {
                accessorKey: 'currentStatus',
                header: 'Status',
                size: 35,
                minSize: 10,
                maxSize: 60,
                Cell: ({ row }) => {
                    // console.log(row.original?.currentStatus)
                    return (
                        <MantineSelect
                            data={[
                                { label: 'Approve', value: 'A' },
                                { label: 'Reject', value: 'R' },
                            ]}
                            size="xs"
                            styles={{
                                input: { fontSize: 12 },
                                dropdown: { fontSize: 12 },
                            }}
                            value={row.original?.currentStatus || 'A'}
                            onChange={(value) => value && handleEditChange({ target: { value } }, row.index, 'currentStatus')}
                            placeholder="Select status"
                            clearable
                            withinPortal={true}
                        // className="mantine-select"
                        />
                    );
                },
            },
            {
                accessorKey: 'remarks',
                header: 'Remarks',
                size: 30,
                minSize: 10,
                maxSize: 60,
                Cell: ({ row }) => <input className="tableInput" autoComplete="off" type="text" value={row.original.remarks} onChange={(e) => handleEditChange(e, row.index, 'remarks')} />,
            },
            {
                id: 'action',
                header: 'Action',
                size: 10,
                minSize: 10,
                maxSize: 60,
                Cell: ({ row }) => {
                    return (
                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                GetPcaDetailsView(row.original.sku_id, row.original.pca_auto_id);
                                setShowPCAModal(true);
                            }}>
                            <FiEye size={20} style={{ color: 'blue',paddingRight: "4px" }} />
                        </span>
                    );
                },
            },
        ],
        [handleEditChange]
    );

    const [rowSelection, setRowSelection]: any = useState({});
    const [selectedRowIds, setselectedRowIds]: any = useState([]);
    // console.log(selectedRowIds)

    const table = useMantineReactTable({
        columns,
        data,
        enableRowSelection: true,
        enableStickyHeader: true,
        enableTopToolbar: false,
        enableSorting: false,
        enableColumnActions: false,
        state: {
            rowSelection,
        },
        onRowSelectionChange: (updater) => {
            const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
            setRowSelection(newSelection);
            const selectedRowIds = Object.keys(newSelection);
            const selectedRows = selectedRowIds.map((id) => data[Number(id)].pca_auto_id);
            setselectedRowIds([...selectedRows])
            // console.log('Selected Row Data:', selectedRows);
        },
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        mantineTableContainerProps: {
            style: {
                overflowX: 'hidden',
            },
        },
        mantineTableProps: {
            className: 'custom-table',
        },
        mantineTableBodyCellProps: ({ row }) => ({
            onClick: (e) => {
                const tag = (e.target as HTMLElement).tagName.toLowerCase();
                if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'button') {
                    e.stopPropagation(); // Prevent input clicks from toggling row selection
                }
            },
            sx: { textAlign: 'left', backgroundColor: selectedRowIds.find((sri: number) => sri === row.original.pca_auto_id) ? row.original?.currentStatus === 'A' ? '#ABEBC6' : '#ffd9d5' : '' },
        }),
        initialState: {
            columnVisibility: { lpo_yr_month: false, wav_yr_month: false },
        },
    });

    interface PcaEntity {
        AutoId: number;
        BillTo: string;
        SkuCode: string;
        FactoryCode: string;
        Nop: number;
        RatePerPack: number;
        ValidFrom: string | undefined;
        ValidTill: string | undefined;
        CurrentStatus: string;
        RejectionRemarks: string;

        LpoYrMonth: string;
        LpoMaterialCost: number;
        LpoPackingCost: number;
        LpoFreightCost: number;
        WavYrMonth: string;
        WavMaterialCost: number;
        WavPackingCost: number;
        WavOverheadCost: number;
        WavFreightCost: number;
    }

    function convertDateFormat(dateString: string | number | Date) {
        if (typeof dateString === 'string' && dateString.includes('/')) {
            const [day, month, year] = dateString.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else if (typeof dateString === 'object') {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = date.getFullYear();
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
    }

    async function showSubmitAlert(data: any) {
        commonAlert('Are you want to submit the PCA HO Approval Info?', '', 'warning').then(async (result: any) => {
            if (result.value) {
                const transformedData = {
                    pca_Request_Dtl_List: data.map((item: { AutoId: any; BillTo: any; SkuCode: any; FactoryCode: any; Nop: any; RatePerPack: any; ValidFrom: string | number | Date; ValidTill: string | number | Date; CurrentStatus: any; RejectionRemarks: any; LpoYrMonth: any; WavYrMonth: any; }) => ({
                        autoId: item.AutoId,
                        billTo: item.BillTo,
                        skuCode: item.SkuCode,
                        factoryCode: item.FactoryCode,
                        nop: item.Nop,
                        ratePerPack: item.RatePerPack,
                        validFrom: new Date(item.ValidFrom).toISOString(), // Convert to ISO format
                        validTill: new Date(item.ValidTill).toISOString(), // Convert to ISO format
                        currentStatus: item.CurrentStatus,
                        rejectionRemarks: item.RejectionRemarks,

                        LpoYrMonth: item.LpoYrMonth,
                        LpoMaterialCost: 0,
                        LpoPackingCost: 0,
                        LpoFreightCost: 0,
                        WavYrMonth: item.WavYrMonth,
                        WavMaterialCost: 0,
                        WavPackingCost: 0,
                        WavOverheadCost: 0,
                        WavFreightCost: 0,
                    })),
                };

                const response: any = await EpcaDepotApproval.PcaApprovalDetailsSubmit(transformedData);
                if (response.response_message) {
                    commonSuccessToast('PCA HO Approval Details Updated Successfully');
                    sessionStorage.setItem('epcaHoApprovalListReturnFromDetails', '1');
                    navigate('/Protecton/ePCA/EPCAHOApprovalList/');
                }
            }
        });
        setLoading(false);
    }

    const handleFormSubmit = async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        // console.log(selectedRows)
        const formattedData: PcaEntity[] = [];
        for (const row of selectedRows) {
            const original = row.original;
            const minRateResponse: any = await EpcaDetails.GetPcaMinRateBySku_Vr1({
                sku_code: original.sku_id,
                bill_to: original.bill_to,
            });

            let minRate = 0;
            if (minRateResponse && minRateResponse.data && minRateResponse.data.length > 0) minRate = parseFloat(minRateResponse.data[0].smr_rebate);

            // if (original.status_value === 'R' || parseFloat(original.rate) >= minRate) {
            // } else commonErrorToast(`PCA (${original.sku_id}) cannot go beyond the limit set by Accounts!`);
            // console.log(typeof parseFloat(original.rate), typeof minRate, parseFloat(original.rate) >= minRate)
            if (parseFloat(original.rate) >= minRate) {
                const entity: PcaEntity = {
                    AutoId: original.pca_auto_id,
                    BillTo: original.bill_to,
                    SkuCode: original.sku_id,
                    FactoryCode: original.factory_code,
                    Nop: parseInt(original.qty, 10),
                    RatePerPack: parseFloat(original.rate),
                    ValidFrom: convertDateFormat(original.valid_from),
                    ValidTill: convertDateFormat(original.valid_till),
                    CurrentStatus: original.currentStatus === 'A' ? original.approved_type : original.rejected_type,
                    RejectionRemarks: original.remarks,
                    LpoYrMonth: original.lpo_yr_month,
                    LpoMaterialCost: original.lpo_material_cost,
                    LpoPackingCost: original.lpo_packing_cost,
                    LpoFreightCost: original.lpo_freight_cost,
                    WavYrMonth: original.wav_yr_month,
                    WavMaterialCost: original.wav_material_cost,
                    WavPackingCost: original.wav_packing_cost,
                    WavOverheadCost: original.wav_overhead_cost,
                    WavFreightCost: original.wav_freight_cost,
                };
                formattedData.push(entity);
                if (formattedData.length > 0) showSubmitAlert(formattedData);
                else commonErrorToast(`Please select atleast one row`);
            } else commonErrorToast(`PCA (${original.sku_id}) cannot go beyond the limit set by Accounts!`);
        }
        setLoading(false);
    };

    useEffect(() => {
        const value: any = (sessionStorage.getItem('epcaHoDtlList'));
        setCustomerDetails(JSON.parse(value));
        GetePCADetailsData(JSON.parse(value));
        GetApplicableDepot();
        GetApplicableTerritory(JSON.parse(value));
        GetDealerList(JSON.parse(value));
        GetApplicableBillto(JSON.parse(value));
        GetPcaStatusData();
    }, [])

    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-2">
                <h5 className="text-lg font-semibold dark:text-white-light">e-PCA HO Approval Details</h5>
            </div>


            <div className="bg-white rounded-lg px-4 py-2 shadow-md mb-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Depot */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Depot:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            value={{ value: customerDetails?.depot_code, label: customerDetails?.depot_name }}
                            options={depot.map((d: any) => ({ value: d.depot_code, label: d.depot_name }))}
                            // isDisabled={isEditMode}
                            onChange={(event) => {
                                setCustomerDetails((pre: any) => ({ ...pre, depot_code: event?.value, depot_name: event?.label }))
                            }}
                        />
                    </div>

                    {/* Territory */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Territory:</label>
                        <Select
                            className="text-sm"
                            value={{ value: applTerr?.find((a: { terr_code: any; }) => a.terr_code === customerDetails?.dlr_terr_code)?.terr_code, label: applTerr.find((a: { terr_code: any; }) => a.terr_code === customerDetails?.dlr_terr_code)?.terr_name }}
                            options={applTerr.map((d: any) => ({ value: d.terr_code, label: d.terr_name }))}
                            // isDisabled={isEditMode}
                            onChange={(event) => {
                                setCustomerDetails((pre: any) => ({ ...pre, dlr_terr_code: event?.value }))
                            }}
                        />
                    </div>

                    {/* Customer Name */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Customer:</label>
                        <Select
                            className="text-sm"
                            value={{ value: customerDetails?.dlr_dealer_code, label: customerDetails?.dlr_dealer_name }}
                            options={dealer.map((d: any) => ({ value: d.dealer_code, label: d.dealer_name }))}
                            // isDisabled={isEditMode}
                            onChange={(event) => {
                                setCustomerDetails((pre: any) => ({ ...pre, dealer_code: event?.value, dealer_name: event?.label }))
                            }}
                        />
                    </div>

                    {/* PD Applicable */}
                    <div>
                        <label className="formLabel">PD Applicable:</label>
                        <div className="mt-2 flex">
                            <label className="relative h-6 w-12">
                                <input
                                    autoComplete="off"
                                    type="checkbox"
                                    // defaultChecked={pdAppl === 'Y'}
                                    className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                    id="custom_switch_checkbox1"
                                    checked={customerDetails?.pd_appl_yn || 'Y'}
                                    // disabled={isEditMode}
                                    onChange={(event) => {
                                        setCustomerDetails((pre: any) => ({ ...pre, dlr_terr_code: event?.target.checked ? 'Y' : 'N' }))
                                    }}
                                />
                                <span
                                    className={`outline_checkbox bg-icon block h-full rounded-full border-2 border-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-[#ebedf2] before:bg-[url(${GetProdDevImgRouteBuilder(
                                        '/assets/images/close.svg'
                                    )})] before:bg-center before:bg-no-repeat before:transition-all before:duration-300 peer-checked:border-primary peer-checked:before:left-7 peer-checked:before:bg-primary peer-checked:before:bg-[url(${GetProdDevImgRouteBuilder(
                                        '/assets/images/checked.svg'
                                    )})] dark:border-white-dark dark:before:bg-white-dark`}
                                ></span>
                            </label>
                        </div>
                    </div>

                    {/* Bill To */}
                    <div>
                        <label className="formLabel">Bill To:</label>
                        <Select
                            isSearchable={true}
                            value={{ value: billToData?.find((a: { bill_to: any; }) => a.bill_to === customerDetails?.dlr_bill_to)?.bill_to, label: billToData?.find((a: { bill_to: any; }) => a.bill_to === customerDetails?.dlr_bill_to)?.bill_to_name }}
                            options={billToData?.filter((item: any) => item.pd_appl_yn === customerDetails?.pd_appl_yn).map((d: any) => ({ value: d.bill_to, label: d.bill_to_name }))}
                            // isDisabled={isEditMode}
                            onChange={(event) => {
                                setCustomerDetails((pre: any) => ({ ...pre, dlr_bill_to: event?.value }))
                            }}
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="formLabel">Status:</label>
                        <Select
                            isSearchable={true}
                            value={mainStatus?.find((m) => m.value === customerDetails?.main_status)}
                            options={mainStatus}
                            onChange={(event) => {
                                setCustomerDetails((pre: any) => ({ ...pre, main_status: event?.value, aprv_status: '' }))
                            }}
                        // styles={customStylesForStatusSelect}
                        />
                    </div>

                    {/* Sub Status */}
                    <div>
                        <label className="formLabel">Sub Status:</label>
                        <Select
                            isSearchable={true}
                            value={{ value: approveStatus?.find((a: { lov_code: any; }) => a.lov_code === customerDetails?.aprv_status)?.lov_code, label: approveStatus?.find((a: { lov_code: any; }) => a.lov_code === customerDetails?.aprv_status)?.lov_value }}
                            // options={approveStatus.map((d: any) => ({ value: d.lov_code, label: d.lov_value }))}
                            options={customerDetails?.main_status ? approveStatus.filter((item: any) => item.lov_field1_value === customerDetails?.main_status).map((d: any) => ({ value: d.lov_code, label: d.lov_value })) : approveStatus.filter((item: any) => item.lov_field1_value === 'PENDING').map((d: any) => ({ value: d.lov_code, label: d.lov_value }))}
                            onChange={(event) => {
                                setCustomerDetails((pre: any) => ({ ...pre, aprv_status: event?.value }))
                            }}
                        />
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

            <div className="mb-2">
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', background: '#fff', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '4px', paddingRight: '4px' }}>
                    <div className="mx-2" style={{ display: 'inline-block' }}>
                        <div style={{ float: 'left', width: '20px', height: '20px', margin: '0px', border: '1px solid rgba(0, 0, 0, .2)', backgroundColor: '#ABEBC6' }}></div>
                        <span style={{ float: 'left', height: '20px', lineHeight: '22px', paddingLeft: '6px', display: 'inline-block' }}>Approve</span>
                    </div>

                    <div className="mx-2">
                        <div style={{ float: 'left', width: '20px', height: '20px', margin: '0px', border: '1px solid rgba(0, 0, 0, .2)', backgroundColor: '#ffd9d5' }}></div>
                        <span style={{ float: 'left', height: '20px', lineHeight: '22px', paddingLeft: '6px', display: 'inline-block' }}>Reject</span>
                    </div>
                </div>

                {data.length > 0 && (
                    <div className="mb-2 p-pl-table-item" style={{ maxHeight: '45vh', overflowY: 'auto' }}>
                        <MantineReactTable table={table} />
                    </div>
                )}
            </div>

            {/* Modal PopUp */}
            <div>
                <Transition appear show={showPCAModal} as={Fragment}>
                    <Dialog as="div" open={showPCAModal} onClose={() => setShowPCAModal(false)}>
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
                                        <div className="flex items-center justify-between bg-secondary-light px-2" style={{ width: `100%` }}>
                                            <div className="flex">
                                                {/* <img className="mr-2 h-8 w-auto" src={GetProdDevImgRouteBuilder('/assets/images/meeting.png')} alt="" /> */}
                                                <h5 className="text-lg font-bold">View</h5>
                                            </div>
                                            <button onClick={() => setShowPCAModal(false)} type="button" className="justify-end text-white-dark hover:text-dark">
                                                <RxCross2 />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="px-3 pt-2">
                                        <div className="table-responsive pb-2">
                                            <BesicDetailTable data={pcaBesicData} />
                                        </div>
                                        <div className="table-responsive">
                                            <PCADetailsGrid data={pcaDetailData} />
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>

            <div className="flex items-center justify-center gap-1 pb-3">
                {hasEditableRows && (
                    <button
                        type="button"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm flex items-center"
                        onClick={() => {
                            handleFormSubmit();
                        }}
                    >
                        {' '}
                        <IoMdSave /> &nbsp; Submit
                    </button>
                )}
                <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm flex items-center"
                    onClick={() => {
                        handleBackButton();
                    }}
                >
                    <IoReturnUpBack />  &nbsp; Back
                </button>
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

export default EPCAHoApprovalDetails