import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { fail, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, url }) => {
	const getList = async () => {
		const type = url.searchParams.get('type') as 'Income' | 'Expense' | null;
		if (type === null) throw fail(500, { message: 'Could not find type' });
		let list;
		if (type === 'Income') {
			list = await prisma.income.findUnique({
				where: { id: Number(params.listId) }
			});
		} else {
			list = await prisma.expense.findUnique({
				where: { id: Number(params.listId) }
			});
		}

		if (!list) throw error(404, 'List not found');
		return list;
	};

	return {
		list: getList()
	};
};

export const actions: Actions = {
	updateList: async ({ request, params }) => {
		const { type, amount, detail } = Object.fromEntries(await request.formData()) as {
			amount: string | number;
			type: 'Income' | 'Expense' | null;
			detail: string;
		};
		console.log(type);
		if (type === null) throw fail(500, { message: 'Could not find type' });

		try {
			if (type === 'Income') {
				await prisma.income.update({
					where: { id: Number(params.listId) },
					data: {
						amount: Number(amount),
						detail
					}
				});
			} else {
				await prisma.expense.update({
					where: { id: Number(params.listId) },
					data: {
						amount: Number(amount),
						detail
					}
				});
			}
		} catch (err) {
            console.error(err);
			return fail(500, { message: "Could't create Expense marker" });
		}

		return { status: 201 };
	}
};
