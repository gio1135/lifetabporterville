<script lang="ts">
  const eras = [
    {
      pastor: 'Rev. Webb',
      period: 'Season 1',
      milestones: [
        { title: 'Event one', desc: 'Description of what happened', position: 'top' },
        { title: 'Event two', desc: 'Description of what happened', position: 'bottom' },
        { title: 'Event three', desc: 'Description of what happened', position: 'top' },
      ]
    },
    {
      pastor: 'Rev. Webb',
      period: 'Season 2',
      milestones: [
        { title: 'Event one', desc: 'Description of what happened', position: 'bottom' },
        { title: 'Event two', desc: 'Description of what happened', position: 'top' },
        { title: 'Event three', desc: 'Description of what happened', position: 'bottom' },
      ]
    },
    {
      pastor: 'Johnathan Kendrick',
      period: 'Season 3',
      milestones: [
        { title: 'Event one', desc: 'Description of what happened', position: 'top' },
        { title: 'Event two', desc: 'Description of what happened', position: 'bottom' },
        { title: 'Event three', desc: 'Description of what happened', position: 'top' },
      ]
    },
    {
      pastor: 'Stephen Marchbanks',
      period: 'Season 4',
      milestones: [
        { title: 'Event one', desc: 'Description of what happened', position: 'bottom' },
        { title: 'Event two', desc: 'Description of what happened', position: 'top' },
        { title: 'Event three', desc: 'Description of what happened', position: 'bottom' },
      ]
    }
  ];

  function horizontalScroll(node: HTMLElement) {
    function handleWheel(e: WheelEvent) {
      if (e.deltaY !== 0) {
        e.preventDefault();
        // Increased multiplier from 2 to 4 for faster scrolling
        node.scrollBy({ left: e.deltaY * 4, behavior: 'auto' });
      }
    }

    let isScrolling: number;
    function handleScroll() {
      window.clearTimeout(isScrolling);
      isScrolling = window.setTimeout(() => {
        const scrollX = node.scrollLeft;
        const width = window.innerWidth;
        const snapThreshold = 150; // closer edge threshold (only snap if within 150px of an era boundary)

        const nearestIndex = Math.round(scrollX / width);
        const nearestPos = nearestIndex * width;

        if (Math.abs(scrollX - nearestPos) < snapThreshold && scrollX !== nearestPos) {
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

<svelte:head>
  <title>History | Life Tabernacle</title>
</svelte:head>

<div use:horizontalScroll class="h-full w-full overflow-x-auto overflow-y-hidden scroll-smooth flex custom-scrollbar">
  {#each eras as era, i (era.period)}
    <section class="w-screen h-full shrink-0 snap-start relative flex flex-col pt-12 md:pt-24 px-8 md:px-20">

      <!-- Era Header -->
      <div class="absolute top-12 md:top-24 left-8 md:left-20 z-10">
        <h2 class="text-sm tracking-[0.3em] uppercase text-sand/60 mb-2">{era.period}</h2>
        <h1 class="text-4xl md:text-6xl font-light tracking-widest text-white uppercase">{era.pastor}</h1>
      </div>

      <!-- The horizontal timeline line -->
      <div class="absolute top-1/2 left-0 w-full h-px bg-sand/20 -translate-y-1/2"></div>

      <!-- Milestones container -->
      <div class="relative w-full h-full flex items-center justify-around z-10 pt-24">
        {#each era.milestones as milestone (milestone.title)}
          <div class="relative flex flex-col items-center w-64 {milestone.position === 'top' ? 'mb-[40vh]' : 'mt-[40vh]'}">
            <!-- connecting line to the timeline -->
            <div class="absolute {milestone.position === 'top' ? '-bottom-10 h-10' : '-top-10 h-10'} w-px bg-sand/40 left-1/2 -translate-x-1/2"></div>

            <!-- dot on the timeline -->
            <div class="absolute {milestone.position === 'top' ? '-bottom-11' : '-top-11'} w-2 h-2 rounded-full bg-white left-1/2 -translate-x-1/2"></div>

            <div class="bg-dark/80 backdrop-blur border border-sand/10 p-6 rounded text-center transform transition-transform hover:scale-105 duration-300">
              <h3 class="text-xl font-light tracking-wider text-white mb-3">{milestone.title}</h3>
              <p class="text-sm text-sand/70 leading-relaxed">{milestone.desc}</p>
            </div>
          </div>
        {/each}
      </div>

      <!-- Scroll indicator for the first slide -->
      {#if i === 0}
        <div class="absolute bottom-12 right-12 flex items-center gap-4 text-sand/60 animate-pulse">
          <span class="text-xs tracking-widest uppercase">Scroll horizontally</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </div>
      {/if}

    </section>
  {/each}
</div>

<style>
  /* Hide standard scrollbar but keep functionality for a cleaner look if desired, or style it */
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
