import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

export default function App() {
	const data = useLoaderData();

	const [transaction, setTransaction] = useState({
		accountId: data.accounts[0].id,
		atmId: (Math.random() * 9 + 1).toFixed(0),
		type: '存款',
		content: '',
		amount: 0,
		issuedAt: new Date().toISOString().substring(0, 10),
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setTransaction((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const submit = async (e) => {
		e.preventDefault();

		const res = await fetch('/api/transactions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(transaction),
		});

		if (!res.ok) {
			alert('儲存失敗');
			return;
		}

		alert('儲存成功');
		window.location.href = '/';
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100">
			<div className="rounded-lg bg-white p-8 shadow-md">
				<h2 className="mb-4 text-2xl font-semibold">新增交易</h2>
				<form className="grid grid-cols-6 gap-4">
					<div className="col-span-3">
						<label htmlFor="account" className="block font-medium">
							帳戶
						</label>
						<select
							name="accountId"
							id="account"
							className="mt-1 w-full rounded border p-2"
							defaultValue={transaction.accountId}
							onChange={handleInputChange}
						>
							{data.accounts.map((account) => (
								<option key={account.id} value={account.id}>
									{account.accountId}
								</option>
							))}
						</select>
					</div>
					<div className="col-span-3">
						<label htmlFor="issuedAt" className="block font-medium">
							交易日期
						</label>
						<input
							type="date"
							id="issuedAt"
							name="issuedAt"
							className="mt-1 w-full rounded border p-2"
							value={transaction.issuedAt}
							readOnly
						/>
					</div>
					<div className="col-span-2">
						<label htmlFor="atmId" className="block font-medium">
							ATM 編號
						</label>
						<input
							type="number"
							id="atmId"
							name="atmId"
							className="mt-1 w-full rounded border p-2"
							value={transaction.atmId}
							readOnly
						/>
					</div>
					<div className="col-span-2">
						<label htmlFor="type" className="block font-medium">
							類型
						</label>
						<select
							id="type"
							name="type"
							className="mt-1 w-full rounded border p-2"
							defaultValue={transaction.type}
							onChange={handleInputChange}
						>
							<option value="存款">存款</option>
							<option value="提款">提款</option>
							<option value="轉入">轉入</option>
							<option value="轉出">轉出</option>
						</select>
					</div>
					<div className="col-span-2">
						<label htmlFor="amount" className="block font-medium">
							金額
						</label>
						<input
							type="number"
							id="amount"
							name="amount"
							className="mt-1 w-full rounded border p-2"
							defaultValue={transaction.amount}
							onChange={handleInputChange}
						/>
					</div>
					<div className="col-span-6">
						<label htmlFor="content" className="block font-medium">
							交易內容
						</label>
						<textarea
							id="content"
							name="content"
							className="mt-1 w-full rounded border p-2"
							rows="4"
							defaultValue={transaction.content}
							onChange={handleInputChange}
						/>
					</div>
					<div className="col-span-1 ml-auto">
						<button
							type="button"
							className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
							onClick={submit}
						>
							儲存
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
