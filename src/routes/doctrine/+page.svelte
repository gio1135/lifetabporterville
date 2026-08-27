<script lang="ts">
	import { fontState } from '$lib/fontState.svelte.ts';
</script>

<svelte:head>
	<title>What we believe | Life Tabernacle</title>
</svelte:head>

<div
	class="h-full w-full overflow-y-auto scroll-smooth {fontState.useDyslexicFont
		? 'font-dyslexic'
		: ''}"
>
	<div
		class="mx-auto px-6 py-24 pb-32 transition-all duration-300 md:px-12 {fontState.useDyslexicFont
			? 'max-w-6xl'
			: 'max-w-4xl'}"
	>
		<header
			class="mb-12 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:gap-0"
		>
			<h1 class="text-4xl font-light tracking-widest text-white md:text-5xl">What we believe</h1>

			<button
				onclick={() => fontState.toggle()}
				class="text-xs tracking-widest whitespace-nowrap text-sand/50 underline underline-offset-4 transition-colors hover:text-white"
				aria-pressed={fontState.useDyslexicFont}
			>
				{fontState.useDyslexicFont ? 'Disable' : 'Enable'} dyslexia font
			</button>
		</header>

		<article
			class="prose prose-lg prose-invert max-w-none text-left text-sand/80"
			style="line-height: 1.65; font-size: 1.125rem; letter-spacing: 0.01em;"
		>
			<section class="mb-12">
				<p class="mb-4">We believe that the Bible is thoroughly the true expression of God’s plan, eternally and miraculously preserved</p>
				<p class="mb-4">We believe that God is one, all-powerful Being</p>
				<p class="mb-4">We believe that the same God that created the universe, made Himself to be like man, was baptized, lived a sinless life, and was crucified that we might live more abundantly</p>
				<p class="mb-4">We believe that the ONLY way to receive this wonderful new life is by following the plan laid out by Peter in Acts 2:38</p>
				<blockquote class="my-8 border-l-2 border-white/20 pl-6 text-sand/60 italic">
					Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus
					Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost.
				</blockquote>
				<p class="mb-4">We believe that the Church’s purpose is to stay holy as the Bride of Christ</p>
			</section>

			{#if fontState.useDyslexicFont}
				<p class="mt-12 border-t border-white/10 pt-4 text-sm text-sand/50">
					Dyslexia-friendly font provided by <a
						href="https://opendyslexic.org/about"
						target="_blank"
						rel="noopener noreferrer"
						class="underline hover:text-white">OpenDyslexic</a
					>
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