import '@fontsource/noto-sans-tc/400.css';
import '@fontsource/noto-sans-tc/500.css';
import Navbar from '$components/Navbar.jsx';
import { Outlet } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';

const Layout = () => {
	const data = useLoaderData();

	return (
		<>
			<Navbar isSignedIn={data.isSignedIn} />
			<main className="pt-16">
				<Outlet />
			</main>
		</>
	);
};

export default Layout;
