import { Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
} from 'react-router-dom';
import './styles/custom.css';
// import './App.css';
import Login from './pages/login/Login'
import Dashboard from './pages/dashboard/Dashboard';
import FixedLayout from './pages/fixedLayout/FixedLayout';
import EPCAList from './pages/protecton/ePCA/EPCAList';
import EPCADetails from './pages/protecton/ePCA/EPCADetails';
import EPCADepotApprovalList from './pages/protecton/ePCA/EPCADepotApprovalList';
import EPCADepotApprovalDetails from './pages/protecton/ePCA/EPCADepotApprovalDetails';
import EPCARsmApprovalList from './pages/protecton/ePCA/EPCARsmApprovalList';
import EPCARsmApprovalDetails from './pages/protecton/ePCA/EPCARsmApprovalDetails';
import EPCAHOApprovalList from './pages/protecton/ePCA/EPCAHOApprovalList';
import EPCAHoApprovalDetails from './pages/protecton/ePCA/EPCAHoApprovalDetails';
import EPCACancellation from './pages/protecton/ePCA/EPCACancellation';
import TLVRevisionRequestList from './pages/protecton/TLV/TLVRevisionRequestList';
// import TLVRevisionDepotApproval from './pages/protecton/TLV/TLVRevisionDepotApproval';
// import TLVRevisionRSMApproval from './pages/protecton/TLV/TLVRevisionRSMApproval';
// import TLVRevisionHoApproval from './pages/protecton/TLV/TLVRevisionHoApproval';
// import TLVRevisionHoCommercialApproval from './pages/protecton/TLV/TLVRevisionHoCommercialApproval';
import TransactDsr from './pages/protecton/Transact/TransactDsr';
import TransactDespatch from './pages/protecton/Transact/TransactDespatch';
import TransactStock from './pages/protecton/Transact/TransactStock';
import TransactInvoice from './pages/protecton/Transact/TransactInvoice';
import TransactPaymentReceipt from './pages/protecton/Transact/TransactPaymentReceipt';
import TransactOdByDate from './pages/protecton/Transact/TransactOdByDate';
import TransactDefaulterList from './pages/protecton/Transact/TransactDefaulterList';
import TransactReturnCheque from './pages/protecton/Transact/TransactReturnCheque';
import TransactBilling from './pages/protecton/Transact/TransactBilling';
import TransactBillingCreate from './pages/protecton/Transact/TransactBillingCreate';
import TransactUserTracking from './pages/protecton/Transact/TransactUserTracking';
import TransactOutstanding from './pages/protecton/Transact/TransactOutstanding';
import TransactClientTracking from './pages/protecton/Transact/TransactClientTracking';
import PotentialLead from './pages/protecton/Lead/PotentialLead';
import MWAReportDetails from './pages/protecton/HoMarketing/MWAReportDetails';
import TSRMonitoringReport from './pages/protecton/HoMarketing/TSRMonitoringReport';
import ClientOnly from './components/ClientOnly';
import TLVRevisionRequestDetails from './pages/protecton/TLV/TLVRevisionRequestDetails';
import TLVRevisionDepotApproval1 from './pages/protecton/TLV/TLVRevisionDepotApproval1';
import FromMenuMaster from './pages/admin/app/FromMenuMaster';
import UserFormAccess from './pages/admin/UserFormAccess';
import PasswordHelper from './pages/admin/PasswordHelper';
import UserProfile from './pages/admin/user-profile/UserProfile';
import UserListViewNew from './pages/admin/users/UserListViewNew';
import TLVRevisionRSMApproval1 from './pages/protecton/TLV/TLVRevisionRSMApproval1';
import TLVRevisionHoApproval1 from './pages/protecton/TLV/TLVRevisionHoApproval1';
import TLVRevisionHoCommercialApproval1 from './pages/protecton/TLV/TLVRevisionHoCommercialApproval1';
import LeadGenerationReport from './pages/protecton/HoMarketing/LeadGenerationReport';
import ProductPromotionReport from './pages/protecton/HoMarketing/ProductPromotionReport';
import StakeholderReport from './pages/protecton/HoMarketing/StakeholderReport';
import EpcaReport from './pages/protecton/HoMarketing/EpcaReport';
import PoSchedulesReport from './pages/protecton/HoMarketing/PoSchedulesReport';
import CustNotVisitedReport from './pages/protecton/HoMarketing/CustNotVisitedReport';
import CompetitorActivityReport from './pages/protecton/HoMarketing/CompetitorActivityReport';
import ComplaintsReport from './pages/protecton/HoMarketing/ComplaintsReport';
import AppUsageReport from './pages/protecton/HoMarketing/AppUsageReport';
// import TLVRevisionRequestDetails1 from './pages/protecton/TLV/TLVRevisionRequestDetails';

