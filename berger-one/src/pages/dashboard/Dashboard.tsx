import { useEffect, useState } from 'react';
import Sand_Bucket from '../../assets/images/Sand_Bucket.png'
import rupee from '../../assets/images/rupee.png'
import * as dashboard from '../../services/api/protecton-dashboard';
import { UseAuthStore } from '../../services/store/AuthStore';
import * as common from '../../services/api/users/UserProfile';
import Select from 'react-select';
import addButton from '../../assets/images/add-button.svg'
import { Modal } from '@mantine/core';

const Dashboard = () => {

    const [isMWALoading, setIsMWALoading] = useState(false);
    const [isOverduesLoading, setIsOverduesLoading] = useState(false);
    const [selectedMWAOption, setSelectedMWAOption] = useState('self');
    const [data, setData] = useState<any>({
        dashboardLeadFunnelData: {},
        dashboardSaleReviewData: {},
        dashboardOverduesData: [],
        dashboardMWAData: [],
        regionList: [],
        selectedRegion: '',
        userGroupList: [],
        selectedUserGroup: '',
        applicableUserList: [],
        selectedApplicableUser: '',
        leadData: [],
    });

    const user = UseAuthStore((state: any) => state.userDetails);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');

    const GetDashboardLeadFunnel = async () => {
        try {
            const response: any = await dashboard.GetDashboardLeadFunnelData({});
            setData((prevData: any) => ({
                ...prevData,
                dashboardLeadFunnelData: response.data.table[0] || [],
            }));

        } catch (error) {
            return;
        }
    }

    const GetDashboardSales = async () => {
        setIsOverduesLoading(true);
        try {
            const response: any = await dashboard.GetDashboardSalesData({});
            setData((prevData: any) => ({
                ...prevData,
                dashboardSaleReviewData: response.data.table[0] || [],
                dashboardOverduesData: response.data.table1 || [],
            }));

        } catch (error) {
            return;
        } finally {
            setIsOverduesLoading(false);
        }
    }

    const GetMWAStatus = async (user: string) => {
        setIsMWALoading(true);
        const payload = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            SelectedUser: user
        }
        try {
            const response: any = await dashboard.GetMWAStatus(payload);
            setData((prevData: any) => ({
                ...prevData,
                dashboardMWAData: response.data || [],
            }));
        } catch (error) {
            return;
        } finally {
            setIsMWALoading(false);
        }
    }

    const GetDashboardLeadData = async () => {
        try {
            const response: any = await dashboard.GetDashboardLeadData({});
            setData((prevData: any) => ({
                ...prevData,
                leadData: response.data || [],
            }));
        } catch (error) {
            return;
        } finally {
        }
    }

    const calculateOverdueVariance = (ly: number, ty: number): number => {
        let growth = 0;
        if (ly !== 0) {
            growth = ((ty - ly) / ly) * 100;
        } else {
            growth = ty > 0 ? 100 : 0;
        }
        return parseFloat(growth.toFixed(0));
    };

    const GetRegion = async () => {
        // Only proceed if user exists (client-side)
        if (!user || !user.group_code) return;

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
    }

    const GetUserGroup = async () => {
        // Only proceed if user exists (client-side)
        if (!user || !user.group_code) return;

        const data: any = {
            user_group: user.group_code
        };
        try {
            const response: any = await dashboard.GetUserGroup(data);
            setData((prevData: any) => ({
                ...prevData,
                userGroupList: response.data.table || [],
            }));

        } catch (error) {
            return;
        }
    }

    const GetApplicableUserList = async () => {
        // Only proceed if user exists (client-side)
        if (!user || !user.group_code) return;

        const payload: any = {
            user_group: user.group_code,
            Regn: data.selectedRegion,
            group_code: data.selectedUserGroup
        };
        try {
            const response: any = await dashboard.GetApplicableUserList(payload);
            setData((prevData: any) => ({
                ...prevData,
                applicableUserList: response.data.table || [],
            }));

        } catch (error) {
            return;
        }
    }

    const handleMWAOptionChange = (event: { target: { value: string } }) => {
        const value = event.target.value;
        setSelectedMWAOption(value);
        if (value == 'self') {
            setData((pre: any) => ({ ...pre, selectedRegion: '', selectedUserGroup: '', selectedApplicableUser: '' }))
            // Only call if user exists
            if (user && user.user_id) {
                GetMWAStatus(user.user_id);
            }
        }
    };

    const handleUserChange = (selectedUser: string) => {
        // setData((pre: any) => ({ ...pre, selectedApplicableUser: selectedUser }))
        GetMWAStatus(selectedUser);
    }

    const handleCardClick = (title: string) => {
        setModalTitle(title);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        GetDashboardLeadFunnel();
        GetDashboardSales();
        GetDashboardLeadData();

        // Only call user-dependent functions if user exists (client-side)
        if (user && user.user_id) {
            GetMWAStatus(user.user_id);
            GetRegion();
            GetUserGroup();
        }
    }, [user]); // Add user as dependency

    useEffect(() => {
        if (data.selectedRegion && data.selectedUserGroup) {
            GetApplicableUserList();
        }
    }, [data.selectedUserGroup, data.selectedRegion]);
    return (
        <>
            <div className="page-titlebar flex items-center justify-between bg-white px-4 py-2">
                <h5 className="text-lg font-semibold dark:text-white-light">Berger One Dashboard</h5>
            </div>

            {/* Show loading state during SSR or when user is not available */}
            {!user && (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
            )}

            {/* Show dashboard content only when user is available */}
            {user && (
                <div className="grid grid-cols-12 gap-4 mt-4">
                    <div className="col-span-6 bg-white rounded-lg shadow-md p-4">
                        <div className="flex justify-between items-center">
                            <h5 className="text-lg font-semibold">Business Funnel</h5>
                            <div className="flex justify-end items-center mb-4 gap-2">
                                <img src={rupee} alt="" className='w-4 h-4' />
                                <p className="text-sm font-semibold">Value in Lakhs</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center space-y-2">
                            <div className="w-9/12 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 p-2 text-center rounded-full">Scope: {data.dashboardLeadFunnelData.val_total}</div>
                            <div className="w-7/12 font-semibold text-white bg-gradient-to-r from-amber-700 to-amber-600 p-2 text-center rounded-full">Estimation: {data.dashboardLeadFunnelData.val_negotiation}</div>
                            <div className="w-5/12 font-semibold text-white bg-gradient-to-r from-red-700 to-red-500 p-2 text-center rounded-t-full">Negotiation: {data.dashboardLeadFunnelData.val_estimation}</div>
                            <div className="w-7/12 flex justify-between">
                                <div className="text-red-800 font-semibold">{data.dashboardLeadFunnelData.val_order_lost} Order Lost</div>
                                <div className="text-red-800 font-semibold">Lead Value Lost {data.dashboardLeadFunnelData.val_lead_lost}</div>
                            </div>
                            <div className="w-4/12 font-semibold text-white bg-gradient-to-r from-blue-700 to-cyan-600 p-2 text-center rounded-b-full">Order Received: {data.dashboardLeadFunnelData.order_received}</div>

                            <div className="w-10/12 flex justify-around mt-16">
                                <div className="w-1/2 p-2 text-center rounded flex flex-col items-center">

                                    <svg
                                        width={55}
                                        height={76}
                                        viewBox="0 0 62 58"
                                        fill="none"
                                    >
                                        <path
                                            d="M14.393 32.107h-2.214a.37.37 0 00-.37.37v2.214a.37.37 0 00.37.368h2.214a.37.37 0 00.369-.368v-2.215a.37.37 0 00-.37-.369zm0 2.584h-2.214v-2.215h2.214v2.215zm3.69-2.584H15.87a.37.37 0 00-.369.37v2.214a.37.37 0 00.37.368h2.213a.37.37 0 00.37-.368v-2.215a.37.37 0 00-.37-.369zm0 2.584H15.87v-2.215h2.214v2.215zm-3.69 1.107h-2.214a.37.37 0 00-.37.369v2.214a.37.37 0 00.37.369h2.214a.37.37 0 00.369-.37v-2.213a.37.37 0 00-.37-.37zm0 2.583h-2.214v-2.214h2.214v2.214zm3.69-2.583H15.87a.37.37 0 00-.369.369v2.214a.37.37 0 00.37.369h2.213a.37.37 0 00.37-.37v-2.213a.37.37 0 00-.37-.37zm0 2.583H15.87v-2.214h2.214v2.214zm-3.69 1.107h-2.214a.37.37 0 00-.37.37v2.213a.37.37 0 00.37.37h2.214a.37.37 0 00.369-.37v-2.214a.37.37 0 00-.37-.369zm0 2.583h-2.214v-2.214h2.214v2.214zm3.69-2.583H15.87a.37.37 0 00-.369.37v2.213a.37.37 0 00.37.37h2.213a.37.37 0 00.37-.37v-2.214a.37.37 0 00-.37-.369zm0 2.583H15.87v-2.214h2.214v2.214zM43.917 35.06h2.214a.37.37 0 00.369-.37v-2.214a.37.37 0 00-.369-.369h-2.214a.37.37 0 00-.37.37v2.214a.37.37 0 00.37.368zm0-2.584h2.214v2.215h-2.214v-2.215zm3.69 2.584h2.215a.37.37 0 00.368-.37v-2.214a.37.37 0 00-.368-.369h-2.215a.37.37 0 00-.369.37v2.214a.37.37 0 00.37.368zm0-2.584h2.215v2.215h-2.215v-2.215zm-3.69 6.274h2.214a.37.37 0 00.369-.37v-2.213a.37.37 0 00-.369-.37h-2.214a.37.37 0 00-.37.37v2.214a.37.37 0 00.37.369zm0-2.583h2.214v2.214h-2.214v-2.214zm3.69 2.583h2.215a.37.37 0 00.368-.37v-2.213a.37.37 0 00-.368-.37h-2.215a.37.37 0 00-.369.37v2.214a.37.37 0 00.37.369zm0-2.583h2.215v2.214h-2.215v-2.214zm-3.69 6.273h2.214a.37.37 0 00.369-.369v-2.214a.37.37 0 00-.369-.369h-2.214a.37.37 0 00-.37.37v2.213a.37.37 0 00.37.37zm0-2.583h2.214v2.214h-2.214v-2.214zm3.69 2.583h2.215a.37.37 0 00.368-.37v-2.214a.37.37 0 00-.368-.369h-2.215a.37.37 0 00-.369.37v2.213a.37.37 0 00.37.37zm0-2.583h2.215v2.214h-2.215v-2.214zm-3.69 6.273h2.214a.37.37 0 00.369-.37v-2.213a.37.37 0 00-.369-.37h-2.214a.37.37 0 00-.37.37v2.214a.37.37 0 00.37.369zm0-2.583h2.214v2.214h-2.214v-2.214zm3.69 2.583h2.215a.37.37 0 00.368-.37v-2.213a.37.37 0 00-.368-.37h-2.215a.37.37 0 00-.369.37v2.214a.37.37 0 00.37.369zm0-2.583h2.215v2.214h-2.215v-2.214zm-3.69 6.273h2.214a.37.37 0 00.369-.369v-2.214a.37.37 0 00-.369-.369h-2.214a.37.37 0 00-.37.37v2.213a.37.37 0 00.37.37zm0-2.583h2.214v2.214h-2.214v-2.214zm3.69 2.583h2.215a.37.37 0 00.368-.369v-2.214a.37.37 0 00-.368-.369h-2.215a.37.37 0 00-.369.37v2.213a.37.37 0 00.37.37zm0-2.583h2.215v2.214h-2.215v-2.214zM35.368 9.768c.14.471.333.924.576 1.35.167.3.312.612.435.934a2.498 2.498 0 01-.191 2.152.367.367 0 00.128.507.37.37 0 00.506-.13 3.27 3.27 0 00.253-2.777 8.075 8.075 0 00-.477-1.028 5.746 5.746 0 01-.516-1.194 2.236 2.236 0 01.755-2.282.37.37 0 00-.462-.577 2.986 2.986 0 00-1.007 3.046z"
                                            fill="#2D4356"
                                        />
                                        <path
                                            d="M34.253 11.118c.167.3.312.612.435.934a2.498 2.498 0 01-.191 2.152.37.37 0 00.408.547.372.372 0 00.226-.17 3.268 3.268 0 00.252-2.777 8.06 8.06 0 00-.476-1.028 5.746 5.746 0 01-.516-1.194 2.236 2.236 0 01.755-2.282.37.37 0 00-.461-.576 2.985 2.985 0 00-1.008 3.045c.14.47.333.923.576 1.349zm10.402 7.703a.738.738 0 100-1.476.738.738 0 000 1.476zm0-1.107a.369.369 0 110 .737.369.369 0 010-.737zm-19.56-15.5a1.107 1.107 0 100-2.215 1.107 1.107 0 000 2.215zm0-1.66a.553.553 0 110 1.106.553.553 0 010-1.106zm10.334.922a.369.369 0 100-.738.369.369 0 000 .738zm0-.553a.184.184 0 110 .368.184.184 0 010-.368zm2.952 4.613a.738.738 0 100-1.475.738.738 0 000 1.475zm0-1.107a.369.369 0 110 .737.369.369 0 010-.737zM2.583 16.607a.738.738 0 10-1.476 0 .738.738 0 001.476 0zm-1.107 0a.37.37 0 11.739 0 .37.37 0 01-.739 0z"
                                            fill="#2D4356"
                                        />
                                        <path
                                            d="M56.095 52.59H54.62v-.554a.74.74 0 00-.738-.738h-1.476V20.855a.515.515 0 00-.524-.557c-.066-.001-.13.009-.192.03L38.75 24.312v-3.48a1.04 1.04 0 00-.716-.938l-.76-.214V15.87h.369a.37.37 0 000-.738h-4.06a.369.369 0 000 .738h.37v2.868l-9.987-2.838a.592.592 0 00-.402.01.517.517 0 00-.314.517v7.887l-12.939-3.986a.596.596 0 00-.402.011.518.518 0 00-.314.517v30.443H8.12a.74.74 0 00-.738.738v.553H5.905a.37.37 0 000 .738h50.19a.37.37 0 000-.738zM38.75 25.257a.318.318 0 01.196-.233l12.72-3.92V23.9L38.75 27.487v-2.23zm0 2.42l.048.178 12.869-3.573v2.569L38.75 30.439v-2.76zm0 2.953l.048.177 12.869-3.572v24.062H42.07V38.012a.74.74 0 00-.738-.738H38.75V30.63zm-4.06-14.762h1.846v3.602l-1.846-.524v-3.078zm-10.702.8l13.843 3.939a.314.314 0 01.18.225v16.44H23.989V16.67zm17.345 21.343v13.286H35.06V43.58a1.107 1.107 0 00-1.07-1.14h-5.98a1.107 1.107 0 00-1.07 1.14v5.07a.369.369 0 10.739 0v-5.07a.375.375 0 01.332-.402h5.978a.374.374 0 01.332.402v7.717H20.667V38.012h20.666zm-31-16.906l12.736 3.923a.32.32 0 01.181.229v2.229L10.333 23.9v-2.794zm0 3.177l12.869 3.573.048-.177v2.76l-12.917-3.587v-2.569zm0 2.953l12.869 3.572.048-.177v6.643h-2.583a.74.74 0 00-.739.738v13.286h-9.595V27.236zm-2.214 24.8h45.762v.553H8.119v-.553zm-4.06.553H2.215a.37.37 0 000 .738H4.06a.37.37 0 000-.738zM.369 53.327a.369.369 0 100-.738.369.369 0 000 .738zM59.786 52.59H57.94a.37.37 0 000 .737h1.846a.37.37 0 000-.738zM61.631 53.327a.37.37 0 100-.738.37.37 0 000 .738z"
                                            fill="#2D4356"
                                        />
                                        <path
                                            d="M27.31 50.56a.369.369 0 100-.738.369.369 0 000 .737zM5.75 1.48L6.3.76 5.953.562l-.352.809h-.012L5.231.568 4.88.77l.543.705v.011l-.85-.11v.393l.856-.11v.012l-.55.704.33.208.376-.814h.01l.347.808.364-.207-.554-.693v-.012l.872.104v-.392l-.872.115V1.48zM17.449 6.301v-.006l.502.06v-.226l-.502.066V6.19l.316-.416-.2-.113-.202.465h-.007l-.206-.462-.203.117.313.405v.007l-.49-.063v.226l.493-.063v.006l-.316.406.19.12.216-.47h.006l.2.466.21-.12-.32-.399zM18.74 15.894l-.317.405.19.12.216-.469h.006l.2.466.21-.12-.32-.4v-.006l.502.06v-.226l-.502.066v-.006l.316-.416-.2-.113-.202.466h-.007l-.206-.463-.203.117.313.405v.007l-.49-.063v.226l.493-.063v.007zM59.048 9.49v-.386l-.855.114v-.012l.538-.708-.34-.192-.345.793h-.012l-.351-.788-.346.199.533.69v.012l-.833-.108v.385l.838-.107v.011l-.538.691.323.204.368-.799h.011l.34.793.357-.203-.543-.68v-.012l.855.102zM48.14 1.692l.464-.61-.293-.166-.298.683h-.01L47.7.92l-.298.172.46.596v.01l-.72-.093v.332l.724-.093v.01l-.464.596.278.176.318-.69h.01l.293.685.308-.176-.47-.586v-.01l.738.088v-.332l-.737.097v-.01zM38.75 54.804h-15.5a.37.37 0 000 .738h6.643v.738h-3.69a.37.37 0 000 .738h9.964a.37.37 0 000-.738h-4.06v-.738h6.643a.37.37 0 000-.738zm5.167 0h-3.69a.37.37 0 000 .738h3.69a.37.37 0 000-.738zm-22.143 0h-3.69a.37.37 0 000 .738h3.69a.37.37 0 000-.738z"
                                            fill="#0BCEB2"
                                        />
                                    </svg>

                                    <p>Pending Order {data.dashboardLeadFunnelData.val_pending_supplies}</p>

                                </div>
                                <div className="w-1/2 p-2 text-center rounded flex flex-col items-center">
                                    <img src={Sand_Bucket} alt="" className='w-10 h-10 my-4' />
                                    <p>Supplied {data.dashboardLeadFunnelData.val_supplied}</p>
                                </div>
                            </div>


                        </div>

                    </div>

                    <div className="col-span-6 bg-white rounded-lg shadow-md p-4">
                        <div className="flex justify-between items-center">
                            <h5 className="text-lg font-semibold">Sales Review</h5>
                            <div className="flex justify-end items-center mb-4 gap-2">
                                <p className="text-xs font-semibold bg-green-200 px-4 py-1 rounded-full">As on: {data.dashboardSaleReviewData.as_on_date}</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300 text-sm text-center">
                                <thead className="bg-blue-100 text-gray-700 font-semibold">
                                    <tr>
                                        <th className="w-20 p-2"></th>
                                        <th className="p-2">Volume / Value</th>
                                        <th className="p-2">LY</th>
                                        <th className="p-2">TY</th>
                                        <th className="p-2">GRW%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* YTD */}
                                    <tr className="bg-blue-50">
                                        <td rowSpan={2} className="text-blue-600 font-bold p-2 align-middle">
                                            YTD
                                        </td>
                                        <td className="p-2">Volume (KL)</td>
                                        <td className="p-2">{data.dashboardSaleReviewData.ly_ytd_vol}</td>
                                        <td className="p-2">{data.dashboardSaleReviewData.ty_ytd_vol}</td>
                                        <td className={`p-2 font-semibold ${data.dashboardSaleReviewData.ytd_growth_vol >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                            }`}>{data.dashboardSaleReviewData.ytd_growth_vol} {data.dashboardSaleReviewData.ytd_growth_vol >= 0 ? "▲" : "▼"}</td>
                                    </tr>
                                    <tr className="even:bg-blue-50">
                                        <td className="p-2">Value (Lakh)</td>
                                        <td className="p-2">{data.dashboardSaleReviewData.ly_ytd_val}</td>
                                        <td className="p-2">{data.dashboardSaleReviewData.ty_ytd_val}</td>
                                        <td className={`p-2 font-semibold ${data.dashboardSaleReviewData.ytd_growth_val >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                            }`}>{data.dashboardSaleReviewData.ytd_growth_val} {data.dashboardSaleReviewData.ytd_growth_val >= 0 ? "▲" : "▼"}</td>
                                    </tr>

                                    {/* MTD */}
                                    <tr className="bg-blue-50 border-t-4 border-white">
                                        <td rowSpan={2} className="text-blue-600 font-bold p-2 align-middle">
                                            MTD
                                        </td>
                                        <td className="p-2">Volume (KL)</td>
                                        <td className="p-2">{data.dashboardSaleReviewData.ly_mtd_vol}</td>
                                        <td className="p-2">{data.dashboardSaleReviewData.ty_mtd_vol}</td>
                                        <td className={`p-2 font-semibold ${data.dashboardSaleReviewData.mtd_growth_vol >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                            }`}>{data.dashboardSaleReviewData.mtd_growth_vol} {data.dashboardSaleReviewData.mtd_growth_vol >= 0 ? "▲" : "▼"}</td>
                                    </tr>
                                    <tr className="even:bg-blue-50">
                                        <td className="p-2">Value (Lakh)</td>
                                        <td className="p-2">{data.dashboardSaleReviewData.ly_mtd_val}</td>
                                        <td className="p-2">{data.dashboardSaleReviewData.ty_mtd_val}</td>
                                        <td className={`p-2 font-semibold ${data.dashboardSaleReviewData.mtd_growth_val >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                            }`}>{data.dashboardSaleReviewData.mtd_growth_val} {data.dashboardSaleReviewData.mtd_growth_val >= 0 ? "▲" : "▼"}</td>
                                    </tr>

                                    {/* TODAY */}
                                    <tr className="bg-blue-50 border-t-4 border-white">
                                        <td rowSpan={2} className="text-blue-600 font-bold p-2 align-middle">
                                            TODAY
                                        </td>
                                        <td className="p-2">Volume (KL)</td>
                                        <td className="p-2">{data.dashboardSaleReviewData.ly_tod_vol}</td>
                                        <td className="p-2">{data.dashboardSaleReviewData.ty_tod_vol}</td>
                                        <td className={`p-2 font-semibold ${data.dashboardSaleReviewData.tod_growth_vol >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                            }`}>{data.dashboardSaleReviewData.tod_growth_vol} {data.dashboardSaleReviewData.tod_growth_vol >= 0 ? "▲" : "▼"}</td>
                                    </tr>
                                    <tr className="even:bg-blue-50">
                                        <td className="p-2">Value (Lakh)</td>
                                        <td className="p-2">{data.dashboardSaleReviewData.ly_tod_val}</td>
                                        <td className="p-2">{data.dashboardSaleReviewData.ty_tod_val}</td>
                                        <td className={`p-2 font-semibold ${data.dashboardSaleReviewData.tod_growth_val >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                            }`}>{data.dashboardSaleReviewData.tod_growth_val} {data.dashboardSaleReviewData.tod_growth_val >= 0 ? "▲" : "▼"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>

                </div>
            )}
            <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 bg-white rounded-lg shadow-md p-4">
                    <div className="flex justify-between items-center">
                        <h5 className="text-lg font-semibold">Overdues</h5>

                        <div className="flex justify-end items-center mb-4 gap-2">
                            <p className="text-xs font-semibold bg-green-200 px-4 py-1 rounded-full">As on: {data.dashboardOverduesData[0]?.as_on_date}</p>
                        </div>
                    </div>

                    {isOverduesLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300 text-sm text-center">
                                <thead className="bg-blue-100 text-gray-700 font-semibold">
                                    <tr>
                                        <th className="w-20 p-2 min-w-max text-left">Dues</th>
                                        <th className="p-2">Last Monthend</th>
                                        <th className="p-2">As On Date</th>
                                        <th className="p-2">Variance%</th>
                                        <th className="p-2">ODOS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.dashboardOverduesData?.map((item: any, index: number) => (
                                        <tr key={index} className='bg-blue-50'>
                                            <td className="p-2 text-left">{item.od_lvl}</td>
                                            <td className="p-2">{item.od_val_mtd}</td>
                                            <td className="p-2">{item.od_val_ytd}</td>
                                            <td className="p-2">{calculateOverdueVariance(item.od_val_ytd, item.od_val_mtd)}</td>
                                            <td className="p-2">{item.od_val_odos}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}


                </div>


                <div className="col-span-6 bg-white rounded-lg shadow-md p-2">
                    <div className="flex justify-between items-center">
                        <h5 className="text-lg font-semibold">MWA</h5>

                        <div className="flex items-center gap-6 mb-2">
                            <div className="flex bg-white rounded-full shadow px-1 py-0 w-fit">
                                <button
                                    type="button"
                                    onClick={() => handleMWAOptionChange({ target: { value: 'self' } })}
                                    className={`px-8 py-2 rounded-full font-medium focus:outline-none transition-all duration-150
                            ${selectedMWAOption === 'self'
                                            ? 'bg-blue-600 text-white shadow'
                                            : 'bg-white text-gray-700'
                                        }`}
                                    style={{ border: 'none' }}
                                >
                                    Self
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMWAOptionChange({ target: { value: 'other' } })}
                                    className={`px-8 py-2 rounded-full font-medium focus:outline-none transition-all duration-150
                            ${selectedMWAOption === 'other'
                                            ? 'bg-blue-600 text-white shadow'
                                            : 'bg-white text-gray-700'
                                        }`}
                                    style={{ border: 'none' }}
                                >
                                    Other
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end items-center mb-4 gap-2">
                            <p
                                className={`text-xs font-semibold px-4 py-1 rounded-full 
                                        ${data.dashboardMWAData?.table1?.[0]?.status_txt === "Q"
                                        ? "bg-green-200 text-green-600"
                                        : "bg-red-200 text-red-600"
                                    }`}
                            >
                                Qualification Status: {data.dashboardMWAData?.table1?.[0]?.status_txt === "Q" ? "▲" : "▼"}
                            </p>
                        </div>
                    </div>



                    {selectedMWAOption == 'other' && (
                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <div className='col-span-4'>
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
                                    onChange={(event: any) => {
                                        setData((pre: any) => ({ ...pre, selectedRegion: event?.value }))
                                    }}
                                />
                            </div>
                            <div className='col-span-4'>
                                <label className="block text-sm font-semibold mb-1">User Group:</label>
                                <Select
                                    className="text-sm"
                                    isSearchable={true}
                                    options={[
                                        ...data.userGroupList.map((d: any) => ({
                                            value: d.grp_user_group_code,
                                            label: d.grp_user_group_desc,
                                        })),
                                    ]}
                                    value={
                                        data.selectedUserGroup
                                            ? { value: data.selectedUserGroup, label: data.selectedUserGroup }
                                            : null
                                    }
                                    onChange={(event: any) => {
                                        setData((pre: any) => ({ ...pre, selectedUserGroup: event?.value }))
                                    }}
                                />
                            </div>
                            {data.selectedRegion && data.selectedUserGroup && data.applicableUserList.length > 0 && (
                                <div className='col-span-4'>
                                    <label className="block text-sm font-semibold mb-1">User:</label>
                                    <Select
                                        className="text-sm"
                                        isSearchable={true}
                                        options={[
                                            ...data.applicableUserList.map((d: any) => ({
                                                value: d.usp_user_id,
                                                label: d.usp_user_name,
                                            })),
                                        ]}
                                        value={
                                            data.selectedApplicableUser
                                                ? { value: data.selectedApplicableUser, label: data.selectedApplicableUser }
                                                : null
                                        }
                                        onChange={(event: any) => {
                                            handleUserChange(event?.value)
                                            setData((pre: any) => ({ ...pre, selectedApplicableUser: event?.label }))
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {isMWALoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300 text-sm text-center">
                                <thead className="bg-blue-100 text-gray-700 font-semibold">
                                    <tr>
                                        <th className="w-20 p-2 min-w-max text-left">Type</th>
                                        <th className="p-2">Oracle Customer</th>
                                        <th className="p-2">New Customer</th>
                                        <th className="p-2">Total Visits</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.dashboardMWAData?.table?.map((item: any, index: number) => (
                                        <tr key={index} className='bg-blue-50'>
                                            <td className="p-2 text-left">{item.cat_type_desc}</td>
                                            <td className="p-2">{item.active_dlr}</td>
                                            <td className="p-2">{item.visit_dlr}</td>
                                            <td className="p-2">{item.total_visit}</td>
                                        </tr>
                                    ))}

                                    <tr className="bg-blue-50">
                                        <td className="p-2 text-left whitespace-nowrap">Total No. of Visits</td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2">{data.dashboardMWAData?.table1?.[0]?.total_count || 0}</td>
                                    </tr>
                                    <tr className="bg-blue-50">
                                        <td className="p-2 text-left whitespace-nowrap">Online Visits %</td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2">{data.dashboardMWAData?.table1?.[0]?.online_count || 0}</td>
                                    </tr>
                                    <tr className="bg-blue-50">
                                        <td className="p-2 text-left whitespace-nowrap">Offline Visits %</td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2">{data.dashboardMWAData?.table1?.[0]?.offline_count || 0}</td>
                                    </tr>
                                    <tr className="bg-blue-50">
                                        <td className="p-2 text-left whitespace-nowrap">Target No. of Visits</td>
                                        <td className="p-2"></td>
                                        <td className="p-2"></td>
                                        <td className="p-2">{data.dashboardMWAData?.table1?.[0]?.target_count || 0}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}



                </div>
            </div>

            <div className="mt-4 bg-white rounded-lg shadow-md">
                <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-6 p-4 flex justify-between items-center">
                        <h5 className="text-lg font-semibold">Lead Management</h5>
                        <button className="flex items-center gap-2 font-semibold bg-gradient-to-b from-blue-500 to-blue-950 text-white px-6 py-3 rounded-md"> New <img src={addButton} alt="add" className="w-6 h-6" /></button>
                    </div>

                    <div className="col-span-2 p-2 flex flex-col justify-between items-center bg-gradient-to-r from-blue-800 to-blue-900 m-2 rounded-md text-white">
                        <p className='font-semibold'>{data.leadData.table?.[0]?.lead_converted || 0}</p>
                        <label>Converted</label>
                    </div>
                    <div className="col-span-2 p-2 flex flex-col justify-between items-center bg-gradient-to-r from-blue-800 to-blue-900 m-2 rounded-md text-white">
                        <p className='font-semibold'>{data.leadData.table?.[0]?.lead_asigned || 0}</p>
                        <label>Assigned</label>
                    </div>
                    <div className="col-span-2 p-2 flex flex-col justify-between items-center bg-gradient-to-r from-blue-800 to-blue-900 m-2 rounded-md text-white">
                        <p className='font-semibold'>{data.leadData.table?.[0]?.lead_convertion_ratio || 0}</p>
                        <label>Converted ratio</label>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-3 p-4">
                        <div className="flex justify-between items-center bg-gradient-to-r from-blue-800 to-blue-900 p-4 rounded-md text-white font-semibold">
                            <label>Lead Creation</label>
                            <p>{data.leadData.table?.[0]?.lead_created || 0}</p>
                        </div>

                        <div className="rounded-md bg-gradient-to-r from-blue-50 to-blue-100 p-1 mt-2 font-semibold">
                            <div className="flex justify-between items-center p-1">
                                <label>By Self</label>
                                <p className="bg-blue-800 px-2 rounded-full text-white">{data.leadData.table1?.[0]?.lead_creation_self || 0}</p>
                            </div>
                            <div className="flex justify-between items-center p-1">
                                <label>To Other Protecton</label>
                                <p className="bg-blue-800 px-2 rounded-full text-white">{data.leadData.table1?.[0]?.lead_creation_opl || 0}</p>
                            </div>
                            <div className="flex justify-between items-center p-1">
                                <label>To GI</label>
                                <p className="bg-blue-800 px-2 rounded-full text-white">{data.leadData.table1?.[0]?.lead_creation_gi || 0}</p>
                            </div>
                            <div className="flex justify-between items-center p-1">
                                <label>To AUTO</label>
                                <p className="bg-blue-800 px-2 rounded-full text-white">{data.leadData.table1?.[0]?.lead_creation_auto || 0}</p>
                            </div>
                            <div className="flex justify-between items-center p-1">
                                <label>To PROLINKS</label>
                                <p className="bg-blue-800 px-2 rounded-full text-white">{data.leadData.table1?.[0]?.lead_creation_prolinks || 0}</p>
                            </div>
                            <div className="flex justify-between items-center p-1">
                                <label>To POWDER</label>
                                <p className="bg-blue-800 px-2 rounded-full text-white">{data.leadData.table1?.[0]?.lead_creation_powder || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-3 p-4">
                        <div className="flex justify-between items-center bg-gradient-to-r from-blue-800 to-blue-900 p-4 rounded-md text-white font-semibold">
                            <label>Assign</label>
                            <p className="text-xs">Visited / Assigned</p>
                        </div>

                        <div className="rounded-md bg-gradient-to-r from-blue-50 to-blue-100 p-1 mt-2 font-semibold">
                            <div className="flex justify-between items-center p-1">
                                <label>From GI</label>
                                <p className="bg-blue-800 px-2 rounded-full text-white">{data.leadData.table2?.[0]?.lead_visited_gi || 0} / {data.leadData.table2?.[0]?.lead_asigned_gi || 0}</p>
                            </div>
                            <div className="flex justify-between items-center p-1">
                                <label>From AUTO</label>
                                <p className="bg-blue-800 px-2 rounded-full text-white">{data.leadData.table2?.[0]?.lead_visited_auto || 0} / {data.leadData.table2?.[0]?.lead_asigned_auto || 0}</p>
                            </div>
                            <div className="flex justify-between items-center p-1">
                                <label>From PROLINKS</label>
                                <p className="bg-blue-800 px-2 rounded-full text-white">{data.leadData.table2?.[0]?.lead_visited_prolinks || 0} / {data.leadData.table2?.[0]?.lead_asigned_prolinks || 0}</p>
                            </div>
                            <div className="flex justify-between items-center p-1">
                                <label>From Protecton</label>
                                <p className="bg-blue-800 px-2 rounded-full text-white">{data.leadData.table2?.[0]?.lead_visited_protecton || 0} / {data.leadData.table2?.[0]?.lead_asigned_protecton || 0}</p>
                            </div>
                            <div className="flex justify-between items-center p-1">
                                <label>From POWDER</label>
                                <p className="bg-blue-800 px-2 rounded-full text-white">{data.leadData.table2?.[0]?.lead_visited_powder || 0} / {data.leadData.table2?.[0]?.lead_asigned_powder || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-6 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                            {/* Card 1 */}
                            <div
                                className="bg-gradient-to-b from-white to-blue-100 rounded-lg shadow-md flex flex-col justify-center items-center aspect-square w-full border-t-4 border-blue-800 cursor-pointer"
                                onClick={() => handleCardClick('New Leads')}
                            >
                                <h3 className="text-lg font-semibold mb-2 text-blue-900">New Lead Assigned</h3>
                                <p className="text-3xl font-bold text-blue-800 mb-1">{data.leadData.table3?.length || 0}</p>
                                <span className="text-gray-500 text-sm">View all</span>
                            </div>
                            {/* Card 2 */}
                            <div
                                className="bg-gradient-to-b from-white to-blue-100 rounded-lg shadow-md flex flex-col justify-center items-center aspect-square w-full border-t-4 border-blue-800 cursor-pointer"
                                onClick={() => handleCardClick('Lead Status Updates')}
                            >
                                <h3 className="text-lg font-semibold mb-2 text-blue-900">Lead Status Update</h3>
                                <p className="text-3xl font-bold text-blue-800 mb-1">{data.leadData.table4?.length || 0}</p>
                                <span className="text-gray-500 text-sm">View all</span>
                            </div>
                            {/* Card 3 */}
                            <div
                                className="bg-gradient-to-b from-white to-blue-100 rounded-lg shadow-md flex flex-col justify-center items-center aspect-square w-full border-t-4 border-blue-800 cursor-pointer"
                                onClick={() => handleCardClick('Lead Due Date Intimations')}
                            >
                                <h3 className="text-lg font-semibold mb-2 text-blue-900">Lead Working Due Date</h3>
                                <p className="text-3xl font-bold text-blue-800 mb-1">{data.leadData.table5?.length || 0}</p>
                                <span className="text-gray-500 text-sm">View all</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <Modal
                opened={isModalOpen}
                onClose={closeModal}
                centered
                size="80vw"
            >
                <div className="">
                    <h2 className="text-xl font-bold mb-4">{modalTitle}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(modalTitle === 'New Leads' && data.leadData.table3?.length > 0) && data.leadData.table3.map((lead: any, idx: number) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl shadow-md p-5 pb-3 relative border border-gray-100 flex flex-col 
                                hover:bg-blue-50 transition-all duration-200 cursor-pointer hover:shadow-lg hover:border-blue-200 hover:scale-105"
                            >
                                <span className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-medium px-2 py-[2px] rounded">
                                    Assigned: {lead.assigned_date}
                                </span>
                                <h4 className="text-lg font-semibold text-blue-700 my-2">
                                    {lead.project_name}
                                </h4>

                                <p className="text-sm mb-1">
                                    <span className="font-medium">Lead Source:</span> {lead.lead_vertical}
                                </p>
                                <p className="text-sm mb-1">
                                    <span className="font-medium">Region:</span> {lead.region}
                                </p>
                                <p className="text-sm mb-1">
                                    <span className="font-medium">Status:</span> {lead.work_status_disp}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {lead.project_city}, {lead.project_pin}
                                </p>
                            </div>
                        ))}
                        {(modalTitle === 'Lead Status Updates' && data.leadData.table4?.length > 0) && data.leadData.table4.map((lead: any, idx: number) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl shadow-md p-5 pb-3 relative border border-gray-100 flex flex-col
                                hover:bg-blue-50 transition-all duration-200 cursor-pointer hover:shadow-lg hover:border-blue-200 hover:scale-105"
                            >
                                <span className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-medium px-2 py-[2px] rounded">
                                    Modified: {lead.modified_date}
                                </span>
                                <h4 className="text-lg font-semibold text-blue-700 my-2">
                                    {lead.project_name}
                                </h4>

                                <p className="text-sm mb-1">
                                    <span className="font-medium">Lead Source:</span> {lead.lead_vertical}
                                </p>
                                <p className="text-sm mb-1">
                                    <span className="font-medium">Region:</span> {lead.region}
                                </p>
                                <p className="text-sm mb-1">
                                    <span className="font-medium">Status:</span> {lead.work_status_disp}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {lead.project_city}, {lead.project_pin}
                                </p>
                            </div>
                        ))}
                        {(modalTitle === 'Lead Due Date Intimations' && data.leadData.table5?.length > 0) && data.leadData.table5.map((lead: any, idx: number) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl shadow-md p-5 pb-3 relative border border-gray-100 flex flex-col
                                hover:bg-blue-50 transition-all duration-200 cursor-pointer hover:shadow-lg hover:border-blue-200 hover:scale-105"
                            >
                                <span className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-medium px-2 py-[2px] rounded">
                                    Next Follow Up: {lead.follow_up_date}
                                </span>
                                <h4 className="text-lg font-semibold text-blue-700 my-2">
                                    {lead.project_name}
                                </h4>

                                <p className="text-sm mb-1">
                                    <span className="font-medium">Lead Source:</span> {lead.lead_vertical}
                                </p>
                                <p className="text-sm mb-1">
                                    <span className="font-medium">Region:</span> {lead.region}
                                </p>
                                <p className="text-sm mb-1">
                                    <span className="font-medium">Status:</span> {lead.work_status_disp}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {lead.project_city}, {lead.project_pin}
                                </p>
                            </div>
                        ))}
                        {/* Show message if no data */}
                        {((modalTitle === 'New Leads' && (!data.leadData.table3 || data.leadData.table3.length === 0)) ||
                            (modalTitle === 'Lead Status Updates' && (!data.leadData.table4 || data.leadData.table4.length === 0)) ||
                            (modalTitle === 'Lead Due Date Intimations' && (!data.leadData.table5 || data.leadData.table5.length === 0))) && (
                                <div className="col-span-3 text-center text-gray-500 py-8">
                                    No data available.
                                </div>
                            )}
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default Dashboard