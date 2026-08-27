<script lang="ts">
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Admin login</title>
</svelte:head>

<div class="mx-auto mt-20 h-full max-w-md overflow-y-auto px-4">
	<div class="mb-4">
		<a
			href="/schedule"
			class="inline-flex items-center text-sm font-medium text-sand/80 transition-colors hover:text-white">
			<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
				><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path
				></svg>
			Back
		</a>
	</div>
	<div class="rounded-lg border border-sand/20 bg-dark/50 p-8 shadow-sm">
		<h2 class="mb-6 text-center text-2xl font-light tracking-widest text-white">Admin access</h2>

		{#if form?.missing}
			<div class="mb-6 rounded border border-red-500/20 bg-red-900/20 p-3 text-sm text-red-400">
				Username and password are required
			</div>
		{/if}

		{#if form?.incorrect}
			<div class="mb-6 rounded border border-red-500/20 bg-red-900/20 p-3 text-sm text-red-400">
				Invalid credentials
			</div>
		{/if}

		<form method="POST" class="space-y-4">
			<div>
				<label for="username" class="mb-1 block text-sm font-medium text-sand">Username</label>
				<input
					type="text"
					id="username"
					name="username"
					class="w-full rounded-md border border-sand/20 bg-dark/80 px-3 py-2 text-white transition-colors focus:border-white focus:outline-none" />
			</div>

			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-sand">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					class="w-full rounded-md border border-sand/20 bg-dark/80 px-3 py-2 text-white transition-colors focus:border-white focus:outline-none" />
			</div>

			<div class="pt-4">
				<button
					type="submit"
					class="w-full rounded-md bg-white py-3 text-sm font-medium tracking-widest text-dark transition-colors hover:bg-sand">
					Log in
				</button>
			</div>
		</form>
	</div>
</div>
