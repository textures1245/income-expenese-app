import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Prisma } from '@prisma/client';
import { initLocalStorage } from '$lib/middleware/localStorage';
import { currentUser, User } from '../../lib/server/state';

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
			const newUser = await prisma.user.create({
				data: {
					userId: crypto.randomUUID(),
					email,
					password,
					incomes: [] as Prisma.IncomeCreateNestedManyWithoutOwnerInput,
					expenses: [] as Prisma.ExpenseCreateNestedManyWithoutOwnerInput
				}
			});
			if (newUser) {
				const sessionTimeout = 60 * 60 * 1000;
				currentUser.set(new User(true, newUser.email, sessionTimeout));
				const userData = { email: currentUser, timeout: 4096000 };
				localStorage.setItem('userData', JSON.stringify(userData));
			}
		} catch (err) {
			console.error(err);
			return fail(500, { message: "Could't create User model" });
		}

		return { status: 201 };
	},

	login: async ({ request }) => {
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
				const sessionTimeout = 60 * 60 * 1000;
				currentUser.set(new User(true, user.email, sessionTimeout));
				const userData = { email: currentUser, timeout: 4096000 };
				localStorage.setItem('userData', JSON.stringify(userData));
			}
		} catch (err) {
			console.error(err);
			return fail(500, { message: "Could't create User model" });
		}
	}
};
