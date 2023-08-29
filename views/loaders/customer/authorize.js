import { redirect } from 'react-router-dom';

export default async ({ request }) => {
	const url = new URL(request.url);

	const isSignedIn = await fetch('/api/customer')
		.then((res) => res.json())
		.then(({ isSignedIn }) => !!isSignedIn);

	if (!isSignedIn && !url.pathname.match(/^\/sign-in/)) {
		return redirect('/sign-in');
	}

	return { isSignedIn };
};
