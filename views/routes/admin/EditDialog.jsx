import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function EditDialog({ isOpen, setIsOpen, transaction }) {
	// Temporary state for editing transaction
	const [tempTransaction, setTempTransaction] = useState(transaction);

	useEffect(() => {
		setTempTransaction(transaction);
	}, [transaction]);

	async function saveTransaction() {
		const res = await fetch(`/api/transactions/${tempTransaction.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				atmId: tempTransaction.atmId,
				type: tempTransaction.type,
				content: tempTransaction.content,
				amount: tempTransaction.amount,
				issuedAt: tempTransaction.issuedAt,
			}),
		});

		if (!res.ok) {
			alert('儲存失敗');
		}

		closeModal();
	}

	function closeModal() {
		setIsOpen(false);
	}

	if (!tempTransaction) {
		return null;
	}

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={closeModal}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
									編輯交易紀錄
								</Dialog.Title>
								<div className="mt-2">
									<form className="grid grid-cols-6 gap-4">
										<div className="col-span-3">
											<label htmlFor="id" className="block font-medium">
												帳戶
											</label>
											<input
												type="text"
												id="id"
												name="id"
												className="mt-1 w-full rounded border p-2"
												value={tempTransaction.account.accountId}
												readOnly
											/>
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
												defaultValue={new Date().toISOString().substring(0, 10)}
												onChange={(e) => {
													setTempTransaction({
														...tempTransaction,
														issuedAt: new Date(e.target.value).getTime(),
													});
												}}
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
												defaultValue={tempTransaction.atmId}
												onChange={(e) => {
													setTempTransaction({ ...tempTransaction, atmId: e.target.value });
												}}
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
												defaultValue={tempTransaction.type}
												onChange={(e) => {
													setTempTransaction({ ...tempTransaction, type: e.target.value });
												}}
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
												defaultValue={tempTransaction.amount}
												onChange={(e) => {
													setTempTransaction({ ...tempTransaction, amount: e.target.value });
												}}
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
												defaultValue={tempTransaction.content}
												onChange={(e) => {
													setTempTransaction({ ...tempTransaction, content: e.target.value });
												}}
											/>
										</div>
										<div className="col-span-1 col-start-5 ml-auto">
											<button
												type="button"
												className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
												onClick={closeModal}
											>
												取消
											</button>
										</div>
										<div className="col-span-1 ml-auto">
											<button
												type="button"
												className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
												onClick={saveTransaction}
											>
												儲存
											</button>
										</div>
									</form>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

EditDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	transaction: PropTypes.object,
};

export default EditDialog;
