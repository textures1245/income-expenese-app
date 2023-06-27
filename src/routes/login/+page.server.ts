import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// export const load: PageServerLoad = async () => {
// 	const res = localStorage.getItem('userData');
// 	initLocalStorage();
// 	let timeoutUser;
// 	if (res) {
// 		clearTimeout(timeoutUser);

// 		const userData: { email: string; timeout: number } = JSON.parse(res);
// 		currentUser.set(new User(true, userData.email, userData.timeout));
// 		timeoutUser = setTimeout(() => {
// 			currentUser.set(new User(false, null, null));
// 		}, userData.timeout);
// 	} else {
// 		alert('Please login before using application');
// 	}
// 	return {
// 		user: currentUser
// 	};
// };

export const actions: Actions = {
	signup: async ({ request }) => {
		const { email, password } = Object.fromEntries(await request.formData()) as {
			email: string;
			password: string;
		};

		try {
			await prisma.user.create({
				data: {
					userId: crypto.randomUUID(),
					email,
					password,
					incomes: undefined,
					expenses: undefined
				}
			});
		} catch (err) {
			console.error(err);
			return fail(500, { message: "Could't create User model" });
		}

		return { status: 201 };
	},

	login: async ({ request, cookies }) => {
		const { email, password } = Object.fromEntries(await request.formData()) as {
			email: string;
			password: string;
		};

		try {
			const user = await prisma.user.findFirst({
				where: {
					email,
					password
				}
			});

			if (user) {
				cookies.set('userEmail', user.email, {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge: 60 * 60 * 24 * 7
				});

				cookies.set('userId', user.id.toString(), {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production',
					maxAge: 60 * 60 * 24 * 7
				});
			}
		} catch (err) {
			console.error(err);
			return fail(500, { message: "Could't create User model" });
		}
		throw redirect(302, '/');
	}
};
