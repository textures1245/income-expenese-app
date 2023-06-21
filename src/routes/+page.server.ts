import { prisma } from './../lib/server/prisma';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	return {
		incomes: await prisma.income.findMany(),
		expenses: await prisma.expense.findMany()
	};
};

export const actions: Actions = {
	createIncome: async ({ request }) => {
		const { amount, detail } = Object.fromEntries(await request.formData()) as {
			amount: string | number;
			detail: string;
		};
		try {
			await prisma.income.create({
				data: {
					amount: Number(amount),
					detail
				}
			});
		} catch (err) {
			console.error(err);
			return fail(500, { message: "Could't create Income marker" });
		}

		return { status: 201 };
	},

	createExpense: async ({ request }) => {
		const { amount, detail } = Object.fromEntries(await request.formData()) as {
			amount: string | number;
			detail: string;
		};
		try {
			await prisma.expense.create({
				data: {
					amount: Number(amount),
					detail
				}
			});
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
	}
};
