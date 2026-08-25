<script lang="ts">
  import stephenImg from '$lib/assets/pastors/stephen_marchbanks.jpeg?enhanced';

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
      image: stephenImg,
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

        const snapThreshold = 100; // closer edge threshold

        if (minDistance < snapThreshold && scrollX !== nearestPos) {
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
  {#each eras as era (era.period)}
    <section class="relative shrink-0 flex h-full">
      <!-- Sticky Header -->
      <div class="sticky left-0 top-0 h-[40dvh] md:h-full w-screen md:w-[33vw] bg-dark z-20 flex flex-col justify-center px-8 md:px-16 md:border-r border-sand/10 shrink-0 relative overflow-hidden">
        {#if era.image}
          <div class="absolute inset-0 z-0">
            <enhanced:img src={era.image} alt={era.pastor} class="w-full h-full object-cover opacity-20 mix-blend-luminosity" />
            <div class="absolute inset-0 bg-gradient-to-r from-dark/80 to-dark"></div>
          </div>
        {/if}
        <div class="relative z-10">
          <h2 class="text-sm tracking-[0.3em] text-sand/60 mb-2">{era.period}</h2>
          <h1 class="text-4xl md:text-5xl font-light tracking-widest text-white">{era.pastor}</h1>
        </div>
      </div>

      <!-- Milestones Container (scrolls past) -->
      <div class="flex items-center h-[60dvh] md:h-full self-end md:self-auto z-10 shrink-0 ml-[-100vw] md:ml-0 pl-[10vw] md:pl-10 relative">
        
        <!-- horizontal timeline line -->
        <div class="absolute top-1/2 left-0 w-full h-px bg-sand/20 -translate-y-1/2 -z-10"></div>
        
        {#each era.milestones as milestone (milestone.title)}
          <div class="relative flex flex-col items-center w-64 mx-8 md:mx-16 shrink-0 {milestone.position === 'top' ? 'mb-[20dvh] md:mb-[40dvh]' : 'mt-[20dvh] md:mt-[40dvh]'}">
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

        <!-- Extra space at the end of the era -->
        <div class="w-[20vw] md:w-[33vw] shrink-0"></div>
      </div>
    </section>
  {/each}
</div>

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
