<script lang="ts">
  import { onMount, tick, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

  if (browser) {
    gsap.registerPlugin(ScrollTrigger);
  }

  let mainContainer: HTMLElement;
  let featuresContainer: HTMLElement;
  let featurePanels: HTMLElement[] = [];
  let opportunityText: HTMLElement;

  let lastHeight = 0;
  let lastMaxScroll = 0;

  function handleResize() {
    if (!mainContainer || !browser) return;
    
    // Give browser a tiny moment to recalculate dvh layouts
    setTimeout(() => {
      const currentHeight = window.innerHeight;
      const currentMaxScroll = mainContainer.scrollHeight - mainContainer.clientHeight;
      
      if (lastHeight === 0) {
        lastHeight = currentHeight;
        lastMaxScroll = currentMaxScroll;
        return;
      }

      if (currentHeight !== lastHeight) {
        if (lastMaxScroll > 0 && currentMaxScroll > 0) {
          const scrollProportion = mainContainer.scrollTop / lastMaxScroll;
          mainContainer.scrollTop = scrollProportion * currentMaxScroll;
          ScrollTrigger.refresh();
        }
        lastHeight = currentHeight;
        lastMaxScroll = currentMaxScroll;
      }
    }, 50);
  }

  const feature1Pool = [
    '/images/features/IMG_8737.jpeg',
    '/images/features/IMG_8741.jpeg',
    '/images/features/IMG_8743.jpeg',
    '/images/features/IMG_8744.jpeg'
  ];
  const feature2Pool = [
    '/images/features/IMG_8748.jpeg',
    '/images/features/IMG_8806.jpeg'
  ];
  const feature3Pool = [
    '/images/features/IMG_8762.jpeg',
    '/images/features/IMG_8761.jpeg'
  ];

  let currentFeature1 = $state('');
  let currentFeature2 = $state('');
  let currentFeature3 = $state('');

  onMount(async () => {
    if (!browser) return;

    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 50);

    currentFeature1 = feature1Pool[Math.floor(Math.random() * feature1Pool.length)];
    currentFeature2 = feature2Pool[Math.floor(Math.random() * feature2Pool.length)];
    currentFeature3 = feature3Pool[Math.floor(Math.random() * feature3Pool.length)];

    await tick();

    gsap.fromTo(opportunityText,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: opportunityText,
          scroller: mainContainer,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.set([featurePanels[1], featurePanels[2]], { opacity: 1, pointerEvents: 'none' });
    gsap.set([
      featurePanels[1].querySelector('.feature-text-container'),
      featurePanels[2].querySelector('.feature-text-container')
    ], { y: 50, opacity: 0 });
    gsap.set([
      featurePanels[1].querySelector('.feature-image-container'),
      featurePanels[2].querySelector('.feature-image-container')
    ], { scale: 0 }); // Start scaled down to 0

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: featuresContainer,
        scroller: mainContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    // First transition
    tl.to(featurePanels[0].querySelector('.feature-text-container'), { y: -50, opacity: 0, duration: 1 })
      .to(featurePanels[1].querySelector('.feature-text-container'), { y: 0, opacity: 1, duration: 1 }, '<')
      .to(featurePanels[1].querySelector('.feature-image-container'), { scale: 1, duration: 1 }, '<');

    // Second transition
    tl.to(featurePanels[1].querySelector('.feature-text-container'), { y: -50, opacity: 0, duration: 1 })
      .to(featurePanels[2].querySelector('.feature-text-container'), { y: 0, opacity: 1, duration: 1 }, '<')
      .to(featurePanels[2].querySelector('.feature-image-container'), { scale: 1, duration: 1 }, '<');
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  });
</script>

<svelte:head>
  <title>Life Tabernacle</title>
  <meta name="description" content="Where the Bible is believed and obeyed" />
</svelte:head>

<main bind:this={mainContainer} class="w-full h-dvh overflow-y-auto overflow-x-hidden snap-y snap-mandatory bg-dark relative scroll-smooth">

  <section id="imagery" class="relative w-full h-dvh snap-start snap-always shrink-0 flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 z-0">
      <img src="/images/hero.jpeg" alt="Church interior" class="w-full h-full object-cover opacity-60" />
      <div class="absolute inset-0 bg-black/40"></div>
    </div>

    <nav class="absolute top-0 left-0 w-full z-20 flex justify-end items-center px-6 md:px-16 py-8">
      <div class="hidden md:flex gap-8">
        <a href="#opportunity" class="text-sand/80 hover:text-white uppercase tracking-widest text-sm transition-colors duration-300">Concept</a>
        <a href="#stay" class="text-sand/80 hover:text-white uppercase tracking-widest text-sm transition-colors duration-300">Features</a>
        <a href="#place" class="text-sand/80 hover:text-white uppercase tracking-widest text-sm transition-colors duration-300">Explore</a>
        <a href="#answers" class="text-sand/80 hover:text-white uppercase tracking-widest text-sm transition-colors duration-300">FAQ</a>
      </div>
    </nav>

    <div class="relative z-10 text-center flex flex-col items-center justify-center px-4 w-full h-full pt-20 pb-20">
      <h1 class="text-5xl md:text-8xl font-light tracking-widest text-white uppercase mb-6">Life tabernacle</h1>
      <p class="text-xl md:text-3xl text-sand font-light tracking-wide mb-12">Where the Bible is believed and obeyed</p>
      <a href="/schedule" class="inline-block border border-sand/50 text-white px-10 py-4 rounded-full tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-500">
        View schedule
      </a>
    </div>
  </section>

  <section id="opportunity" class="w-full h-dvh snap-start snap-always shrink-0 px-8 md:px-24 bg-zinc-900 flex flex-col items-center justify-center text-center">
    <div bind:this={opportunityText} class="max-w-5xl mx-auto foldable-padding opacity-0">
      <h2 class="text-4xl md:text-6xl text-sand leading-tight font-light tracking-wide">
        Tells the visitor that this is a church and maybe an inspirational quote or something
      </h2>
    </div>
  </section>

  <section id="stay" bind:this={featuresContainer} class="w-full h-[300dvh] relative shrink-0">
    <div class="sticky top-0 w-full h-dvh overflow-hidden bg-dark">
      <div
        bind:this={featurePanels[0]}
        class="absolute inset-0 flex flex-col md:flex-row items-center justify-center p-8 md:p-24 foldable-split"
      >
        <div class="feature-text-container w-full md:w-1/2 pr-0 md:pr-16 mb-8 md:mb-0 flex flex-col justify-center order-1 md:order-0">
          <h2 class="text-4xl md:text-6xl font-light mb-6 text-white">The Bible</h2>
          <p class="text-xl text-sand/80 leading-relaxed max-w-lg">
            This section is about the Bible being what we believe and base everything on
          </p>
        </div>
        <div class="feature-image-container w-full md:w-1/2 h-[40dvh] md:h-[60dvh] relative order-2 md:order-0 overflow-hidden rounded-xl shadow-2xl">
          {#if currentFeature1}
            <img src={currentFeature1} alt="Bible reading" class="w-full h-full object-cover" />
          {/if}
        </div>
      </div>

      <div
        bind:this={featurePanels[1]}
        class="absolute inset-0 flex flex-col md:flex-row items-center justify-center p-8 md:p-24 opacity-0 foldable-split"
      >
        <div class="feature-text-container w-full md:w-1/2 pr-0 md:pr-16 mb-8 md:mb-0 flex flex-col justify-center order-1 md:order-0">
          <h2 class="text-4xl md:text-6xl font-light mb-6 text-white">Community</h2>
          <p class="text-xl text-sand/80 leading-relaxed max-w-lg">
            Make it sound like a place you want to go and people you'd want to be around
          </p>
        </div>
        <div class="feature-image-container w-full md:w-1/2 h-[40dvh] md:h-[60dvh] relative order-2 md:order-0 overflow-hidden rounded-xl shadow-2xl">
          {#if currentFeature2}
            <img src={currentFeature2} alt="Community fellowship" class="w-full h-full object-cover" />
          {/if}
        </div>
      </div>

      <div
        bind:this={featurePanels[2]}
        class="absolute inset-0 flex flex-col md:flex-row items-center justify-center p-8 md:p-24 opacity-0 foldable-split"
      >
        <div class="feature-text-container w-full md:w-1/2 pr-0 md:pr-16 mb-8 md:mb-0 flex flex-col justify-center order-1 md:order-0">
          <h2 class="text-4xl md:text-6xl font-light mb-6 text-white">The truth</h2>
          <p class="text-xl text-sand/80 leading-relaxed max-w-lg">
            Probably something about Acts 2:38 and the plan of salvation
          </p>
        </div>
        <div class="feature-image-container w-full md:w-1/2 h-[40dvh] md:h-[60dvh] relative order-2 md:order-0 overflow-hidden rounded-xl shadow-2xl">
          {#if currentFeature3}
            <img src={currentFeature3} alt="Worship service" class="w-full h-full object-cover" />
          {/if}
        </div>
      </div>
    </div>

    <div class="absolute top-0 w-full h-dvh snap-start snap-always pointer-events-none"></div>
    <div class="absolute top-[100dvh] w-full h-dvh snap-start snap-always pointer-events-none"></div>
    <div class="absolute top-[200dvh] w-full h-dvh snap-start snap-always pointer-events-none"></div>
  </section>

  <section id="place" class="w-full h-dvh snap-start snap-always shrink-0 px-8 md:px-24 bg-zinc-900 flex flex-col justify-center">
    <h2 class="text-4xl md:text-6xl font-light mb-16 text-center text-white">Explore</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
      <a href="/schedule" class="group relative block h-[20dvh] md:h-[50dvh] overflow-hidden rounded-xl bg-dark border border-white/5 hover:border-white/20 transition-all duration-500">
        <div class="absolute inset-0 flex items-center justify-center">
          <h3 class="text-3xl font-light tracking-wide text-white group-hover:scale-110 transition-transform duration-700">Schedule</h3>
        </div>
      </a>
      <a href="/history" class="group relative block h-[20dvh] md:h-[50dvh] overflow-hidden rounded-xl bg-dark border border-white/5 hover:border-white/20 transition-all duration-500">
        <div class="absolute inset-0 flex items-center justify-center">
          <h3 class="text-3xl font-light tracking-wide text-white group-hover:scale-110 transition-transform duration-700">History</h3>
        </div>
      </a>
      <a href="/doctrine" class="group relative block h-[20dvh] md:h-[50dvh] overflow-hidden rounded-xl bg-dark border border-white/5 hover:border-white/20 transition-all duration-500">
        <div class="absolute inset-0 flex items-center justify-center">
          <h3 class="text-3xl font-light tracking-wide text-white group-hover:scale-110 transition-transform duration-700">What we believe</h3>
        </div>
      </a>
    </div>
  </section>

  <section id="answers" class="w-full h-dvh snap-start snap-always shrink-0 px-8 md:px-24 bg-dark flex flex-col justify-center">
    <div class="max-w-4xl mx-auto w-full foldable-padding">
      <h2 class="text-4xl md:text-6xl font-light mb-16 text-white text-center md:text-left">Answers</h2>

      <div class="space-y-12">
        <div>
          <h3 class="text-2xl text-white font-light mb-4">Question 1?</h3>
          <p class="text-lg text-sand/70 leading-relaxed">
            These are mainly to addres any other questions that someone might have when visiting the website
          </p>
        </div>

        <div>
          <h3 class="text-2xl text-white font-light mb-4">Question 2?</h3>
          <p class="text-lg text-sand/70 leading-relaxed">
            Answer 2
          </p>
        </div>

        <div>
          <h3 class="text-2xl text-white font-light mb-4">Question 3?</h3>
          <p class="text-lg text-sand/70 leading-relaxed">
            Answer 3
          </p>
        </div>
      </div>
    </div>
  </section>

</main>

<style>
  @media (horizontal-viewport-segments: 2) {
    .foldable-split {
      display: grid !important;
      grid-template-columns: 1fr 1fr;
      gap: env(viewport-segment-width 0 0);
    }

    .foldable-padding {
      padding-top: max(env(viewport-segment-top 0 0), 2rem);
      padding-bottom: max(env(viewport-segment-bottom 0 0), 2rem);
      padding-left: max(env(viewport-segment-left 0 0), 2rem);
      padding-right: max(env(viewport-segment-right 0 0), 2rem);
    }
  }
</style>