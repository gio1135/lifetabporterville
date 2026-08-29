<script lang="ts">
	import { accessibility } from '$lib/stores/accessibility.svelte';
	import { onMount, tick } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let isOpen = $state(false);
	let showEasterEgg = $state(false);
	let menuRef = $state<HTMLElement | null>(null);

	onMount(() => {
		// 1% chance to show the easter egg icon
		showEasterEgg = Math.random() < 0.01;
	});

	function toggleMenu() {
		isOpen = !isOpen;
		if (isOpen) {
			tick().then(() => {
				const firstInput = menuRef?.querySelector('input');
				firstInput?.focus();
			});
		} else {
			tick().then(() => {
				document.getElementById('accessibility-btn')?.focus();
			});
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			isOpen = false;
			tick().then(() => {
				document.getElementById('accessibility-btn')?.focus();
			});
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div id="accessibility-container" class="fixed right-6 bottom-6 z-50">
	<button
		id="accessibility-btn"
		class="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-dark text-white shadow-lg ring-1 ring-white/20 focus:outline-none"
		onclick={toggleMenu}
		aria-label="Accessibility Options"
		aria-expanded={isOpen}>
		{#if isOpen}
			<svg
				in:scale={{ duration: 300, delay: 150, easing: cubicOut }}
				out:scale={{ duration: 150, start: 0.5 }}
				class="absolute"
				xmlns="http://www.w3.org/2000/svg"
				width="28"
				height="28"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round">
				<path d="M18 6 6 18" />
				<path d="m6 6 12 12" />
			</svg>
		{:else if showEasterEgg}
			<svg
				in:scale={{ duration: 300, delay: 150, easing: cubicOut }}
				out:scale={{ duration: 150, start: 0.5 }}
				class="absolute"
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				viewBox="0 0 48 48"
				fill="currentColor">
				<path d="M21.1,25.5a2.1,2.1,0,0,0-2.9.8,4.4,4.4,0,0,1-2.6,2.4,4.9,4.9,0,0,1-6.5-5.5,4.8,4.8,0,0,1,9-1.3A2.1,2.1,0,0,0,20.6,23a2,2,0,0,0,1.2-2.8,9.1,9.1,0,0,0-3.4-3.6L25.8,13a2.3,2.3,0,0,0,1.1-2.6,2.1,2.1,0,0,0-2.8-1.1l-8.2,4,6.6-7.9a2.1,2.1,0,0,0,.1-2.7,2,2,0,0,0-3.1,0l-7.7,9.2,1.1-4.3a2.1,2.1,0,0,0-1.1-2.4A2.1,2.1,0,0,0,9,6.6L5.3,22A11.3,11.3,0,0,0,5,23.8v.4A8.9,8.9,0,0,0,13.9,33a8.6,8.6,0,0,0,7.8-4.8A2,2,0,0,0,21.1,25.5Z"/>
				<path d="M34.1,15.3a8.8,8.8,0,0,0-7.8,4.8,2,2,0,0,0,.6,2.7,2.1,2.1,0,0,0,2.9-.7,4.6,4.6,0,0,1,2.6-2.5,4.9,4.9,0,0,1,6.5,5.6,4.8,4.8,0,0,1-4,3.7,4.5,4.5,0,0,1-5-2.5,2.2,2.2,0,0,0-2.5-1.1,2,2,0,0,0-1.2,2.8,9.4,9.4,0,0,0,3.4,3.7l-7.4,3.6A2,2,0,0,0,21,37.6a2.1,2.1,0,0,0,2,1.6l.9-.2,8-3.9-6.4,7.5a2.1,2.1,0,0,0,.2,3,1.9,1.9,0,0,0,1.2.4,1.7,1.7,0,0,0,1.5-.7l7.8-9.1-1.1,4.5a2.2,2.2,0,0,0,1.3,2.5h.7A1.9,1.9,0,0,0,39,41.8l3.7-15.5a11.3,11.3,0,0,0,.3-1.8v-.3A8.9,8.9,0,0,0,34.1,15.3Z"/>
			</svg>
		{:else}
			<svg
				in:scale={{ duration: 300, delay: 150, easing: cubicOut }}
				out:scale={{ duration: 150, start: 0.5 }}
				class="absolute h-full w-full"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
				fill="currentColor">
				<path d="M256 48c114.953 0 208 93.029 208 208 0 114.953-93.029 208-208 208-114.953 0-208-93.029-208-208 0-114.953 93.029-208 208-208m0-40C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 56C149.961 64 64 149.961 64 256s85.961 192 192 192 192-85.961 192-192S362.039 64 256 64zm0 44c19.882 0 36 16.118 36 36s-16.118 36-36 36-36-16.118-36-36 16.118-36 36-36zm117.741 98.023c-28.712 6.779-55.511 12.748-82.14 15.807.851 101.023 12.306 123.052 25.037 155.621 3.617 9.26-.957 19.698-10.217 23.315-9.261 3.617-19.699-.957-23.316-10.217-8.705-22.308-17.086-40.636-22.261-78.549h-9.686c-5.167 37.851-13.534 56.208-22.262 78.549-3.615 9.255-14.05 13.836-23.315 10.217-9.26-3.617-13.834-14.056-10.217-23.315 12.713-32.541 24.185-54.541 25.037-155.621-26.629-3.058-53.428-9.027-82.141-15.807-8.6-2.031-13.926-10.648-11.895-19.249s10.647-13.926 19.249-11.895c96.686 22.829 124.283 22.783 220.775 0 8.599-2.03 17.218 3.294 19.249 11.895 2.029 8.601-3.297 17.219-11.897 19.249z"/>
			</svg>
		{/if}
	</button>

	{#if isOpen}
		<div
			bind:this={menuRef}
			transition:fly={{ y: 20, duration: 300, easing: cubicOut }}
			class="absolute right-0 bottom-18 w-72 rounded-xl bg-dark p-6 shadow-2xl ring-1 ring-white/10 hc:bg-black hc:ring-white"
			role="dialog"
			aria-label="Accessibility Settings">
			<h3 class="mb-6 text-xl font-light text-white">Accessibility</h3>

			<div class="space-y-6">
				<label class="flex cursor-pointer items-center justify-between">
					<span class="text-sand hc:text-white">High Contrast</span>
					<div class="relative">
						<input
							type="checkbox"
							class="peer sr-only"
							checked={accessibility.highContrast}
							onkeydown={(e) => { if (e.key === 'Enter') accessibility.toggleHighContrast() }}
							onchange={() => accessibility.toggleHighContrast()} />
						<div
							class="block h-6 w-11 rounded-full bg-zinc-700 transition-colors duration-300 ease-out peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-dark"
							class:bg-white={accessibility.highContrast}
							class:hc:bg-white={accessibility.highContrast}>
						</div>
						<div
							class="dot absolute top-1 left-1 h-4 w-4 rounded-full transition-transform duration-300 ease-out"
							class:bg-white={!accessibility.highContrast}
							class:bg-black={accessibility.highContrast}
							class:hc:bg-black={accessibility.highContrast}
							class:translate-x-5={accessibility.highContrast}>
						</div>
					</div>
				</label>

				<label class="flex cursor-pointer items-center justify-between">
					<span class="text-sand hc:text-white">Dyslexia Font</span>
					<div class="relative">
						<input
							type="checkbox"
							class="peer sr-only"
							checked={accessibility.dyslexiaFont}
							onkeydown={(e) => { if (e.key === 'Enter') accessibility.toggleDyslexiaFont() }}
							onchange={() => accessibility.toggleDyslexiaFont()} />
						<div
							class="block h-6 w-11 rounded-full bg-zinc-700 transition-colors duration-300 ease-out peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-dark"
							class:bg-white={accessibility.dyslexiaFont}
							class:hc:bg-white={accessibility.dyslexiaFont}>
						</div>
						<div
							class="dot absolute top-1 left-1 h-4 w-4 rounded-full transition-transform duration-300 ease-out"
							class:bg-white={!accessibility.dyslexiaFont}
							class:bg-black={accessibility.dyslexiaFont}
							class:hc:bg-black={accessibility.dyslexiaFont}
							class:translate-x-5={accessibility.dyslexiaFont}>
						</div>
					</div>
				</label>
			</div>
		</div>
	{/if}
</div>
