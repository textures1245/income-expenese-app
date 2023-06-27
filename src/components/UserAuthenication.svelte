<script lang="ts">
	let authMode: 'LOGIN' | 'REGISTER' = 'LOGIN';
</script>

<section />
<article class="grid">
	<div>
		{#if authMode === 'LOGIN'}
			<hgroup>
				<h1>Sign in</h1>
				<h2>Get track for your statements</h2>
			</hgroup>
			<form action="?/login">
				<input
					type="email"
					name="email"
					placeholder="Email address"
					aria-label="email"
					id="password"
					required
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					aria-label="Password"
					id="password"
					required
				/>
				<button type="submit" class="contrast">Login</button>
			</form>
			<button on:click={() => (authMode = 'REGISTER')}>Go to Register</button>
		{:else}
			<hgroup>
				<h1>Sign up</h1>
				<h2>Create your account for tracking statements</h2>
			</hgroup>
			<form action="?/signup">
				<input
					type="email"
					name="email"
					placeholder="Email address"
					aria-label="email"
					id="password"
					required
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					aria-label="Password"
					id="password"
					required
				/>

				<button type="submit" class="contrast">Register</button>
			</form>
			<button on:click={() => (authMode = 'LOGIN')}>Go to Login</button>
		{/if}
	</div>
	<div style="width: 100%; height: 100%;" class="img-container">
		<img
			src="https://th.bing.com/th/id/R.1e890f69d996328695d06cb17aac132d?rik=66QrqxYmAbiy7A&pid=ImgRaw&r=0"
			alt=""
		/>
	</div>
</article>

<style>
	.img-container {
		display: flex;
		place-items: center;
	}
</style>
