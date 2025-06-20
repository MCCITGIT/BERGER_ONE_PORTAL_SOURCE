import {
  createBrowserRouter,
  RouterProvider,
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
import TLVRevisionRequestDetails from './pages/protecton/TLV/TLVRevisionRequestDetails';
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


function App() {
  // const user = UseAuthStore((state: any) => state.userDetails);
  // console.log(user?.user_id)
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
          element: <TLVRevisionRequestDetails />,
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
      ],
    },
    {
      path: '/login/cover-login/',
      element: <Login />,
    },
  ]);

  return (
    <div className="min-h-screen bg-blue-300 text-black">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
