<script lang="ts">
	import { page } from '$app/stores';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import PageTransition from '$lib/components/PageTransition.svelte';

	let { children } = $props();
	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	$effect(() => {
		if ($page.url.pathname) {
			isMenuOpen = false;
		}
	});
</script>

<PageTransition />

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="relative flex h-dvh w-full flex-col">
	{#if $page.url.pathname !== '/'}
		<nav
			class="z-50 flex shrink-0 items-center justify-between border-b border-sand/10 bg-dark/80 px-6 py-6 backdrop-blur md:px-16"
		>
			<a href="/" class="relative z-60 text-xl font-light tracking-widest text-white"
				>Life Tabernacle</a
			>
			<div class="hidden gap-8 md:flex">
				<a
					href="/schedule"
					class="text-sm tracking-widest text-sand/80 transition-colors duration-300 hover:text-white"
					>Schedule</a
				>
				<a
					href="/history"
					class="text-sm tracking-widest text-sand/80 transition-colors duration-300 hover:text-white"
					>History</a
				>
				<a
					href="/doctrine"
					class="text-sm tracking-widest text-sand/80 transition-colors duration-300 hover:text-white"
					>What we believe</a
				>
			</div>
			<button
				class="relative z-60 text-sand/80 transition-colors duration-300 hover:text-white focus:outline-none md:hidden"
				onclick={toggleMenu}
				aria-label="Toggle menu"
			>
				{#if isMenuOpen}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
					>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line
							x1="4"
							x2="20"
							y1="18"
							y2="18"
						/></svg
					>
				{/if}
			</button>
		</nav>
	{/if}

	{#if isMenuOpen}
		<div
			class="fixed inset-0 z-40 flex flex-col items-center justify-center space-y-10 bg-[#0f0f0f] md:hidden"
		>
			<a href="/" class="text-3xl font-light tracking-widest text-white">Home</a>
			<a href="/schedule" class="text-3xl font-light tracking-widest text-white">Schedule</a>
			<a href="/history" class="text-3xl font-light tracking-widest text-white">History</a>
			<a href="/doctrine" class="text-3xl font-light tracking-widest text-white">What we believe</a>
		</div>
	{/if}

	<main class="relative w-full flex-1 overflow-hidden">
		{@render children()}
	</main>
</div>