<script lang="ts">
  import stephenImg from '$lib/assets/pastors/stephen_marchbanks.jpeg?enhanced';
  import type { Picture } from '@sveltejs/enhanced-img';
  import { fontState } from '$lib/fontState.svelte.js';
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
        { id: 's1-m2', title: 'Milestone 2', desc: 'Description of what happened', position: 'bottom', date: 'Year' },
        { id: 's1-m3', title: 'Milestone 3', desc: 'Description of what happened', position: 'top', date: 'Year' },
      ]
    },
    {
      pastor: 'Mike Webb',
      period: 'Season 2',
      milestones: [
        { id: 's2-m1', title: 'Milestone 1', desc: 'Description of what happened', position: 'bottom', date: 'Year' },
        { id: 's2-m2', title: 'Milestone 2', desc: 'Description of what happened', position: 'top', date: 'Year' },
        { id: 's2-m3', title: 'Milestone 3', desc: 'Description of what happe   ned', position: 'bottom', date: 'Year' },
      ]
    },
    {
      pastor: 'Johnathan Kendrick',
      period: 'Season 3',
      milestones: [
        { id: 's3-m1', title: 'Milestone 1', desc: 'Description of what happened', position: 'top', date: 'Year' },
        { id: 's3-m2', title: 'Milestone 2', desc: 'Description of what happened', position: 'bottom', date: 'Year' },
        { id: 's3-m3', title: 'Milestone 3', desc: 'Description of what happened', position: 'top', date: 'Year' },
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
        { id: 's4-m2', title: 'Milestone 2', desc: 'Description of what happened', position: 'top', date: 'Year' },
        { id: 's4-m3', title: 'Milestone 3', desc: 'Description of what happened', position: 'bottom', date: 'Year' },
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

        sections.forEach(section => {
          const pos = section.offsetLeft;
          const distance = Math.abs(scrollX - pos);
          if (distance < minDistance) {
            minDistance = distance;
            nearestPos = pos;
          }
        });

        const snapThreshold = 120; // closer edge threshold

        if (minDistance <= snapThreshold && scrollX !== nearestPos) {
          node.scrollTo({ left: nearestPos, behavior: 'smooth' });
        }
      }, 150);
    }

    node.addEventListener('wheel', handleWheel, { passive: false });
    node.addEventListener('scroll', handleScroll, { passive: true });

    return {
      destroy() {
        node.removeEventListener('wheel', handleWheel);
        node.removeEventListener('scroll', handleScroll);
        window.clearTimeout(isScrolling);
      }
    };
  }
</script>

