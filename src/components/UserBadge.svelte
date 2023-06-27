<script lang="ts">
	export let userData: { email: string | null; userId: string | number };
</script>

{#if userData}
	<div>
		<article>
			<div class="heading">
				<h3>Welcome</h3>
				<p>{userData.email}</p>
			</div>
		</article>
	</div>
{/if}

<style>
	/* your styles go here */
</style>