// Lazy load the MUI component to prevent SSR bundling
// const TLVRevisionRequestDetails = React.lazy(() => import('./pages/protecton/TLV/TLVRevisionRequestDetails1'));

// Base URL configuration
// const BASE_URL = '/BERGERONE';

function App() {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';

  if (isBrowser) {
    // Client-side: Use createBrowserRouter
    const router = createBrowserRouter([
      {
        path: '/',
        element: <FixedLayout />,
        children: [
          {
            path: '/',
            element: <Dashboard />,
          },
          {
            path: "/admin/FromMenuMaster",
            element: <FromMenuMaster />,
          },
          {
            path: '/admin/UserFormAccess',
            element: <UserFormAccess />,
          },
          {
            path: '/admin/user-profile/UserProfile',
            element: <UserProfile />,
          },
          {
            path: '/admin/users/userListView',
            element: <UserListViewNew />,
          },
          {
            path: '/admin/PasswordHelper',
            element: <PasswordHelper />,
          },
          {
            path: '/Protecton/ePCA/EPCAList',
            element: <EPCAList />,
          },
          {
            path: '/Protecton/ePCA/EPCADetails',
            element: <EPCADetails />,
          },
          {
            path: '/Protecton/ePCA/EPCADepotApprovalList',
            element: <EPCADepotApprovalList />,
          },
          {
            path: '/Protecton/ePCA/EPCADepotApprovalDetails',
            element: <EPCADepotApprovalDetails />,
          },
          {
            path: '/Protecton/ePCA/EPCARsmApprovalList',
            element: <EPCARsmApprovalList />,
          },
          {
            path: '/Protecton/ePCA/EPCARsmApprovalDetails',
            element: <EPCARsmApprovalDetails />,
          },
          {
            path: '/Protecton/ePCA/EPCAHOApprovalList',
            element: <EPCAHOApprovalList />,
          },
          {
            path: '/Protecton/ePCA/EPCAHoApprovalDetails',
            element: <EPCAHoApprovalDetails />,
          },
          {
            path: '/Protecton/ePCA/EPCACancellation',
            element: <EPCACancellation />,
          },
          {
            path: '/Protecton/TLV/TLVRevisionRequestList',
            element: <TLVRevisionRequestList />,
          },
          // {
          //   path: '/Protecton/TLV/TLVRevisionRequestDetails1',
          //   element: <TLVRevisionRequestDetails1 />,
          // },
          {
            path: '/Protecton/TLV/TLVRevisionRequestDetails',
            element: (
              <ClientOnly>
                <Suspense fallback={<div>Loading...</div>}>
                  <TLVRevisionRequestDetails />
                </Suspense>
              </ClientOnly>
            ),
          },
          // {
          //   path: '/Protecton/TLV/TLVRevisionDepotApproval',
          //   element: <TLVRevisionDepotApproval />,
          // },
          {
            path: '/Protecton/TLV/TLVRevisionDepotApproval',
            element: <TLVRevisionDepotApproval1 />,
          },
          // {
          //   path: '/Protecton/TLV/TLVRevisionRSMApproval',
          //   element: <TLVRevisionRSMApproval />,
          // },
          {
            path: '/Protecton/TLV/TLVRevisionRSMApproval',
            element: <TLVRevisionRSMApproval1 />,
          },
          // {
          //   path: '/Protecton/TLV/TLVRevisionHoApproval',
          //   element: <TLVRevisionHoApproval />,
          // },
          {
            path: '/Protecton/TLV/TLVRevisionHoApproval',
            element: <TLVRevisionHoApproval1 />,
          },
          // {
          //   path: '/Protecton/TLV/TLVRevisionHoCommercialApproval',
          //   element: <TLVRevisionHoCommercialApproval />,
          // },
          {
            path: '/Protecton/TLV/TLVRevisionHoCommercialApproval',
            element: <TLVRevisionHoCommercialApproval1 />,
          },
          {
            path: '/Protecton/Transact/TransactDsr',
            element: <TransactDsr />,
          },
          {
            path: '/Protecton/Transact/TransactDespatch',
            element: <TransactDespatch />,
          },
          {
            path: '/Protecton/Transact/TransactStock',
            element: <TransactStock />,
          },
          {
            path: '/Protecton/Transact/TransactInvoice',
            element: <TransactInvoice />,
          },
          {
            path: '/Protecton/Transact/TransactPaymentReceipt',
            element: <TransactPaymentReceipt />,
          },
          {
            path: '/Protecton/Transact/TransactOdByDate',
            element: <TransactOdByDate />,
          },
          {
            path: '/Protecton/Transact/TransactDefaulterList',
            element: <TransactDefaulterList />,
          },
          {
            path: '/Protecton/Transact/TransactReturnCheque',
            element: <TransactReturnCheque />,
          },
          {
            path: '/Protecton/Transact/TransactBilling',
            element: <TransactBilling />,
          },
          {
            path: '/Protecton/Transact/TransactBillingCreate',
            element: <TransactBillingCreate />,
          },
          {
            path: '/Protecton/Transact/TransactUserTracking',
            element: <TransactUserTracking />,
          },
          {
            path: '/Protecton/Transact/TransactOutstanding',
            element: <TransactOutstanding />,
          },
          {
            path: '/Protecton/Transact/TransactClientTracking',
            element: <TransactClientTracking />,
          },
          {
            path: '/Protecton/Lead/PotentialLead',
            element: <PotentialLead />,
          },
          {
            path: '/Protecton/HoMarketing/MWAReportDetails',
            element: <MWAReportDetails />,
          },
          {
            path: '/Protecton/HoMarketing/TSRMonitoringReport',
            element: <TSRMonitoringReport />,
          },
          {
            path: '/Protecton/HoMarketing/LeadGenerationReport',
            element: <LeadGenerationReport />,
          },
          {
            path: '/Protecton/HoMarketing/ProductPromotionReport',
            element: <ProductPromotionReport />,
          },
          {
            path: '/Protecton/HoMarketing/StakeholderReport',
            element: <StakeholderReport />,
          },
          {
            path: '/Protecton/HoMarketing/EpcaReport',
            element: <EpcaReport />,
          },
          {
            path: '/Protecton/HoMarketing/PoSchedulesReport',
            element: <PoSchedulesReport />,
          },
          {
            path: '/Protecton/HoMarketing/CustNotVisitedReport',
            element: <CustNotVisitedReport />,
          },
          {
            path: '/Protecton/HoMarketing/CompetitorActivityReport',
            element: <CompetitorActivityReport />,
          },
          {
            path: '/Protecton/HoMarketing/ComplaintsReport',
            element: <ComplaintsReport />,
          },
          {
            path: '/Protecton/HoMarketing/AppUsageReport',
            element: <AppUsageReport />,
          },
        ],
      },
      {
        path: '/login/cover-login/',
        element: <Login />,
      },
    ], {
      basename: '/BERGERONE'
    });

    return (
      <div className="min-h-screen bg-blue-300 text-black">
        <RouterProvider router={router} />
      </div>
    );
  }

  // Server-side: Use static Routes
  return (
    <div className="min-h-screen bg-blue-300 text-black">
      <Routes>
        <Route path="/" element={<FixedLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/admin/FromMenuMaster" element={<FromMenuMaster />} />
          <Route path="/admin/UserFormAccess" element={<UserFormAccess />} />
          <Route path="/admin/user-profile/UserProfile" element={<UserProfile />} />
          <Route path="/admin/users/userListView" element={<UserListViewNew />} />
          <Route path="/admin/PasswordHelper" element={<PasswordHelper />} />
          <Route path="/Protecton/ePCA/EPCAList" element={<EPCAList />} />
          <Route path="/Protecton/ePCA/EPCADetails" element={<EPCADetails />} />
          <Route path="/Protecton/ePCA/EPCADepotApprovalList" element={<EPCADepotApprovalList />} />
          <Route path="/Protecton/ePCA/EPCADepotApprovalDetails" element={<EPCADepotApprovalDetails />} />
          <Route path="/Protecton/ePCA/EPCARsmApprovalList" element={<EPCARsmApprovalList />} />
          <Route path="/Protecton/ePCA/EPCARsmApprovalDetails" element={<EPCARsmApprovalDetails />} />
          <Route path="/Protecton/ePCA/EPCAHOApprovalList" element={<EPCAHOApprovalList />} />
          <Route path="/Protecton/ePCA/EPCAHoApprovalDetails" element={<EPCAHoApprovalDetails />} />
          <Route path="/Protecton/ePCA/EPCACancellation" element={<EPCACancellation />} />
          <Route path="/Protecton/TLV/TLVRevisionRequestList" element={<TLVRevisionRequestList />} />
          <Route path="/Protecton/TLV/TLVRevisionRequestDetails" element={
            <ClientOnly>
              <Suspense fallback={<div>Loading...</div>}>
                <TLVRevisionRequestDetails />
              </Suspense>
            </ClientOnly>
          } />
          <Route path="/Protecton/TLV/TLVRevisionDepotApproval" element={<TLVRevisionDepotApproval1 />} />
          <Route path="/Protecton/TLV/TLVRevisionRSMApproval" element={<TLVRevisionRSMApproval1 />} />
          <Route path="/Protecton/TLV/TLVRevisionHoApproval" element={<TLVRevisionHoApproval1 />} />
          <Route path="/Protecton/TLV/TLVRevisionHoCommercialApproval" element={<TLVRevisionHoCommercialApproval1 />} />
          <Route path="/Protecton/Transact/TransactDsr" element={<TransactDsr />} />
          <Route path="/Protecton/Transact/TransactDespatch" element={<TransactDespatch />} />
          <Route path="/Protecton/Transact/TransactStock" element={<TransactStock />} />
          <Route path="/Protecton/Transact/TransactInvoice" element={<TransactInvoice />} />
          <Route path="/Protecton/Transact/TransactPaymentReceipt" element={<TransactPaymentReceipt />} />
          <Route path="/Protecton/Transact/TransactOdByDate" element={<TransactOdByDate />} />
          <Route path="/Protecton/Transact/TransactDefaulterList" element={<TransactDefaulterList />} />
          <Route path="/Protecton/Transact/TransactReturnCheque" element={<TransactReturnCheque />} />
          <Route path="/Protecton/Transact/TransactBilling" element={<TransactBilling />} />
          <Route path="/Protecton/Transact/TransactBillingCreate" element={<TransactBillingCreate />} />
          <Route path="/Protecton/Transact/TransactUserTracking" element={<TransactUserTracking />} />
          <Route path="/Protecton/Transact/TransactOutstanding" element={<TransactOutstanding />} />
          <Route path="/Protecton/Transact/TransactClientTracking" element={<TransactClientTracking />} />
          <Route path="/Protecton/Lead/PotentialLead" element={<PotentialLead />} />
          <Route path="/Protecton/HoMarketing/MWAReportDetails" element={<MWAReportDetails />} />
          <Route path="/Protecton/HoMarketing/TSRMonitoringReport" element={<TSRMonitoringReport />} />
          <Route path="/Protecton/HoMarketing/LeadGenerationReport" element={<LeadGenerationReport />} />
          <Route path="/Protecton/HoMarketing/ProductPromotionReport" element={<ProductPromotionReport />} />
          <Route path="/Protecton/HoMarketing/StakeholderReport" element={<StakeholderReport />} />
          <Route path="/Protecton/HoMarketing/EpcaReport" element={<EpcaReport />} />
          <Route path="/Protecton/HoMarketing/PoSchedulesReport" element={<PoSchedulesReport />} />
          <Route path="/Protecton/HoMarketing/CustNotVisitedReport" element={<CustNotVisitedReport />} />
          <Route path="/Protecton/HoMarketing/CompetitorActivityReport" element={<CompetitorActivityReport />} />
          <Route path="/Protecton/HoMarketing/ComplaintsReport" element={<ComplaintsReport />} />
          <Route path="/Protecton/HoMarketing/AppUsageReport" element={<AppUsageReport />} />
        </Route>
        <Route path="/login/cover-login/" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App
