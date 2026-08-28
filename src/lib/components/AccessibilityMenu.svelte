<script lang="ts">
	import { accessibility } from '$lib/stores/accessibility.svelte';

	let isOpen = $state(false);

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			isOpen = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="fixed right-6 bottom-6 z-50">
	<button
		class="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-dark text-white shadow-lg ring-1 ring-white/20 transition-transform hover:scale-110 focus:ring-2 focus:ring-white focus:outline-none"
		onclick={toggleMenu}
		aria-label="Accessibility Options"
		aria-expanded={isOpen}>
		{#if isOpen}
			<svg
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
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				viewBox="0 0 48 48"
				fill="currentColor">
				<path d="M21.1,25.5a2.1,2.1,0,0,0-2.9.8,4.4,4.4,0,0,1-2.6,2.4,4.9,4.9,0,0,1-6.5-5.5,4.8,4.8,0,0,1,9-1.3A2.1,2.1,0,0,0,20.6,23a2,2,0,0,0,1.2-2.8,9.1,9.1,0,0,0-3.4-3.6L25.8,13a2.3,2.3,0,0,0,1.1-2.6,2.1,2.1,0,0,0-2.8-1.1l-8.2,4,6.6-7.9a2.1,2.1,0,0,0,.1-2.7,2,2,0,0,0-3.1,0l-7.7,9.2,1.1-4.3a2.1,2.1,0,0,0-1.1-2.4A2.1,2.1,0,0,0,9,6.6L5.3,22A11.3,11.3,0,0,0,5,23.8v.4A8.9,8.9,0,0,0,13.9,33a8.6,8.6,0,0,0,7.8-4.8A2,2,0,0,0,21.1,25.5Z"/>
				<path d="M34.1,15.3a8.8,8.8,0,0,0-7.8,4.8,2,2,0,0,0,.6,2.7,2.1,2.1,0,0,0,2.9-.7,4.6,4.6,0,0,1,2.6-2.5,4.9,4.9,0,0,1,6.5,5.6,4.8,4.8,0,0,1-4,3.7,4.5,4.5,0,0,1-5-2.5,2.2,2.2,0,0,0-2.5-1.1,2,2,0,0,0-1.2,2.8,9.4,9.4,0,0,0,3.4,3.7l-7.4,3.6A2,2,0,0,0,21,37.6a2.1,2.1,0,0,0,2,1.6l.9-.2,8-3.9-6.4,7.5a2.1,2.1,0,0,0,.2,3,1.9,1.9,0,0,0,1.2.4,1.7,1.7,0,0,0,1.5-.7l7.8-9.1-1.1,4.5a2.2,2.2,0,0,0,1.3,2.5h.7A1.9,1.9,0,0,0,39,41.8l3.7-15.5a11.3,11.3,0,0,0,.3-1.8v-.3A8.9,8.9,0,0,0,34.1,15.3Z"/>
			</svg>
		{/if}
	</button>

	{#if isOpen}
		<div
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
							class="sr-only"
							checked={accessibility.highContrast}
							onchange={() => accessibility.toggleHighContrast()} />
						<div
							class="block h-6 w-11 rounded-full bg-zinc-700 transition-colors"
							class:bg-white={accessibility.highContrast}
							class:hc:bg-white={accessibility.highContrast}>
						</div>
						<div
							class="dot absolute top-1 left-1 h-4 w-4 rounded-full transition-transform"
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
							class="sr-only"
							checked={accessibility.dyslexiaFont}
							onchange={() => accessibility.toggleDyslexiaFont()} />
						<div
							class="block h-6 w-11 rounded-full bg-zinc-700 transition-colors"
							class:bg-white={accessibility.dyslexiaFont}
							class:hc:bg-white={accessibility.dyslexiaFont}>
						</div>
						<div
							class="dot absolute top-1 left-1 h-4 w-4 rounded-full transition-transform"
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
