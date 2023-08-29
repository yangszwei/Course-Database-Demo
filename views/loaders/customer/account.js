export default async () => {
	const response = await fetch('/api/customer/accounts');
	const accounts = await response.json();

	return {
		accounts,
	};
};
