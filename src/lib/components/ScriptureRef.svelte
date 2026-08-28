<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicOut, quartInOut } from 'svelte/easing';

	function slideY(node: Element, { delay = 0, duration = 400, easing = cubicOut, enabled = true }) {
		if (!enabled) return { duration: 0, delay: 0, css: () => '' };
		return {
			delay,
			duration,
			easing,
			css: (t: number) => `
				transform: translateY(${(1 - t) * 15}px);
				opacity: ${t};
			`
		};
	}

	function portalAfterTarget(node: HTMLElement) {
		const target = node.closest('p, li, h1, h2, h3, h4, h5, h6') as HTMLElement | null;
		if (target && target.parentNode) {
			let insertBeforeNode = target.nextSibling;
			while (
				insertBeforeNode &&
				insertBeforeNode.nodeType === 1 &&
				(insertBeforeNode as HTMLElement).hasAttribute('data-scripture-dropdown')
			) {
				insertBeforeNode = insertBeforeNode.nextSibling;
			}
			target.parentNode.insertBefore(node, insertBeforeNode);
			
			target.classList.add('scripture-active-paragraph');
		}

		return {
			destroy() {
				if (target) {
					// Check if there are any remaining dropdowns directly after this target
					let hasDropdowns = false;
					let sibling = target.nextSibling;
					while (
						sibling &&
						sibling.nodeType === 1 &&
						(sibling as HTMLElement).hasAttribute('data-scripture-dropdown')
					) {
						hasDropdowns = true;
						break;
					}
					
					if (!hasDropdowns) {
						target.classList.remove('scripture-active-paragraph');
					}
				}
			}
		};
	}

	let { reference } = $props<{ reference: string }>();

	let isOpen = $state(false);
	let hasAnimated = $state(false);
	let versesText = $state<string | null>(null);
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	async function toggleReference() {
		if (isOpen) {
			isOpen = false;
			hasAnimated = true;
			return;
		}

		if (!versesText && !isLoading) {
			isLoading = true;
			error = null;

			try {
				// Parse reference. Examples: "Acts 2:38", "1 John 1:9", "Acts 2:38-39"
				const match = reference.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
				if (!match) {
					throw new Error('Invalid scripture reference format');
				}

				const book = match[1];
				const chapter = match[2];
				const startVerse = parseInt(match[3], 10);
				const endVerse = match[4] ? parseInt(match[4], 10) : startVerse;

				// Fetch JSON file
				const bookFilename = book.replace(/\s+/g, '_');
				const response = await fetch(`/bible/${bookFilename}.json`);

				if (!response.ok) {
					throw new Error(`Failed to load book: ${book}`);
				}

				const bookData = (await response.json()) as Record<string, Record<string, string>>;
				const chapterData = bookData[chapter];

				if (!chapterData) {
					throw new Error(`Chapter ${chapter} not found in ${book}`);
				}

				let combinedText = '';
				for (let v = startVerse; v <= endVerse; v++) {
					const verseText = chapterData[v.toString()];
					if (verseText) {
						combinedText += (v > startVerse ? ' ' : '') + `[${v}] ${verseText}`;
					}
				}

				if (!combinedText) {
					throw new Error('Verses not found');
				}

				// If it's a single verse, we can strip the verse number for a cleaner look
				if (startVerse === endVerse) {
					versesText = combinedText.replace(/^\[\d+\]\s*/, '');
				} else {
					versesText = combinedText;
				}
			} catch (err: unknown) {
				error = err instanceof Error ? err.message : 'Failed to load scripture';
			} finally {
				isLoading = false;
			}
		}

		isOpen = true;
	}
</script>

<span class="inline">
	<button
		onclick={toggleReference}
		class="cursor-pointer font-medium text-sand underline decoration-sand/30 underline-offset-4 transition-colors hover:text-white hover:decoration-sand"
		aria-expanded={isOpen}>
		{reference}
	</button>

	{#if isOpen}
		<div use:portalAfterTarget data-scripture-dropdown="true" class="m-0!" transition:slide={{ duration: 400, easing: quartInOut }}>
			<div class="pt-4 pb-6">
				<div class="relative overflow-hidden pl-6">
					<!-- Left border perfectly mirrors dropdown height -->
					<div class="absolute top-0 bottom-0 left-0 w-0.5 bg-white/20"></div>

					{#if error}
						<div class="text-sm text-red-400">
							{error}
						</div>
					{:else if versesText}
						<div>
							<div class="flex flex-wrap gap-x-[0.25em] gap-y-0 text-base text-sand/60 italic sm:text-lg">
								{#each versesText.split(' ') as word, i (i)}
									<span
										in:slideY|global={{
											duration: 800,
											delay: 400 + (Math.sin(i * 13) * 0.5 + 0.5) * 60,
											easing: cubicOut,
											enabled: !hasAnimated
										}}>
										{word}
									</span>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</span>

<style>
	:global(.scripture-active-paragraph) {
		margin-bottom: 0 !important;
	}
</style>
