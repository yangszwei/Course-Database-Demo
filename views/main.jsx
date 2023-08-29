import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Admin from './routes/admin/App.jsx';
import AdminSignIn from './routes/admin/sign-in/App.jsx';
import AdminLayout from './routes/admin/layout.jsx';
import Customer from './routes/App.jsx';
import CustomerSignIn from './routes/sign-in/App.jsx';
import authorizeAdmin from './loaders/admin/authorize.js';
import authorizeCustomer from './loaders/customer/authorize.js';
import loadAccounts from './loaders/customer/account.js';
import loadTransactions from './loaders/admin/transaction.js';
import './index.css';

const router = createBrowserRouter([
	{
		path: '/',
		loader: authorizeCustomer,
		children: [
			{ index: true, loader: loadAccounts, element: <Customer /> },
			{ path: 'sign-in', element: <CustomerSignIn /> },
		],
	},
	{
		path: '/admin',
		loader: authorizeAdmin,
		element: <AdminLayout />,
		children: [
			{ index: true, loader: loadTransactions, element: <Admin /> },
			{ path: 'sign-in', element: <AdminSignIn /> },
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
