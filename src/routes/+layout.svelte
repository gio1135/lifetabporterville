<script lang="ts">
	import { page } from '$app/stores';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import AccessibilityMenu from '$lib/components/AccessibilityMenu.svelte';
	import { accessibility } from '$lib/stores/accessibility.svelte';
	import { browser } from '$app/environment';

	import { onMount } from 'svelte';

	let { children } = $props();
	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function calculateFontSize() {
		if (!browser) return;
		
		let baseSize = 16;
		
		// Scale down proportionally on smaller screens (below 1024px)
		if (window.innerWidth < 1024) {
			baseSize = Math.max(12, (window.innerWidth / 1024) * 16);
		}
		
		// Reduce font size by 15% when dyslexia font is active due to its wider glyphs
		if (accessibility.dyslexiaFont) {
			baseSize *= 0.85;
		}

		// Reduce font size slightly when high contrast is active due to its wider, bolder styling
		if (accessibility.highContrast) {
			baseSize *= 0.95;
		}
		
		document.documentElement.style.fontSize = `${baseSize}px`;
	}

	onMount(() => {
		if (!browser) return;
		window.addEventListener('resize', calculateFontSize);
		calculateFontSize();
		return () => {
			window.removeEventListener('resize', calculateFontSize);
		};
	});

	$effect(() => {
		if ($page.url.pathname) {
			isMenuOpen = false;
		}
	});

	$effect(() => {
		if (browser) {
			if (accessibility.highContrast) {
				document.documentElement.classList.add('high-contrast');
			} else {
				document.documentElement.classList.remove('high-contrast');
			}

			if (accessibility.dyslexiaFont) {
				document.documentElement.classList.add('font-dyslexia');
			} else {
				document.documentElement.classList.remove('font-dyslexia');
			}
			
			calculateFontSize();
			setTimeout(() => {
				window.dispatchEvent(new Event('resize'));
			}, 50);
		}
	});
</script>

<PageTransition />

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:outline-none focus:ring-2 focus:ring-black"
>
	Skip to content
</a>

<AccessibilityMenu />

<div class="relative flex h-dvh w-full flex-col">
	{#if $page.url.pathname !== '/'}
		<nav
			class="z-50 flex shrink-0 items-center justify-between border-b border-sand/10 bg-dark/80 px-6 py-6 backdrop-blur md:px-16">
			<a href="/" class="relative z-60 text-xl font-light tracking-widest text-white">Life Tabernacle</a>
			<div class="hidden gap-8 md:flex">
				<a href="/schedule" class="text-sm tracking-widest text-sand/80 transition-colors duration-300 hover:text-white"
					>Schedule</a>
				<a href="/history" class="text-sm tracking-widest text-sand/80 transition-colors duration-300 hover:text-white"
					>History</a>
				<a href="/doctrine" class="text-sm tracking-widest text-sand/80 transition-colors duration-300 hover:text-white"
					>What we believe</a>
			</div>
			<button
				class="relative z-60 text-sand/80 transition-colors duration-300 hover:text-white focus:outline-none md:hidden"
				onclick={toggleMenu}
				aria-expanded={isMenuOpen}
				aria-controls="mobile-menu"
				aria-label="Toggle menu">
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
						stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
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
							y2="18" /></svg>
				{/if}
			</button>
		</nav>
	{/if}

	{#if isMenuOpen}
		<div id="mobile-menu" class="fixed inset-0 z-40 flex flex-col items-center justify-center space-y-10 bg-[#0f0f0f] md:hidden">
			<a href="/" class="text-3xl font-light tracking-widest text-white">Home</a>
			<a href="/schedule" class="text-3xl font-light tracking-widest text-white">Schedule</a>
			<a href="/history" class="text-3xl font-light tracking-widest text-white">History</a>
			<a href="/doctrine" class="text-3xl font-light tracking-widest text-white">What we believe</a>
		</div>
	{/if}

	<main id="main-content" class="relative w-full flex-1 overflow-hidden" tabindex="-1">
		{@render children()}
	</main>
</div>
