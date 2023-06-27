import { prisma } from './../lib/server/prisma';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { User, currentUser } from '../states/state';
import { onDestroy } from 'svelte';

export const load: PageServerLoad = async () => {
	let userId = -1;
	const userSubscriber = currentUser.subscribe(async (user) => (userId = user.userId));
	const statement = (await prisma.user.findUnique({
		where: {
			id: userId
		},
		include: {
			incomes: true,
			expenses: true
		}
	})) ?? { incomes: [], expenses: [] };

	return {
		incomes: statement.incomes ?? [],
		expenses: statement.expenses ?? []
	};
};

export const actions: Actions = {
	createIncome: async ({ request }) => {
		const { amount, detail } = Object.fromEntries(await request.formData()) as {
			amount: string | number;
			detail: string;
		};
		try {
			const userSubscriber = currentUser.subscribe(async (user) => {
				if (user.isLoggedIn) {
					await prisma.income.create({
						data: {
							detail,
							amount: Number(amount),
							ownerId: user.userId
						}
					});
				}
			});
			onDestroy(userSubscriber);
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
			const userSubscriber = currentUser.subscribe(async (user) => {
				if (user.isLoggedIn) {
					await prisma.expense.create({
						data: {
							detail,
							amount: Number(amount),
							ownerId: user.userId
						}
					});
				}
			});
			onDestroy(userSubscriber);
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
