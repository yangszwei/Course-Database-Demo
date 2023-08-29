export default async () => {
	const response = await fetch('/api/transactions');
	const transactions = await response.json();

	return {
		transactions,
	};
};
