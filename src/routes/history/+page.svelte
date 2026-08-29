<script lang="ts">
	import stephenImg from '$lib/assets/pastors/stephen_marchbanks.jpeg?enhanced';
	import type { Picture } from '@sveltejs/enhanced-img';
	import { accessibility } from '$lib/stores/accessibility.svelte';
	import type { Snippet } from 'svelte';

	type Milestone = {
		id: string;
		title: string;
		desc: string;
		position: 'top' | 'bottom';
		date: string;
		hasArticle?: boolean;
		articleContent?: Snippet;
	};

	type Era = {
		pastor: string;
		period: string;
		image?: string | Picture;
		milestones: Milestone[];
	};

	let selectedEvent = $state<Milestone | null>(null);
	let phase = $state<'idle' | 'fading_timeline' | 'moving_card' | 'expanding_card'>('idle');
	let cardRect = $state<DOMRect | null>(null);

	function expand(milestone: Milestone, event: MouseEvent) {
		if (!milestone.hasArticle || phase !== 'idle') return;
		const button = event.currentTarget as HTMLElement;
		cardRect = button.getBoundingClientRect();
		selectedEvent = milestone;
		phase = 'fading_timeline';

		setTimeout(() => {
			phase = 'moving_card';
			setTimeout(() => {
				phase = 'expanding_card';
			}, 500);
		}, 300);
	}

	function collapse() {
		phase = 'moving_card';
		setTimeout(() => {
			phase = 'fading_timeline';
			setTimeout(() => {
				phase = 'idle';
				setTimeout(() => {
					selectedEvent = null;
				}, 300);
			}, 500);
		}, 500);
	}
	const eras: Era[] = [
		{
			pastor: 'C.B Webb',
			period: 'Season 1',
			milestones: [
				{
					id: 's1-m1',
					title: 'Founded the church',
					desc: 'The church was founded',
					position: 'top',
					date: '1955',
					hasArticle: true,
					articleContent: article1
				},
				{
					id: 's1-m2',
					title: 'Milestone 2',
					desc: 'Description of what happened',
					position: 'bottom',
					date: 'Year'
				},
				{
					id: 's1-m3',
					title: 'Milestone 3',
					desc: 'Description of what happened',
					position: 'top',
					date: 'Year'
				}
			]
		},
		{
			pastor: 'Mike Webb',
			period: 'Season 2',
			milestones: [
				{
					id: 's2-m1',
					title: 'Milestone 1',
					desc: 'Description of what happened',
					position: 'bottom',
					date: 'Year'
				},
				{
					id: 's2-m2',
					title: 'Milestone 2',
					desc: 'Description of what happened',
					position: 'top',
					date: 'Year'
				},
				{
					id: 's2-m3',
					title: 'Milestone 3',
					desc: 'Description of what happe   ned',
					position: 'bottom',
					date: 'Year'
				}
			]
		},
		{
			pastor: 'Jonathan Kendrick',
			period: 'Season 3',
			milestones: [
				{
					id: 's3-m1',
					title: 'Milestone 1',
					desc: 'Description of what happened',
					position: 'top',
					date: 'Year'
				},
				{
					id: 's3-m2',
					title: 'Milestone 2',
					desc: 'Description of what happened',
					position: 'bottom',
					date: 'Year'
				},
				{
					id: 's3-m3',
					title: 'Milestone 3',
					desc: 'Description of what happened',
					position: 'top',
					date: 'Year'
				}
			]
		},
		{
			pastor: 'Stephen Marchbanks',
			period: 'Season 4',
			image: stephenImg,
			milestones: [
				{
					id: 's4-m1',
					title: 'Milestone 1',
					desc: 'Description of what happened',
					position: 'bottom',
					date: 'Year',
					hasArticle: true,
					articleContent: article2
				},
				{
					id: 's4-m2',
					title: 'Milestone 2',
					desc: 'Description of what happened',
					position: 'top',
					date: 'Year'
				},
				{
					id: 's4-m3',
					title: 'Milestone 3',
					desc: 'Description of what happened',
					position: 'bottom',
					date: 'Year'
				}
			]
		}
	];

	function horizontalScroll(node: HTMLElement) {
		let targetLeft = 0;
		let isWheeling = false;
		let wheelTimer: number;

		function handleWheel(e: WheelEvent) {
			if (e.deltaY !== 0) {
				e.preventDefault();

				if (!isWheeling) {
					targetLeft = node.scrollLeft;
				}

				isWheeling = true;
				window.clearTimeout(wheelTimer);
				wheelTimer = window.setTimeout(() => {
					isWheeling = false;
				}, 150);

				targetLeft += e.deltaY;
				targetLeft = Math.max(0, Math.min(targetLeft, node.scrollWidth - node.clientWidth));

				node.scrollTo({ left: targetLeft, behavior: 'smooth' });
			}
		}

		let isScrolling: number;
		function handleScroll() {
			window.clearTimeout(isScrolling);
			isScrolling = window.setTimeout(() => {
				const scrollX = node.scrollLeft;
				const sections = Array.from(node.querySelectorAll('section'));

				let nearestPos = 0;
				let minDistance = Infinity;

				sections.forEach((section) => {
					const pos = section.offsetLeft;
					const distance = Math.abs(scrollX - pos);
					if (distance < minDistance) {
						minDistance = distance;
						nearestPos = pos;
					}
				});

				const snapThreshold = 120;

				if (minDistance <= snapThreshold && scrollX !== nearestPos) {
					node.scrollTo({ left: nearestPos, behavior: 'smooth' });
				}
			}, 150);
		}

		function handleKeyDown(e: KeyboardEvent) {
			const scrollX = node.scrollLeft;
			const sections = Array.from(node.querySelectorAll('section'));

			if (['Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) {
				e.preventDefault();

				if (e.key === 'Home') {
					targetLeft = 0;
				} else if (e.key === 'End') {
					targetLeft = node.scrollWidth - node.clientWidth;
				} else if (e.key === 'PageDown') {
					const nextSection = sections.find((s) => s.offsetLeft > scrollX + 10);
					targetLeft = nextSection ? nextSection.offsetLeft : node.scrollWidth - node.clientWidth;
				} else if (e.key === 'PageUp') {
					const prevSections = sections.filter((s) => s.offsetLeft < scrollX - 10);
					targetLeft = prevSections.length > 0 ? prevSections[prevSections.length - 1].offsetLeft : 0;
				}

				node.scrollTo({ left: targetLeft, behavior: 'smooth' });
			}
		}

		function handleFocusIn(e: FocusEvent) {
			const target = e.target as HTMLElement;
			const section = target.closest('section');
			if (section && node.contains(section)) {
				const scrollX = node.scrollLeft;
				const snapThreshold = 10;
				if (Math.abs(scrollX - section.offsetLeft) > snapThreshold) {
					targetLeft = section.offsetLeft;
					node.scrollTo({ left: targetLeft, behavior: 'smooth' });
				}
			}
		}

		node.addEventListener('wheel', handleWheel, { passive: false });
		node.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('keydown', handleKeyDown);
		node.addEventListener('focusin', handleFocusIn);

		return {
			destroy() {
				node.removeEventListener('wheel', handleWheel);
				node.removeEventListener('scroll', handleScroll);
				window.removeEventListener('keydown', handleKeyDown);
				node.removeEventListener('focusin', handleFocusIn);
				window.clearTimeout(isScrolling);
			}
		};
	}
</script>

{#snippet article1()}
	<p>The foundation was laid, building was built</p>
{/snippet}

{#snippet article2()}
	<p>Current era</p>
{/snippet}

<svelte:head>
	<title>History | Life Tabernacle</title>
</svelte:head>

<div
	use:horizontalScroll
	class="custom-scrollbar flex h-full w-full overflow-x-auto overflow-y-hidden scroll-smooth">

	{#each eras as era (era.period)}
		<section class="relative flex h-full shrink-0">
			<div
				class="sticky top-0 left-0 z-20 flex h-[25dvh] w-screen shrink-0 flex-col justify-center overflow-hidden border-sand/10 bg-dark px-8 md:h-full md:w-[33vw] md:border-r md:px-16">
				{#if era.image}
					<div class="absolute inset-0 z-0">
						<enhanced:img
							src={era.image}
							alt={era.pastor}
							class="h-full w-full object-cover object-[50%_33%] md:object-center" />
						<div class="absolute inset-0 bg-linear-to-b from-transparent from-40% to-dark hc:hidden"></div>
					</div>
				{/if}
				<div class="relative z-10 hc:rounded-2xl hc:bg-black/95 hc:p-6 hc:ring-1 hc:ring-white/20 hc:backdrop-blur-md">
					<h2 class="mb-2 text-sm tracking-[0.3em] text-sand/60 hc:text-white/80">{era.period}</h2>
					<h1 class="text-4xl font-light tracking-widest text-white md:text-5xl">{era.pastor}</h1>
				</div>
			</div>

			<div
				class="relative z-10 ml-[-100vw] flex h-[75dvh] shrink-0 items-center self-end pl-[10vw] md:ml-0 md:h-full md:self-auto md:pl-10">
				<div class="absolute top-1/2 left-0 -z-10 h-px w-full -translate-y-1/2 bg-sand/20"></div>

				{#each era.milestones as milestone (milestone.id)}
					<div class="group relative mx-8 flex h-full w-64 shrink-0 flex-col items-center md:mx-16 dyslexia:w-80">
						<div class="relative z-30 flex w-full flex-1 flex-col pb-8 md:pb-12">
							{#if milestone.position === 'top'}
								<button
									class="mt-auto w-full shrink-0 transform rounded border border-sand/10 bg-dark/80 p-6 text-left backdrop-blur transition-all duration-300 {milestone.hasArticle &&
									phase === 'idle'
										? 'cursor-pointer ring-1 ring-transparent hover:-translate-y-1 hover:bg-dark hover:ring-sand/20'
										: 'cursor-default'} {selectedEvent?.id === milestone.id && phase !== 'idle'
										? 'pointer-events-none opacity-0'
										: 'opacity-100'}"
									onclick={(e) => expand(milestone, e)}>
									<span class="mb-2 block text-xs tracking-widest text-sand/50 uppercase">{milestone.date}</span>
									<h3 class="mb-2 text-xl font-light tracking-wider text-white">
										{milestone.title}
									</h3>
									<p class="text-sm leading-relaxed text-sand/70 {milestone.hasArticle ? 'mb-4' : 'mb-0'}">
										{milestone.desc}
									</p>
									{#if milestone.hasArticle}
										<div
											class="mt-4 flex justify-end text-sand/50 {phase === 'idle'
												? 'transition-colors group-hover:text-white'
												: ''}">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
												><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline
													points="15 3 21 3 21 9"></polyline
												><line x1="10" y1="14" x2="21" y2="3"></line></svg>
										</div>
									{/if}
								</button>
							{/if}
						</div>

						<div
							class="absolute top-1/2 left-1/2 z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-300 {milestone.hasArticle
								? 'group-hover:scale-150'
								: ''}">
						</div>
						{#if milestone.position === 'top'}
							<div
								class="absolute bottom-1/2 left-1/2 h-8 w-px -translate-x-1/2 bg-sand/40 transition-all duration-300 md:h-12 {milestone.hasArticle
									? 'group-hover:bg-sand/80'
									: ''}">
							</div>
						{:else}
							<div
								class="absolute top-1/2 left-1/2 h-8 w-px -translate-x-1/2 bg-sand/40 transition-all duration-300 md:h-12 {milestone.hasArticle
									? 'group-hover:bg-sand/80'
									: ''}">
							</div>
						{/if}

						<div class="relative z-30 flex w-full flex-1 flex-col pt-8 md:pt-12">
							{#if milestone.position === 'bottom'}
								<button
									class="mb-auto w-full shrink-0 transform rounded border border-sand/10 bg-dark/80 p-6 text-left backdrop-blur transition-all duration-300 {milestone.hasArticle &&
									phase === 'idle'
										? 'cursor-pointer ring-1 ring-transparent hover:translate-y-1 hover:bg-dark hover:ring-sand/20'
										: 'cursor-default'} {selectedEvent?.id === milestone.id && phase !== 'idle'
										? 'pointer-events-none opacity-0'
										: 'opacity-100'}"
									onclick={(e) => expand(milestone, e)}>
									<span class="mb-2 block text-xs tracking-widest text-sand/50 uppercase">{milestone.date}</span>
									<h3 class="mb-2 text-xl font-light tracking-wider text-white">
										{milestone.title}
									</h3>
									<p class="text-sm leading-relaxed text-sand/70 {milestone.hasArticle ? 'mb-4' : 'mb-0'}">
										{milestone.desc}
									</p>
									{#if milestone.hasArticle}
										<div
											class="mt-4 flex justify-end text-sand/50 {phase === 'idle'
												? 'transition-colors group-hover:text-white'
												: ''}">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
												><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline
													points="15 3 21 3 21 9"></polyline
												><line x1="10" y1="14" x2="21" y2="3"></line></svg>
										</div>
									{/if}
								</button>
							{/if}
						</div>
					</div>
				{/each}

				<div class="w-[20vw] shrink-0 md:w-[33vw]"></div>
			</div>
		</section>
	{/each}
</div>

{#if selectedEvent && cardRect}
	<div
		class="pointer-events-none fixed inset-0 z-100 bg-dark/95 hc:bg-black transition-opacity duration-300 {phase !== 'idle'
			? 'opacity-100'
			: 'opacity-0'}"
		style="visibility: {phase !== 'idle' ? 'visible' : 'hidden'}; transition: opacity 300ms, visibility 300ms;">
	</div>

	<div
		class="fixed z-110 border border-sand/10 bg-dark/80 backdrop-blur {phase === 'fading_timeline' || phase === 'idle'
			? 'rounded'
			: 'rounded-lg'} overflow-x-hidden overflow-y-auto shadow-2xl transition-all duration-500 ease-in-out"
		style="
      top: {phase === 'fading_timeline' || phase === 'idle' ? cardRect.top + 'px' : 'max(5vh, 2rem)'};
      left: {phase === 'fading_timeline' || phase === 'idle' ? cardRect.left + 'px' : '50%'};
      width: {phase === 'fading_timeline' || phase === 'idle' ? cardRect.width + 'px' : 'min(100vw - 2rem, 56rem)'};
      transform: {phase === 'fading_timeline' || phase === 'idle' ? 'none' : 'translateX(-50%)'};
      max-height: 90vh;
    ">
		<div
			class="relative w-full {phase === 'fading_timeline' || phase === 'idle'
				? 'p-6'
				: 'p-8 md:p-16'} transition-all duration-500 {accessibility.dyslexiaFont ? 'font-dyslexic' : ''}">
			<button
				onclick={collapse}
				class="group absolute top-4 left-4 flex cursor-pointer items-center gap-2 text-xs tracking-widest text-sand/50 transition-colors hover:text-white md:top-8 md:left-8 {phase ===
				'expanding_card'
					? 'opacity-100'
					: 'pointer-events-none opacity-0'} transition-opacity duration-300">
				<span class="transform text-lg leading-none transition-transform group-hover:-translate-x-1">&larr;</span> Back to
				timeline
			</button>

			<div class="{phase === 'expanding_card' ? 'mt-12' : 'mt-0'} transition-all duration-500">
				<span
					class="block text-xs tracking-widest text-sand/50 uppercase {phase === 'fading_timeline' || phase === 'idle'
						? 'mb-2'
						: 'mb-4'} transition-all duration-500">{selectedEvent.date}</span>
				<h3
					class="{phase === 'fading_timeline' || phase === 'idle'
						? 'mb-2 text-xl'
						: 'mb-6 text-4xl md:text-5xl'} font-light tracking-wider text-white transition-all duration-500">
					{selectedEvent.title}
				</h3>
				<p
					class="{phase === 'fading_timeline' || phase === 'idle'
						? 'text-sm'
						: 'text-xl font-light'} leading-relaxed text-sand/70 transition-all duration-500 {selectedEvent.hasArticle
						? 'mb-4'
						: 'mb-0'}">
					{selectedEvent.desc}
				</p>

				<div
					class="flex justify-end text-sand/50 transition-all duration-300 {phase === 'fading_timeline' ||
					phase === 'idle'
						? 'mt-4 opacity-100'
						: 'm-0 h-0 overflow-hidden opacity-0'}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"
						></polyline
						><line x1="10" y1="14" x2="21" y2="3"></line></svg>
				</div>
			</div>

			<div
				class="grid transition-all duration-500 {phase === 'expanding_card'
					? 'mt-12 border-t border-white/10 pt-12 opacity-100'
					: 'mt-0 border-transparent pt-0 opacity-0'}"
				style="grid-template-rows: {phase === 'expanding_card' ? '1fr' : '0fr'};">
				<div class="overflow-hidden">
					{#if selectedEvent.articleContent}
						<article
							class="prose prose-invert {accessibility.dyslexiaFont
								? 'max-w-[90vw] text-base md:text-lg'
								: 'max-w-4xl text-lg md:text-xl'} mx-auto pb-8 text-left text-sand/80 transition-all duration-500"
							style="line-height: 1.65; letter-spacing: 0.01em;">
							{@render selectedEvent.articleContent()}
						</article>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.custom-scrollbar::-webkit-scrollbar {
		height: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.2);
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(215, 209, 198, 0.2);
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(215, 209, 198, 0.4);
	}
</style>
