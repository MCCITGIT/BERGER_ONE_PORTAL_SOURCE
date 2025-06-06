import { useEffect, useState } from "react";
import * as common from '../../../services/api/users/UserProfile';
import * as Epca from '../../../services/api/protectonEpca/EpcaList';
import * as stock from '../../../services/api/protectonTransact/TransactStock';
import { UseAuthStore } from "../../../services/store/AuthStore";
import { CiSearch } from "react-icons/ci";
import Select from 'react-select';
import AnimateHeight from "react-animate-height";

const TransactReturnCheque = () => {

    const [loading, setLoading] = useState(false);
    const [openOrg, setOpenOrg] = useState<string | null>(null);
    const [data, setData] = useState<any>({
        regionList: [],
        depotList: [],
        terrList: [],
        customerList: [],
        selectedRegion: '',
        selectedDepot: '',
        selectedTerr: '',
        selectedCustomer: '',
        valueInPage: 1,
        returnChequeList: [],
    });

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

    const GetCustomer = async () => {
        setLoading(true);
        try {
            const response: any = await stock.GetActionCatList({});
            setData((prevData: any) => ({
                ...prevData,
                customerList: response.data.table || [],
                selectedCustomer: ''
            }));
        } catch (error) {
            return;
        }
        setLoading(false);
    }

    const GetReturnChequeList = async () => {
        setLoading(true);
        const payload: any = {
            region: data.selectedRegion,
            depot_code: data.selectedDepot,
            terr_code: data.selectedTerr,
            cat: data.selectedCustomer,
            days: data.valueInPage,
        };
        try {
            const response: any = await stock.GetActionRcList(payload);
            const flatList: any[] = response.data.table || [];
            const groupedByOrg = flatList.reduce((acc, item) => {
                const key = item.org;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(item);
                return acc;
            }, {} as Record<string, any[]>);

            setData((prevData: any) => ({
                ...prevData,
                returnChequeList: groupedByOrg,
            }));
        } catch (error) {
            return;
        }
        setLoading(false);
    }

    useEffect(() => {
        GetRegion();
        GetCustomer()
    }, []);

    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-1">
                <h5 className="text-lg font-semibold dark:text-white-light">Transact Return Cheque</h5>
            </div>

            <div className="bg-white rounded-lg px-4 py-2 shadow-md mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">

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

                    <div>
                        <label className="block text-sm font-semibold mb-1">Customer Type:</label>
                        <Select
                            className="text-sm"
                            isSearchable={true}
                            options={[
                                ...data.customerList.map((d: any) => ({
                                    value: d.cat_cust_desc,
                                    label: d.cat_cust_desc,
                                })),
                            ]}
                            value={
                                data.selectedCustomer
                                    ? { value: data.selectedCustomer, label: data.customerList.find((d: any) => d.cat_cust_desc === data.selectedCustomer)?.cat_cust_desc }
                                    : null
                            }
                            onChange={(event) => {
                                setData((pre: any) => ({ ...pre, selectedCustomer: event?.value }))
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Value in Page:</label>
                        <input
                            type="number"
                            min="0"
                            max="30"
                            value={data.valueInPage}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-"].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onChange={(e) => {
                                let value = parseInt(e.target.value, 10);
                                if (isNaN(value) || value < 0) {
                                    value = 0;
                                } else if (value > 30) {
                                    value = 30;
                                }
                                setData((prev: any) => ({ ...prev, valueInPage: value }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-end space-x-2">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 space-x-2 rounded hover:bg-blue-600 text-sm flex items-center"
                            onClick={(e) => {
                                e.preventDefault();
                                GetReturnChequeList();
                            }}>
                            <CiSearch /> <span>Search</span>
                        </button>
                    </div>
                </div>
            </div>


            {Object.keys(data.returnChequeList).length > 0 && (
                            <div className="space-y-2">
                                {Object.keys(data.returnChequeList).map((org) => {
                                    const groupItems = data.returnChequeList[org];
                                    return (
                                        <div key={org} className="rounded border border-[#d3d3d3]">
                                            <button
                                                type="button"
                                                className="custAccoHead flex w-full items-center px-3 py-2 text-white-dark"
                                                onClick={() => setOpenOrg(openOrg === org ? null : org)}
                                            >
                                                <span>{org} ({groupItems.length})</span>
                                                <div className={`ltr:ml-auto rtl:mr-auto ${openOrg === org ? 'rotate-180' : ''}`}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5"
                                                            strokeLinecap="round" strokeLinejoin="round"></path>
                                                    </svg>
                                                </div>
                                            </button>
                                            <AnimateHeight duration={300} height={openOrg === org ? "auto" : 0}>
                                                <div className="p-2">
                                                    <div className="grid grid-cols-4 gap-4 font-semibold border-b pb-1 mb-1">
                                                        <span>DEALER</span>
                                                        <span className="text-center">PD DT.</span>
                                                        <span className="text-center">AMT</span>
                                                        <span className="text-center">STATUS</span>
                                                    </div>
                                                    <ul>
                                                        {groupItems.map((item: any, index: number) => (
                                                            <li key={index} className="grid grid-cols-4 gap-4 py-1">
                                                                <span>{item.dealer}</span>
                                                                <span className="text-center">{item.rcpt_date}</span>
                                                                <span className="text-center">{item.rcpt_amount}</span>
                                                                <span className="text-center">{item.rcpt_reversal_reason}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </AnimateHeight>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

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
}

export default TransactReturnCheque;