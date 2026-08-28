<script lang="ts">
	import { fontState } from '$lib/fontState.svelte.ts';
	import ScriptureRef from '$lib/components/ScriptureRef.svelte';
</script>

<svelte:head>
	<title>What we believe | Life Tabernacle</title>
</svelte:head>

<div class="h-full w-full overflow-y-auto scroll-smooth {fontState.useDyslexicFont ? 'font-dyslexic' : ''}">
	<div
		class="mx-auto px-6 py-24 pb-32 transition-all duration-300 md:px-12 {fontState.useDyslexicFont
			? 'max-w-6xl'
			: 'max-w-4xl'}">
		<header
			class="mb-12 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:gap-0">
			<h1 class="text-4xl font-light tracking-widest text-white md:text-5xl">What we believe</h1>

			<button
				onclick={() => fontState.toggle()}
				class="cursor-pointer text-xs tracking-widest whitespace-nowrap text-sand/50 underline underline-offset-4 transition-colors hover:text-white"
				aria-pressed={fontState.useDyslexicFont}>
				{fontState.useDyslexicFont ? 'Disable' : 'Enable'} dyslexia font
			</button>
		</header>

		<article
			class="prose prose-lg max-w-none text-left text-sand/80 prose-invert"
			style="line-height: 1.65; font-size: 1.125rem; letter-spacing: 0.01em;">
			<section class="mb-12">
			  <p>We believe that the Bible is thoroughly the true expression of God’s plan, eternally and miraculously preserved. In a world that constantly changes its rules and morals, the Bible remains absolute truth <ScriptureRef reference="Matthew 24:35" /></p>
				<p>We believe that God is one, all-powerful Being <ScriptureRef reference="Ephesians 4:6" /> <ScriptureRef reference="James 2:19" /></p>
				<p>We believe that the same God that created the universe, made Himself to be like man, was baptized, lived a sinless life, and was crucified that we might live more abundantly <ScriptureRef reference="1 Timothy 3:16" /></p>
				<p>We believe that the ONLY way to receive this wonderful new life is by following the plan laid out by Peter in <ScriptureRef reference="Acts 2:38" /></p>
				<p>We believe that the church’s purpose is to stay holy as the bride of Crist, and to reach the lost souls hungry for his word <ScriptureRef reference="Romans 12:1-3" /> <ScriptureRef reference="John 4:35" /></p>
			</section>

			{#if fontState.useDyslexicFont}
				<p class="mt-12 border-t border-white/10 pt-4 text-sm text-sand/50">
					Dyslexia-friendly font provided by <a
						href="https://opendyslexic.org/about"
						target="_blank"
						rel="noopener noreferrer"
						class="underline hover:text-white">OpenDyslexic</a>
				</p>
			{/if}
		</article>
	</div>
</div>

<style>
	@font-face {
		font-family: 'OpenDyslexic';
		src: url('/fonts/OpenDyslexic-Regular.otf') format('opentype');
		font-weight: normal;
		font-style: normal;
		font-display: swap;
	}

	:global(.font-dyslexic) {
		font-family: 'OpenDyslexic', sans-serif !important;
		letter-spacing: 0.05em;
		word-spacing: 0.1em;
	}

	@media (max-width: 767px) {
		:global(.font-dyslexic .prose) {
			font-size: 0.875rem !important;
		}
	}
</style>
