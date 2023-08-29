import { useState } from 'react';

export default function App() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const signIn = async (e) => {
		e.preventDefault();

		const res = await fetch('/api/sign-in', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password }),
		});

		if (!res.ok) {
			alert('登入失敗');
			return;
		}

		alert('登入成功');
		window.location.href = '/admin';
	};

	return (
		<>
			<form className="flex flex-col items-center">
				<h1 className="my-6 text-3xl font-bold">登入</h1>
				<label className="m-3" htmlFor="username">
					<span className="mr-3">帳號</span>
					<input
						type="text"
						name="username"
						id="username"
						className="rounded-md border border-gray-300 p-2"
						onChange={(e) => setUsername(e.target.value)}
					/>
				</label>
				<label className="m-3" htmlFor="password">
					<span className="mr-3">密碼</span>
					<input
						type="password"
						name="password"
						id="password"
						className="rounded-md border border-gray-300 p-2"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</label>
				<button
					type="submit"
					className="button mt-4 rounded-md bg-blue-500 px-4 py-2 text-white"
					onClick={signIn}
				>
					<span>登入</span>
				</button>
			</form>
		</>
	);
}
