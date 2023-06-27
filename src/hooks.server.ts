import { redirect, type Handle } from '@sveltejs/kit';

export const handler: Handle = async ({ resolve, event }) => {
	const { cookies } = event;
	const isUserLoggedIn = cookies.get('userEmail');
	console.log(isUserLoggedIn);
	if (isUserLoggedIn === undefined) {
		throw redirect(303, '/login');
	}

	const response = await resolve(event);

	return response;
};
