<script lang="ts">
	import type { PageData } from './$types';
	import { watch } from './../lib/middleware/watch';

	let methodSelected = '';
	let statementOpts = {
		statementFilter: 'All',
		statementDate: 'Today',
		statementFilterOpts: ['All', 'Income', 'Expense'],
		statementDateOpts: ['Today', 'Others']
	};

	export let data: PageData;
	let lists: any[] = [];
	$: {
		lists = [...data.incomes, ...data.expenses].sort(
			(a, b) => a.Date.getSeconds() - b.Date.getSeconds()
		);
	}

	watch(statementOpts.statementFilter, ($filter: string) => {
		lists =
			$filter === 'All' ? lists : lists.filter((l) => l.type === statementOpts.statementFilter);
	});

	watch(statementOpts.statementDateOpts, ($dateSelected: string) => {
		lists =
			$dateSelected === 'Today'
				? lists.filter(
						(l) => new Date(l.Date).toLocaleDateString() === new Date().toLocaleDateString()
				  )
				: lists;
	});
</script>

<section />

<div class="headings">
	<h1>Income - Expenses Application</h1>
	<h2>Simple app working with svelteKit + prisma + sqlite</h2>
</div>

<div id="wrapper" class="grid">
	<div style="height: 80%;">
		<h2>Today</h2>
		<select id="DateSelector" bind:value={statementOpts.statementDate} required>
			{#each statementOpts.statementDateOpts as opt}
				<option value={opt}>{opt}</option>
			{/each}
		</select>
		<select id="typeSelector" bind:value={statementOpts.statementFilter} required>
			{#each statementOpts.statementFilterOpts as opt}
				<option value={opt}>{opt}</option>
			{/each}
		</select>

		{#each lists as list, i}
			<div id={'list' + i}>
				<form action="?/deleteList&id={list.id}" method="POST">
					<article class={list.type === 'Income' ? 'card-success' : 'card-warning'}>
						<header style="text-transform: uppercase ">{list.type}</header>
						<h3>฿ {list.amount}</h3>
						<blockquote>
							{list.detail}
						</blockquote>
						<h6>{list.Date.toLocaleDateString('en-US')}</h6>
						<input type="hidden" value={list.type} name="type" id="type" />
						<button type="submit" class="outline secondary">Delete</button>
						<a
							style="width: 100%"
							href="/{list.id}?type={list.type}"
							role="button"
							class="outline constrast">Edit</a
						>
					</article>
				</form>
			</div>
		{:else}
			<div style="text-align: center;" class="headings">
				<h2>You don't have any statements</h2>
				<h2>Try to add one!</h2>
			</div>
		{/each}
	</div>

	<div id="form-group" class="">
		<select id="fruit" bind:value={methodSelected} required>
			<option value="" selected>Select method</option>
			<option value="income">Income</option>
			<option value="expense">Expense</option>
		</select>
		{#if methodSelected === 'income'}
			<form action="?/createIncome" method="POST">
				<label for="income">Income</label>
				<input type="number" id="amount" name="amount" />
				<label for="detail">Detail</label>
				<input type="text" id="detail" name="detail" />
				<button type="submit">Add</button>
			</form>
		{:else if methodSelected === 'expense'}
			<form action="?/createExpense" method="POST">
				<label for="expense">Expense</label>
				<input type="number" id="amount" name="amount" />
				<label for="detail">Detail</label>
				<input type="text" id="detail" name="detail" />
				<button type="submit">Add</button>
			</form>
		{/if}
	</div>
</div>

<style>
	.card-warning {
		background-color: rgb(85, 9, 37);
		color: #fff;
	}

	.card-success {
		background-color: #093814;
		color: #fff;
	}
</style>
