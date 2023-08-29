import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import Page from './routes/App.jsx';
// import Layout from './routes/layout.jsx';
// import loadData from './loaders/loader.js';
import './index.css';

const router = createBrowserRouter([
	// This is an example of a layout with a child route.
	// {
	// 	path: '/',
	// 	element: <Layout />,
	// 	loader: loadData,
	// 	children: [{ path: '/', element: <Page /> }],
	// },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