{#snippet article1()}
  <p class="mb-4">The foundation was laid, building was built</p>
{/snippet}

{#snippet article2()}
  <p class="mb-4">Current era</p>
{/snippet}

<svelte:head>
  <title>History | Life Tabernacle</title>
</svelte:head>

<!-- Timeline View -->
<div use:horizontalScroll class="h-full w-full overflow-x-auto overflow-y-hidden scroll-smooth flex custom-scrollbar {fontState.useDyslexicFont ? 'font-dyslexic' : ''}">

  <div class="fixed top-8 right-8 md:right-12 z-40 transition-opacity duration-300 {phase !== 'idle' ? 'opacity-0 pointer-events-none' : 'opacity-100'}">
    <button
      onclick={() => fontState.toggle()}
      class="text-xs text-sand/50 hover:text-white transition-colors underline underline-offset-4 tracking-widest whitespace-nowrap bg-dark/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
      aria-pressed={fontState.useDyslexicFont}
    >
      {fontState.useDyslexicFont ? 'Disable' : 'Enable'} dyslexia font
    </button>
  </div>

  {#each eras as era (era.period)}
    <section class="relative shrink-0 flex h-full">
      <!-- Sticky Header -->
      <div class="sticky left-0 top-0 h-[40dvh] md:h-full w-screen md:w-[33vw] bg-dark z-20 flex flex-col justify-center px-8 md:px-16 md:border-r border-sand/10 shrink-0 overflow-hidden">
        {#if era.image}
          <div class="absolute inset-0 z-0">
            <enhanced:img src={era.image} alt={era.pastor} class="w-full h-full object-cover opacity-80" />
            <div class="absolute inset-0 bg-linear-to-t from-dark via-dark/80 to-transparent"></div>
          </div>
        {/if}
        <div class="relative z-10">
          <h2 class="text-sm tracking-[0.3em] text-sand/60 mb-2">{era.period}</h2>
          <h1 class="text-4xl md:text-5xl font-light tracking-widest text-white">{era.pastor}</h1>
        </div>
      </div>

      <!-- Milestones Container -->
      <div class="flex items-center h-[60dvh] md:h-full self-end md:self-auto z-10 shrink-0 ml-[-100vw] md:ml-0 pl-[10vw] md:pl-10 relative">

        <!-- horizontal timeline line -->
        <div class="absolute top-1/2 left-0 w-full h-px bg-sand/20 -translate-y-1/2 -z-10"></div>

        {#each era.milestones as milestone (milestone.id)}
          <div class="relative flex flex-col items-center justify-center w-64 mx-8 md:mx-16 shrink-0 h-full group">

            <!-- dot on the timeline -->
            <div class="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-white -translate-x-1/2 -translate-y-1/2 z-20 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-300 {milestone.hasArticle ? 'group-hover:scale-150' : ''}"></div>

            {#if milestone.position === 'top'}
              <!-- connecting line -->
              <div class="absolute bottom-1/2 left-1/2 w-px bg-sand/40 -translate-x-1/2 h-16 md:h-24 transition-all duration-300 {milestone.hasArticle ? 'group-hover:bg-sand/80' : ''}"></div>

              <!-- Event Card -->
              <div class="absolute bottom-[calc(50%+4rem)] md:bottom-[calc(50%+6rem)] w-full flex justify-center">
                <button
                  class="bg-dark/80 backdrop-blur border border-sand/10 p-6 rounded text-left transform transition-all duration-300 w-full {milestone.hasArticle && phase === 'idle' ? 'hover:-translate-y-1 hover:bg-dark cursor-pointer ring-1 ring-transparent hover:ring-sand/20' : 'cursor-default'} {selectedEvent?.id === milestone.id ? 'opacity-0 pointer-events-none' : 'opacity-100'}"
                  onclick={(e) => expand(milestone, e)}
                >
                  <span class="text-xs tracking-widest text-sand/50 uppercase mb-2 block">{milestone.date}</span>
                  <h3 class="text-xl font-light tracking-wider text-white mb-2">{milestone.title}</h3>
                  <p class="text-sm text-sand/70 leading-relaxed {milestone.hasArticle ? 'mb-4' : 'mb-0'}">{milestone.desc}</p>

                  {#if milestone.hasArticle}
                    <div class="text-sand/50 flex justify-end mt-4 {phase === 'idle' ? 'group-hover:text-white transition-colors' : ''}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </div>
                  {/if}
                </button>
              </div>
            {:else}
              <!-- connecting line -->
              <div class="absolute top-1/2 left-1/2 w-px bg-sand/40 -translate-x-1/2 h-16 md:h-24 transition-all duration-300 {milestone.hasArticle ? 'group-hover:bg-sand/80' : ''}"></div>

              <!-- Event Card -->
              <div class="absolute top-[calc(50%+4rem)] md:top-[calc(50%+6rem)] w-full flex justify-center">
                <button
                  class="bg-dark/80 backdrop-blur border border-sand/10 p-6 rounded text-left transform transition-all duration-300 w-full {milestone.hasArticle && phase === 'idle' ? 'hover:translate-y-1 hover:bg-dark cursor-pointer ring-1 ring-transparent hover:ring-sand/20' : 'cursor-default'} {selectedEvent?.id === milestone.id ? 'opacity-0 pointer-events-none' : 'opacity-100'}"
                  onclick={(e) => expand(milestone, e)}
                >
                  <span class="text-xs tracking-widest text-sand/50 uppercase mb-2 block">{milestone.date}</span>
                  <h3 class="text-xl font-light tracking-wider text-white mb-2">{milestone.title}</h3>
                  <p class="text-sm text-sand/70 leading-relaxed {milestone.hasArticle ? 'mb-4' : 'mb-0'}">{milestone.desc}</p>

                  {#if milestone.hasArticle}
                    <div class="text-sand/50 flex justify-end mt-4 {phase === 'idle' ? 'group-hover:text-white transition-colors' : ''}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </div>
                  {/if}
                </button>
              </div>
            {/if}
          </div>
        {/each}

        <!-- Extra space at the end of the era -->
        <div class="w-[20vw] md:w-[33vw] shrink-0"></div>
      </div>
    </section>
  {/each}
</div>

<!-- Article Overlay View (Fixed Clone) -->
{#if selectedEvent && cardRect}
  <!-- Dark Background Fade -->
  <div class="fixed inset-0 z-100 pointer-events-none bg-dark/95 transition-opacity duration-300 {phase !== 'idle' ? 'opacity-100' : 'opacity-0'}" style="visibility: {phase !== 'idle' ? 'visible' : 'hidden'}; transition: opacity 300ms, visibility 300ms;"></div>

  <div
    class="fixed z-110 bg-dark/80 backdrop-blur border border-sand/10 {phase === 'fading_timeline' || phase === 'idle' ? 'rounded' : 'rounded-lg'} overflow-y-auto overflow-x-hidden shadow-2xl transition-all duration-500 ease-in-out"
    style="
      top: {phase === 'fading_timeline' || phase === 'idle' ? cardRect.top + 'px' : 'max(5vh, 2rem)'};
      left: {phase === 'fading_timeline' || phase === 'idle' ? cardRect.left + 'px' : '50%'};
      width: {phase === 'fading_timeline' || phase === 'idle' ? cardRect.width + 'px' : 'min(100vw - 2rem, 56rem)'};
      transform: {phase === 'fading_timeline' || phase === 'idle' ? 'none' : 'translateX(-50%)'};
      max-height: 90vh;
    "
  >
    <div class="relative w-full {phase === 'fading_timeline' || phase === 'idle' ? 'p-6' : 'p-8 md:p-16'} transition-all duration-500 {fontState.useDyslexicFont ? 'font-dyslexic' : ''}">

      <!-- Back button -->
      <button
        onclick={collapse}
        class="absolute top-4 left-4 md:top-8 md:left-8 text-xs text-sand/50 hover:text-white transition-colors tracking-widest flex items-center gap-2 group cursor-pointer {phase === 'expanding_card' ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300"
      >
        <span class="text-lg leading-none transform transition-transform group-hover:-translate-x-1">&larr;</span> Back to timeline
      </button>

      <div class="{phase === 'expanding_card' ? 'mt-12' : 'mt-0'} transition-all duration-500">
        <span class="text-xs tracking-widest text-sand/50 uppercase block {phase === 'fading_timeline' || phase === 'idle' ? 'mb-2' : 'mb-4'} transition-all duration-500">{selectedEvent.date}</span>
        <h3 class="{phase === 'fading_timeline' || phase === 'idle' ? 'text-xl mb-2' : 'text-4xl md:text-5xl mb-6'} font-light tracking-wider text-white transition-all duration-500">{selectedEvent.title}</h3>
        <p class="{phase === 'fading_timeline' || phase === 'idle' ? 'text-sm' : 'text-xl font-light'} text-sand/70 leading-relaxed transition-all duration-500 {selectedEvent.hasArticle ? 'mb-4' : 'mb-0'}">{selectedEvent.desc}</p>

        <!-- The read article icon (hidden when expanded) -->
        <div class="text-sand/50 flex justify-end transition-all duration-300 {phase === 'fading_timeline' || phase === 'idle' ? 'opacity-100 mt-4' : 'opacity-0 h-0 m-0 overflow-hidden'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </div>
      </div>

      <!-- Expanding Article -->
      <div class="grid transition-all duration-500 {phase === 'expanding_card' ? 'opacity-100 mt-12 pt-12 border-t border-white/10' : 'opacity-0 mt-0 pt-0 border-transparent'}" style="grid-template-rows: {phase === 'expanding_card' ? '1fr' : '0fr'};">
        <div class="overflow-hidden">
          {#if selectedEvent.articleContent}
            <article class="prose prose-invert {fontState.useDyslexicFont ? 'max-w-[90vw] text-base md:text-lg' : 'max-w-4xl text-lg md:text-xl'} mx-auto text-left text-sand/80 pb-8 transition-all duration-500" style="line-height: 1.65; letter-spacing: 0.01em;">
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
    background: rgba(0,0,0,0.2);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(215, 209, 198, 0.2);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(215, 209, 198, 0.4);
  }
</style>