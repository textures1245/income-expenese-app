import { prisma } from './../lib/server/prisma';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	//- route guard
	const userData = {
		userId: cookies.get('userId') || -1,
		email: cookies.get('userEmail') || null
	};
	if (userData.userId === -1) {
		throw redirect(303, '/login');
	}

	const statement = (await prisma.user.findFirst({
		where: {
			id: Number(userData.userId)
		},
		include: {
			incomes: true,
			expenses: true
		}
	})) ?? { incomes: [], expenses: [] };

	return {
		incomes: statement.incomes ?? [],
		expenses: statement.expenses ?? [],
		userData
	};
};

export const actions: Actions = {
	createIncome: async ({ request, cookies }) => {
		const { amount, detail } = Object.fromEntries(await request.formData()) as {
			amount: string | number;
			detail: string;
		};
		try {
			const userId = cookies.get('userId') || -1;
			if (userId !== -1) {
				await prisma.income.create({
					data: {
						detail,
						amount: Number(amount),
						ownerId: Number(userId)
					}
				});
			} else {
				throw redirect(303, '/login');
			}
		} catch (err) {
			console.error(err);
			return fail(500, { message: "Could't create Income marker" });
		}

		return { status: 201 };
	},

	createExpense: async ({ request, cookies }) => {
		const { amount, detail } = Object.fromEntries(await request.formData()) as {
			amount: string | number;
			detail: string;
		};
		try {
			const userId = cookies.get('userId') || -1;
			if (userId !== -1) {
				await prisma.expense.create({
					data: {
						detail,
						amount: Number(amount),
						ownerId: Number(userId)
					}
				});
			} else {
				throw redirect(303, '/login');
			}
		} catch (err) {
			console.error(err);
			return fail(500, { message: "Could't create Expense marker" });
		}

		return { status: 201 };
	},

	deleteList: async ({ request, url }) => {
		const id = url.searchParams.get('id');
		const { type } = Object.fromEntries(await request.formData()) as {
			type: 'Income' | 'Expense';
		};
		if (!id && !type) return fail(500, { message: 'list id or type action not found' });
		try {
			if (type === 'Income') {
				await prisma.income.delete({
					where: {
						id: Number(id)
					}
				});
			} else {
				await prisma.expense.delete({
					where: {
						id: Number(id)
					}
				});
			}
		} catch (err) {
			console.error(err);
			return fail(500, { message: "Could't delete list marker" });
		}
		return { status: 201 };
	},

	logout: async ({ cookies }) => {
		cookies.delete('userId');
		cookies.delete('userEmail');
		return { status: 204 };
	}
};
