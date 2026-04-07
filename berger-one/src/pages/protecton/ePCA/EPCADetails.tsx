import { UseAuthStore } from '../../../services/store/AuthStore';
import { useEffect, useMemo, useState } from 'react'
import * as Epca from '../../../services/api/protectonEpca/EpcaList';
import * as EpcaDetails from '../../../services/api/protectonEpca/EpcaDetails';
import Select from 'react-select';
import { GetProdDevImgRouteBuilder } from '../../../services/functions/getProdDevUrlBuilder';
import { NumberInput, Switch, TextInput } from '@mantine/core';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import moment from 'moment';
import { commonAlert } from '../../../services/functions/commonAlert';
import { commonSuccessToast } from '../../../services/functions/commonToast';
import { IoReturnUpBack } from "react-icons/io5";
import { MantineReactTable, type MRT_ColumnDef, useMantineReactTable } from 'mantine-react-table';
import { useNavigate } from 'react-router-dom';

const EPCADetails = () => {
    const user = UseAuthStore((state: any) => state.userDetails);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [pageType, setPageType] = useState('');
    const [depot, setDepot] = useState<any>([]);
    const [applTerr, setApplTerr] = useState<any>([]);
    const [dealer, setDealer] = useState<any>([]);
    const [billTo, setBillTo] = useState<any>([]);
    const [project, setProject] = useState<any>([]);
    const [sku, setSKU] = useState<any>([]);
    const [factory, setFactory] = useState<any>([]);
    const [projectSrchData, setProjectSrchData] = useState<any>("");
    const [skuSrchData, setSkuSrchData] = useState<any>("");
    const skuObj = {
        sku_code: "",
        sku_desc: "",
        sku_uom: "",
        sku_pack_size: 0,
        sku_mrp: 0,
        rate: 0,
        nop: 0,
        validfrom: new Date().toLocaleDateString('en-GB'),
        validto: new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('en-GB'),
        requiredForm: { org_code: '', org_name: '' },
        remarks: ""
    }
    const [skuDetails, setSkuDetails] = useState<any>({ ...skuObj });
    const [ePCADetails, setePCADetails] = useState<any>({
        depot_code: "",
        depot_name: "",
        terr_code: "",
        terr_name: "",
        dealer_code: "",
        dealer_name: "",
        pdAppl: 'Y',
        bill_to: null,
        bill_to_name: "",
        projectId: null,
        projectName: "",
        sku_code: "",
        sku_desc: ""
    });
    const [data, setData] = useState<any>([]);

    const GetePCADetailsData = async (billtocode: any) => {
        //setLoading(true);
        const data: any = {
            billto_code: billtocode,
            aprv_status: '',
            main_status: '',
        };
        try {
            const response: any = await EpcaDetails.PcaDetailsGetDtl(data);
            setData(response?.data?.table || []);
        } catch (error) {
            setData([]);
        } finally {
            setLoading(false);
        }
        //setLoading(false);
    };

    const GetApplicableDepot = async () => {
        setLoading(true);
        const data: any = {
            user_id: user.user_id,
            region: '',
            app_id: '15',
        };
        try {
            const response: any = await Epca.GetApplicableDepotList(data);
            setDepot(response.data || []);
        } catch (error) {
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const GetApplicableTerritory = async ({ depot_code }: any) => {
        setLoading(true);
        const data: any = {
            user_id: user.user_id,
            depot_code: depot_code,
            app_id: '15',
        };
        try {
            const response: any = await Epca.GetApplicableTerrList(data);
            setApplTerr(response.data || [])
        } catch (error) {
            setApplTerr([]);
        } finally {
            setLoading(false);
        }
    };

    const GetDealerList = async ({ depot_code, terr_code }: any) => {
        setLoading(true);
        const data: any = {
            depot_code: depot_code,
            terr_code: terr_code,
            sbl_code: '4',
        };
        try {
            const response: any = await EpcaDetails.GetPcaDealersList(data);
            setDealer(response.data || [])
        } catch (error) {
            setDealer([]);
        } finally {
            setLoading(false);
        }
    };

    const GetApplicableBillto = async ({ depot_code, terr_code, dealer_code }: any) => {
        setLoading(true);
        const data: any = {
            depot_code: depot_code,
            terr_code: terr_code,
            dealer_code: dealer_code,
        };
        try {
            const response: any = await EpcaDetails.GetPcaBillToList(data);
            setBillTo(response.data || [])
        } catch (error) {
            setBillTo([]);
        } finally {
            setLoading(false);
        }
    };

    const GetApplicableProjectList = async ({ billto_code, srch_str }: any) => {
        setLoading(true);
        const data: any = {
            app_id: 15,
            billto_code: billto_code,
            srch_str: srch_str
        };
        try {
            const response: any = await EpcaDetails.GetProjectList(data);
            setProject(response.data.table || [])
        } catch (error) {
            setProject([]);
        } finally {
            setLoading(false);
        }
        setProjectSrchData('')
    };

    const GetSkuData = async ({ PrefixText }: any) => {
        setLoading(true);
        const data: any = {
            app_id: 15,
            PrefixText: PrefixText
        };
        try {
            const response: any = await EpcaDetails.GetSKUList(data);
            // setSKU(response.data.table || [])
            setSKU(response.data.table.map((d: any) => ({ ...d, sku_desc: `${d.sku_desc} (${d.sku_code})` })) || [])
        } catch (error) {
            setSKU([]);
        } finally {
            setLoading(false);
        }
        setSkuSrchData('')
    };

    const PcaDetailsGetStatus = async ({ billto_code, sku_code, valid_from }: any) => {
        setLoading(true);
        const [day, month, year] = valid_from.split("/");
        const formatted = `${year}/${month}/${day}`;

        const data: any = {
            billto_code: billto_code,
            sku_code: sku_code,
            valid_from: formatted
        };
        try {
            const response: any = await EpcaDetails.PcaDetailsGetStatus(data);
            console.log(response)
            if (response.data && response.data.length > 0) {
                commonAlert('PCA already exists. Do you want to Cancel existing ePCA and Request New ePCA ?', '', 'warning').then(async (result: any) => {
                    if (result.value) {
                        handleSubmit();
                    } else {
                        setSkuDetails({ ...skuObj });
                        setePCADetails((pre: any) => ({ ...pre, sku_code: "", sku_desc: "" }))
                        setSkuSrchData('');
                    }
                });
            } else {
                handleSubmit();
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    const GetFactorydata = async ({ sku_code }: any) => {
        setLoading(true);
        const data: any = {
            app_id: 15,
            sku_code: sku_code
        };
        try {
            const response: any = await EpcaDetails.GetFactoryListBySKU(data);
            setFactory(response.data || [])
        } catch (error) {
            setFactory([]);
        } finally {
            setLoading(false);
        }
    };

    const convertToDate = (dateStr: any) => {
        if (typeof dateStr === 'string') {
            const [day, month, year] = dateStr.split('/');
            return new Date(`${year}-${month}-${day}`);
        }
        return dateStr;
    };

    const getMaxValidTillDate = (validFrom: any) => {
        if (!validFrom) return undefined;
        const fromDate = convertToDate(skuDetails.validfrom);
        return new Date(fromDate.setMonth(fromDate.getMonth() + 3));
    };

    // Calculate the maxDate for the "Valid Till" field based on the "Valid From" date
    const getMinValidTillDate = (validFrom: any) => {
        if (!validFrom) return undefined;
        const fromDate = convertToDate(skuDetails.validfrom);
        return new Date(fromDate.setMonth(fromDate.getMonth()));
    };

    const formatDateToString = (date: any) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const isFormValid = () => {
        if (skuDetails.validto && skuDetails.rate && skuDetails.nop) {
            if (billTo.find((p: any) => p.bill_to === ePCADetails?.bill_to)?.project_appl_yn === 'Y' && ePCADetails.projectId === null) {
                return false
            } else return true
        } else return false
    };

    const handleSubmit = async () => {
        let submitObj: any = {
            auto_id: 0,
            billto_code: ePCADetails.bill_to,
            sku_id: skuDetails.sku_code,
            factory: skuDetails.requiredForm.org_code,
            rate: parseInt(skuDetails.rate),
            qty: parseInt(skuDetails.nop),
            valid_from: moment(skuDetails.validfrom, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            valid_till: moment(skuDetails.validto, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            status: 'PENDING_DEPOT',
            remarks: skuDetails.remarks,
            app_name: 'PROTECTON',
            user_id: user.user_id,
            mrp: skuDetails.sku_mrp,
            project_appl_yn: billTo.find((p: any) => p.bill_to === ePCADetails?.bill_to)?.project_appl_yn,
            end_client_name: '',
            project_name: ePCADetails.projectName,
            projectid: ePCADetails.projectId,
            project_type: 'EXISTING',
        };
        // console.log(ePCADetails?.bill_to)
        // commonAlert('Are you want to insert the PCA Info?', '', 'warning').then(async (result: any) => {
        // if (result.value) {
        const response: any = await EpcaDetails.InsertePcaDetails_Vr1(submitObj);
        if (response.response_message) {
            commonSuccessToast('PCA Details Inserted Successfully');
            setePCADetails((pre: any) => ({ ...pre, sku_code: "", sku_desc: "" }))
            setSkuDetails({ ...skuObj });
            setSkuSrchData('');
            GetePCADetailsData(ePCADetails?.bill_to);
        }
        // }
        // });

        // showSubmitAlert(submitObj);
    };

    const handleBackButton = () => {
        // commonAlert('Are you sure?', '', 'warning').then(async (result: any) => {
        //     if (result.value) {
        sessionStorage.setItem('epcaListReturnFromDetails', '1');
        navigate('/Protecton/ePCA/EPCAList/');
        //     }
        // });
    };

    async function DeletePca(autoId: any) {
        //setLoading(true);
        commonAlert('Are you sure you want to delete this item?', '', 'warning').then(async (result: any) => {
            if (result.value) {
                const response: any = await EpcaDetails.DeletePcaDetails({ auto_id: autoId });
                if (response.response_message) {
                    commonSuccessToast('PCA Details Deleted Successfully');
                    GetePCADetailsData(ePCADetails?.bill_to);
                }
            }
        });
        // setLoading(false);
    }

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'sku_id',
                header: 'SKU Code',
                size: 60,
            },
            {
                accessorKey: 'sku_desc',
                header: 'SKU Name',
                size: 75,
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
                header: 'Rate(Lt/Kg)',
                size: 50,
            },
            {
                accessorKey: 'qty',
                header: 'NOP(Lt/Kg)',
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
                accessorKey: 'status_value',
                header: 'Status',
                size: 50,
            },
            {
                accessorKey: 'remarks',
                header: 'Remarks',
                size: 50,
            },
            {
                id: 'action',
                header: 'Action',
                size: 50,
                Cell: ({ row }) => {
                    const isDisabled = row.original.status_code === 'PENDING_DEPOT';
                    return (
                        isDisabled && (
                            <button
                                style={{
                                    padding: '4px 8px',
                                    backgroundColor: '#f44336',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    // console.log(ePCADetails?.bill_to)
                                    ePCADetails?.bill_to && DeletePca(row.original.pd_auto_id)
                                }}
                            >
                                Delete
                            </button >
                        )
                    );
                },
            }

        ],
        [ePCADetails?.bill_to]
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
                overflow: 'auto',
                maxHeight: '12rem',
            },
        }
    });

    useEffect(() => {
        skuSrchData.length > 2 && GetSkuData({ PrefixText: skuSrchData })
    }, [skuSrchData])


    useEffect(() => {
        GetApplicableDepot();
        const entryType: any = (sessionStorage.getItem('epcaDtlListEntryType'));
        setPageType(JSON.parse(entryType))
        if (JSON.parse(entryType) === 'View') {
            const value: any = (sessionStorage.getItem('epcaDtlList'));
            const parsedValue = JSON.parse(value);
            if (parsedValue) {
                console.log(parsedValue)
                GetePCADetailsData(parsedValue.dlr_bill_to);
                GetApplicableTerritory({ depot_code: parsedValue.depot_code })
                GetDealerList({ depot_code: parsedValue.depot_code, terr_code: parsedValue.dlr_terr_code })
                GetApplicableBillto({ depot_code: parsedValue.depot_code, terr_code: parsedValue.dlr_terr_code, dealer_code: parsedValue.dlr_dealer_code })
                setePCADetails((pre: any) => ({
                    ...pre,
                    depot_code: parsedValue.depot_code,
                    depot_name: parsedValue.depot_name,
                    dealer_code: parsedValue.dlr_dealer_code,
                    dealer_name: parsedValue.dlr_dealer_name,
                    pdAppl: parsedValue.pd_appl_yn,
                }))
            }
        }
    }, [])

    useEffect(() => {
        // console.log(ePCADetails?.bill_to)
        const entryType: any = (sessionStorage.getItem('epcaDtlListEntryType'));
        if (JSON.parse(entryType) === 'New' && ePCADetails?.depot_code && ePCADetails?.terr_code && ePCADetails?.dealer_code && ePCADetails?.bill_to) {
            setData([]);
            GetePCADetailsData(ePCADetails?.bill_to);
        }
    }, [ePCADetails?.depot_code, ePCADetails?.terr_code, ePCADetails?.dealer_code, ePCADetails?.bill_to])

    useEffect(() => {
        const entryType: any = (sessionStorage.getItem('epcaDtlListEntryType'));
        if (JSON.parse(entryType) === 'View') {
            const value: any = (sessionStorage.getItem('epcaDtlList'));
            const parsedValue = JSON.parse(value);
            parsedValue && setePCADetails((pre: any) => ({
                ...pre,
                terr_code: parsedValue.dlr_terr_code,
                terr_name: applTerr.find((terr: any) => terr.terr_code === parsedValue.dlr_terr_code)?.terr_name,
                bill_to: parsedValue.dlr_bill_to,
                bill_to_name: billTo.find((terr: any) => terr.bill_to === parsedValue.dlr_bill_to)?.bill_to_name,
            }))
        }
    }, [applTerr, billTo])

    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-2">
                <h5 className="text-lg font-semibold dark:text-white-light">e-PCA Details</h5>
            </div>

            <div className="panel mb-2 bg-white">
                <form className=" border-1 space-y-5">
                    <div className="grid md:grid-cols-7 gap-2">
                        <div className="col-span-1">
                            <label className="formLabel">Depot:<span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                            <Select
                                className="text-sm"
                                isSearchable={true}
                                value={{ value: ePCADetails?.depot_code, label: ePCADetails?.depot_name }}
                                options={depot.map((d: any) => ({ value: d.depot_code, label: d.depot_name }))}
                                isDisabled={pageType === 'View'}
                                onChange={(event) => {
                                    GetApplicableTerritory({ depot_code: event?.value });
                                    setePCADetails((pre: any) => ({
                                        ...pre, depot_code: event?.value,
                                        depot_name: event?.label,
                                        terr_code: '',
                                        terr_name: '',
                                        dealer_code: "",
                                        dealer_name: "",
                                        bill_to: null,
                                        bill_to_name: "",
                                        projectId: null,
                                        projectName: "",
                                        sku_code: "",
                                        sku_desc: "",
                                    }))
                                    setSkuDetails({ ...skuObj });
                                }}
                            />
                            {/* {errMsg && errMsg.depot ? <div className="mt-1 text-danger">{errMsg.depot}</div> : ''} */}
                        </div>
                        <div className="col-span-1">
                            <label className="formLabel">Territory:<span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                            <Select
                                className="text-sm"
                                isSearchable={true}
                                value={{ value: ePCADetails?.terr_code, label: ePCADetails?.terr_name }}
                                options={applTerr.map((d: any) => ({ value: d.terr_code, label: d.terr_name }))}
                                isDisabled={pageType === 'View'}
                                onChange={(event) => {
                                    GetDealerList({ depot_code: ePCADetails?.depot_code, terr_code: event?.value })
                                    setePCADetails((pre: any) => ({ ...pre, terr_code: event?.value, terr_name: event?.label, dealer_code: '', dealer_name: '', bill_to: null, bill_to_name: "", projectId: null, projectName: "", sku_code: "", sku_desc: "" }))
                                    setSkuDetails({ ...skuObj });
                                }}
                            />
                            {/* {errMsg && errMsg.terr ? <div className="mt-1 text-danger">{errMsg.terr}</div> : ''} */}
                        </div>
                        <div className="col-span-1">
                            <label className="formLabel">Customer:<span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                            <Select
                                className="text-sm"
                                isSearchable={true}
                                value={{ value: ePCADetails?.dealer_code, label: ePCADetails?.dealer_name }}
                                options={dealer.map((d: any) => ({ value: d.dealer_code, label: d.dealer_name }))}
                                isDisabled={pageType === 'View'}
                                onChange={(event) => {
                                    GetApplicableBillto({ depot_code: ePCADetails?.depot_code, terr_code: ePCADetails?.terr_code, dealer_code: event?.value })
                                    setePCADetails((pre: any) => ({ ...pre, dealer_code: event?.value, dealer_name: event?.label, bill_to: null, bill_to_name: "", projectId: null, projectName: "", sku_code: "", sku_desc: "" }))
                                    setSkuDetails({ ...skuObj });
                                }}
                            />
                            {/* {errMsg && errMsg.dealer ? <div className="mt-1 text-danger">{errMsg.dealer}</div> : ''} */}
                        </div>
                        <div className="col-span-1">
                            <label className="formLabel">PD Applicable:<span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                            <div className="mt-2 flex">
                                <Switch
                                    id="pd_applicable_switch"
                                    role="switch"
                                    checked={ePCADetails.pdAppl === 'Y'}
                                    disabled={pageType === 'View'}
                                    onChange={(event: any) => {
                                        setePCADetails((pre: any) => ({
                                            ...pre, pdAppl: event.target.checked ? 'Y' : 'N', bill_to: null, bill_to_name: "", projectId: null, projectName: "", sku_code: "",
                                            sku_desc: ""
                                        }))
                                        setSkuDetails({ ...skuObj });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-span-1">
                            <label className="formLabel">Bill To:<span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                            <Select
                                className="text-sm"
                                isSearchable={true}
                                value={{ value: ePCADetails?.bill_to, label: ePCADetails?.bill_to_name }}
                                options={billTo.filter((b: any) => b.pd_appl_yn === ePCADetails?.pdAppl).map((d: any) => ({ value: d.bill_to, label: d.bill_to_name }))}
                                isDisabled={pageType === 'View'}
                                onChange={(event) => {
                                    setePCADetails((pre: any) => ({ ...pre, bill_to: event?.value, bill_to_name: event?.label, projectId: null, projectName: "", sku_code: "", sku_desc: "" }))
                                    setSkuDetails({ ...skuObj });
                                    // GetApplicableProjectList({ billto_code: event?.value, srch_str: 'pro' })
                                    GetApplicableProjectList({ billto_code: event?.value, srch_str: projectSrchData })
                                }}
                            />
                            {/* {errMsg && errMsg.billto ? <div className="mt-1 text-danger">{errMsg.billto}</div> : ''} */}
                        </div>
                        <div className="col-span-1">
                            <label className="formLabel">
                                Project Search:
                                {billTo.find((p: any) => p.bill_to === ePCADetails?.bill_to)?.project_appl_yn === 'Y' && <span className="text-red-500"> *</span>}
                            </label>
                            <Select
                                className="text-sm"
                                // isSearchable={true}
                                value={{ value: ePCADetails?.projectId, label: ePCADetails?.projectName }}
                                options={project.map((d: any) => ({ value: d.projectId, label: d.projectName }))}
                                // isDisabled={pageType === 'View'}
                                // onInputChange={(inputValue) => setProjectSrchData(inputValue)}
                                onChange={(event) => {
                                    // setePCADetails((pre: any) => ({ ...pre, projectId: event?.value, projectName: event?.label, bill_to: null, bill_to_name: "" }))
                                    setePCADetails((pre: any) => ({ ...pre, projectId: event?.value, projectName: event?.label }))
                                }}
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="formLabel">Search SKU:</label>
                            <Select
                                className="text-sm"
                                // isSearchable={true}
                                value={{ value: ePCADetails?.sku_code, label: ePCADetails?.sku_desc }}
                                options={sku.map((d: any) => ({ value: d.sku_code, label: d.sku_desc }))}
                                // isDisabled={pageType === 'View'}
                                onInputChange={(inputValue) => setSkuSrchData(inputValue)}
                                onChange={(event) => {
                                    GetFactorydata({ sku_code: event?.value })
                                    setePCADetails((pre: any) => ({ ...pre, sku_code: event?.value, sku_desc: `${event?.label} (${event?.value})` }))
                                    setSkuDetails((pre: any) => ({ ...pre, ...sku.find((s: any) => s.sku_code === event?.value) }))
                                }}
                            />
                        </div>
                    </div>
                </form>
                {/* {pageType == "New" && */}
                <div className="mt-5">
                    <div className="table-responsive h100">
                        <table className="custTableView w-full border-collapse">
                            <thead>
                                <tr>
                                    <th style={{ width: '10%', textAlign: 'left' }}>SKU Code</th>
                                    <th style={{ width: '14%', textAlign: 'left' }}>SKU Name</th>
                                    <th style={{ width: '5%', textAlign: 'center' }}>UOM</th>
                                    <th style={{ width: '5%', textAlign: 'center' }}>Pack Size</th>
                                    <th style={{ width: '8%', textAlign: 'center' }}>Declared PCA (Lt/Kg)</th>
                                    <th style={{ width: '7%', textAlign: 'center' }}>Rate (Lt/Kg)</th>
                                    <th style={{ width: '5%', textAlign: 'center' }}>NOP</th>
                                    <th style={{ width: '8%', textAlign: 'center' }}>Valid From</th>
                                    <th style={{ width: '8%', textAlign: 'center' }}>Valid Till</th>
                                    <th style={{ width: '10%', textAlign: 'center' }}>Required From</th>
                                    <th style={{ width: '14%', textAlign: 'center' }}>Remarks</th>
                                    <th style={{ width: '6%', textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: 'left' }}>{skuDetails.sku_code}</td>
                                    <td style={{ textAlign: 'left' }}>{skuDetails.sku_desc}</td>
                                    <td style={{ textAlign: 'center' }}>{skuDetails.sku_uom}</td>
                                    <td style={{ textAlign: 'center' }}>{skuDetails.sku_pack_size}</td>
                                    <td style={{ textAlign: 'center' }}>{skuDetails.sku_pca}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <NumberInput
                                            style={{ width: '75px' }}
                                            id="txtRate"
                                            name="rate"
                                            min={0}
                                            value={skuDetails?.rate}
                                            autoComplete="off"
                                            onChange={(e) =>
                                                setSkuDetails((pre: any) => ({
                                                    ...pre,
                                                    rate: typeof e === 'number' ? Math.max(0, e) : e,
                                                }))
                                            }
                                            placeholder="Rate"
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <NumberInput
                                            style={{ width: '55px' }}
                                            name="nop"
                                            min={0}
                                            value={skuDetails?.nop}
                                            autoComplete="off"
                                            onChange={(e) =>
                                                setSkuDetails((pre: any) => ({
                                                    ...pre,
                                                    nop: typeof e === 'number' ? Math.max(0, e) : e,
                                                }))
                                            }
                                            placeholder="NOP"
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <Flatpickr
                                            name="validfrom"
                                            value={convertToDate(skuDetails.validfrom)}
                                            autoComplete="off"
                                            options={{
                                                dateFormat: 'Y-m-d', // Actual input value format (ISO format)
                                                altInput: true, // Enables alternative display input
                                                altFormat: 'd/m/Y', // Display format for the user
                                            }}
                                            placeholder="Valid From"
                                            disabled={true}
                                            className="tableInput" // Disable the Valid From field
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <Flatpickr
                                            name="validto"
                                            value={convertToDate(skuDetails.validto)}
                                            // autoComplete="off"
                                            options={{
                                                dateFormat: 'Y-m-d', // Actual input value format (ISO format)
                                                altInput: true, // Enables alternative display input
                                                altFormat: 'd/m/Y', // Display format for the user
                                                minDate: getMinValidTillDate(skuDetails.validfrom),
                                                maxDate: getMaxValidTillDate(skuDetails.validfrom),
                                            }}
                                            placeholder="Valid To"
                                            className="tableInput"
                                            onChange={(e) => setSkuDetails((pre: any) => ({ ...pre, validto: formatDateToString(e[0]) }))}
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <Select
                                            name="requiredForm"
                                            className="innerTableSelectWt"
                                            isSearchable={true}
                                            value={{ value: skuDetails?.requiredForm?.org_code, label: skuDetails?.requiredForm?.org_name }}
                                            options={factory.map((d: any) => ({ value: d.org_code, label: d.org_name }))}
                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                            styles={{ menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) }}
                                            onChange={(event) => {
                                                setSkuDetails((pre: any) => ({ ...pre, requiredForm: { org_code: event?.value, org_name: event?.label } }))
                                            }}
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <TextInput style={{ width: '100%' }} name="remarks" value={skuDetails.remarks} autoComplete="off" onChange={(e) => setSkuDetails((pre: any) => ({ ...pre, remarks: e.target.value }))} placeholder="Enter data" />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            className={`${isFormValid() ? 'cursor-pointer bg-blue-500 hover:bg-blue-700' : 'cursor-not-allowed bg-gray-300'
                                                } relative rounded border border-gray-400 px-4 py-2 font-semibold text-white shadow`}
                                            disabled={!isFormValid()}
                                            onClick={() => {
                                                PcaDetailsGetStatus({ billto_code: ePCADetails?.bill_to, sku_code: ePCADetails?.sku_code, valid_from: skuDetails.validfrom });
                                                // handleSubmit();
                                            }}
                                        >Add</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* } */}
            </div>

            {/* {pageType == 'View' && */}
            {data.length > 0 && <div className="panel mb-2 p-pl-table-item"><MantineReactTable table={table} /></div>}
            {/* } */}

            <div className="flex items-center justify-center gap-1 pb-2">
                <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm flex items-center"
                    onClick={() => {
                        handleBackButton();
                    }}
                >
                    <IoReturnUpBack /> &nbsp; Back
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

export default EPCADetails