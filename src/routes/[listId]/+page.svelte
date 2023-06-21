<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	$: ({ list } = data);
</script>

<section />
<div class="headings">
	<h2>Edit List</h2>
	<h1>{list.type} #{list.id}</h1>
</div>
<a href="/" role="button" class="outline">Go Back</a>
<form action="?/updateList&type={list.type}" method="POST">
	<label for="income">{list.type}</label>
	<input type="number" id="amount" name="amount" value={list.amount} />
	<label for="detail">Detail</label>
	<input type="text" id="detail" name="detail" value={list.detail} />
	<input type="hidden" value={list.type} name="type" id="type" />
	<button type="submit">Edit</button>
</form>
