import PropTypes from 'prop-types';
import favicon from '/favicon.ico';

const Navbar = ({ isSignedIn }) => {
	const signOut = async () => {
		await fetch('/api/sign-out', { method: 'POST' });
		window.location.href = '/';
	};

	return (
		<nav className="fixed inset-x-0 top-0 border-b">
			<div className="flex h-16 select-none bg-white px-3">
				<div className="flex h-full flex-1 items-center md:mx-3">
					<h1 className="flex items-center gap-3 text-xl">
						<img src={favicon} className="h-7 w-7" alt="" />
						<span>台北護理健康大學-資料庫課程</span>
					</h1>
				</div>
				<div className="flex h-full items-center md:mx-3">
					<ul>
						<li>
							{isSignedIn && (
								<button className="button" onClick={signOut}>
									登出
								</button>
							)}
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

Navbar.propTypes = {
	isSignedIn: PropTypes.bool.isRequired,
};

export default Navbar;
