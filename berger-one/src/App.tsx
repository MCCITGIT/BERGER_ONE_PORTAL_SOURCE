import React, { Suspense } from 'react';
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
// Remove direct import of TLVRevisionRequestDetails to prevent MUI bundling during SSR
import TLVRevisionDepotApproval from './pages/protecton/TLV/TLVRevisionDepotApproval';
import TLVRevisionRSMApproval from './pages/protecton/TLV/TLVRevisionRSMApproval';
import TLVRevisionHoApproval from './pages/protecton/TLV/TLVRevisionHoApproval';
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

// Lazy load the MUI component to prevent SSR bundling
const TLVRevisionRequestDetails = React.lazy(() => import('./pages/protecton/TLV/TLVRevisionRequestDetails'));

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
          {
            path: '/Protecton/TLV/TLVRevisionDepotApproval',
            element: <TLVRevisionDepotApproval />,
          },
          {
            path: '/Protecton/TLV/TLVRevisionRSMApproval',
            element: <TLVRevisionRSMApproval />,
          },
          {
            path: '/Protecton/TLV/TLVRevisionHoApproval',
            element: <TLVRevisionHoApproval />,
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
          <Route path="/Protecton/TLV/TLVRevisionDepotApproval" element={<TLVRevisionDepotApproval />} />
          <Route path="/Protecton/TLV/TLVRevisionRSMApproval" element={<TLVRevisionRSMApproval />} />
          <Route path="/Protecton/TLV/TLVRevisionHoApproval" element={<TLVRevisionHoApproval />} />
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
        </Route>
        <Route path="/login/cover-login/" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App
