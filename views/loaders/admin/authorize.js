import { redirect } from 'react-router-dom';

export default async ({ request }) => {
	const url = new URL(request.url);

	const isSignedIn = await fetch('/api/session')
		.then((res) => res.json())
		.then(({ isSignedIn }) => !!isSignedIn);

	if (!isSignedIn && !url.pathname.match(/^\/admin\/sign-in/)) {
		return redirect('/admin/sign-in');
	}

	return { isSignedIn };
};
