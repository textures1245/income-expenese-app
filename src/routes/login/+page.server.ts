import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

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
		return { status: 201 };
		// throw redirect(302, '/');
	}
};
