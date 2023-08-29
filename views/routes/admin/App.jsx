import EditDialog from './EditDialog.jsx';
import { Icon } from '@iconify/react';
import mdiPencil from '@iconify-icons/mdi/pencil';
import mdiTrash from '@iconify-icons/mdi/trash-can-outline';
import { useLoaderData } from 'react-router-dom';
import { useState } from 'react';

/** @member {Transaction[]} transactions */

export default function App() {
	const data = useLoaderData();

	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [transaction, setTransaction] = useState(null);
	const [transactions, setTransactions] = useState(data.transactions);

	function editTransaction(transaction) {
		setTransaction(transaction);
		setIsEditDialogOpen(true);
	}

	const fetchTransactions = async () => {
		const response = await fetch('/api/transactions');
		const data = await response.json();
		setTransactions(data);
	};

	const deleteTransaction = async (id) => {
		await fetch(`/api/transactions/${id}`, {
			method: 'DELETE',
		});
		await fetchTransactions();
	};

	return (
		<main className="mx-3 md:mx-6">
			<header className="my-6">
				<h1 className="my-3 text-4xl font-medium">北護 ATM</h1>
				<p className="mt-1.5 text-xl">歡迎來到資管系 資料庫管理系統 DEMO</p>
			</header>
			<main className="my-6">
				<div className="overflow-hidden rounded-lg border">
					<table className="w-full bg-white shadow">
						<thead>
							<tr>
								<th className="border border-l-0 border-t-0 p-2">編號</th>
								<th className="border border-t-0 p-2">帳戶</th>
								<th className="border border-t-0 p-2">ATM</th>
								<th className="border border-t-0 p-2">類型</th>
								<th className="border border-t-0 p-2">交易內容</th>
								<th className="border border-t-0 p-2">金額</th>
								<th className="border border-t-0 p-2">交易日期</th>
								<th className="border border-t-0 p-2">更新人員</th>
								<th className="border border-r-0 border-t-0"></th>
							</tr>
						</thead>
						<tbody>
							{transactions.map((transaction) => (
								<tr className="group" key={transaction.id}>
									<td className="w-20 border border-l-0 p-2 text-center group-last:border-b-0">
										{transaction.id}
									</td>
									<td className="w-36 border p-2 text-center group-last:border-b-0">
										{transaction.account.accountId}
									</td>
									<td className="w-24 border p-2 text-center group-last:border-b-0">
										{transaction.atmId}
									</td>
									<td className="w-24 border p-2 text-center group-last:border-b-0">
										{transaction.type}
									</td>
									<td className="border p-2">{transaction.content}</td>
									<td className="w-32 border p-2 text-center group-last:border-b-0">
										{transaction.amount}
									</td>
									<td className="w-32 border p-2 text-center group-last:border-b-0">
										{new Date(transaction.issuedAt).toLocaleDateString()}
									</td>
									<td className="w-32 border p-2 text-center group-last:border-b-0">
										{transaction.updatedBy?.name ?? ''}
									</td>
									<td className="w-32 border border-r-0 p-2 text-center group-last:border-b-0">
										<button className="mx-2 p-1" onClick={() => editTransaction(transaction)}>
											<Icon icon={mdiPencil} className="h-6 w-6 text-emerald-500" />
										</button>
										<button className="mx-2 p-1" onClick={() => deleteTransaction(transaction.id)}>
											<Icon icon={mdiTrash} className="h-6 w-6 text-red-500" />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</main>

			<EditDialog
				isOpen={isEditDialogOpen}
				setIsOpen={setIsEditDialogOpen}
				transaction={transaction}
			/>
		</main>
	);
}
