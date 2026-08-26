<script lang="ts">
  import { onMount, tick, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
  import heroImg from '$lib/images/hero.jpeg?enhanced';

  // Import features using eager glob import for enhanced images
  const f1 = import.meta.glob('$lib/images/features/IMG_8737.jpeg', { query: { enhanced: true }, eager: true, import: 'default' });
  const f1_2 = import.meta.glob('$lib/images/features/IMG_8741.jpeg', { query: { enhanced: true }, eager: true, import: 'default' });
  const f1_3 = import.meta.glob('$lib/images/features/IMG_8743.jpeg', { query: { enhanced: true }, eager: true, import: 'default' });
  const f1_4 = import.meta.glob('$lib/images/features/IMG_8744.jpeg', { query: { enhanced: true }, eager: true, import: 'default' });
  const feature1Pool = [Object.values(f1)[0], Object.values(f1_2)[0], Object.values(f1_3)[0], Object.values(f1_4)[0]] as string[];

  const f2 = import.meta.glob('$lib/images/features/IMG_8748.jpeg', { query: { enhanced: true }, eager: true, import: 'default' });
  const f2_2 = import.meta.glob('$lib/images/features/IMG_8806.jpeg', { query: { enhanced: true }, eager: true, import: 'default' });
  const feature2Pool = [Object.values(f2)[0], Object.values(f2_2)[0]] as string[];

  const f3 = import.meta.glob('$lib/images/features/IMG_8761.jpeg', { query: { enhanced: true }, eager: true, import: 'default' });
  const f3_2 = import.meta.glob('$lib/images/features/IMG_8762.jpeg', { query: { enhanced: true }, eager: true, import: 'default' });
  const feature3Pool = [Object.values(f3)[0], Object.values(f3_2)[0]] as string[];

  if (browser) {
    gsap.registerPlugin(ScrollTrigger);
  }

  let mainContainer: HTMLElement;
  let featuresContainer: HTMLElement;
  let featurePanels: HTMLElement[] = [];
  let opportunityText: HTMLElement;
  let trigger2: HTMLElement;
  let trigger3: HTMLElement;

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

  let currentFeature1 = $state<string | null>(null);
  let currentFeature2 = $state<string | null>(null);
  let currentFeature3 = $state<string | null>(null);

  let isMenuOpen = $state(false);
  let addressCopied = $state(false);
  let phoneCopied = $state(false);

  function copyAddress() {
    navigator.clipboard.writeText('939 N Main St, Porterville, CA 93257');
    addressCopied = true;
    setTimeout(() => addressCopied = false, 2000);
  }

  function copyPhone() {
    navigator.clipboard.writeText('(559) 781-8068');
    phoneCopied = true;
    setTimeout(() => phoneCopied = false, 2000);
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

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
    ], { clipPath: 'inset(50%)' });

    let state2 = 0;
    const animateIn2 = () => {
      if (state2 === 1) return;
      state2 = 1;
      gsap.to(featurePanels[0].querySelector('.feature-text-container'), { y: -50, opacity: 0, duration: 0.3, ease: 'power2.inOut', overwrite: true });
      gsap.to(featurePanels[1].querySelector('.feature-text-container'), { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.1, overwrite: true });
      gsap.to(featurePanels[1].querySelector('.feature-image-container'), { clipPath: 'inset(0%)', duration: 0.45, ease: 'power2.inOut', overwrite: true });
    };

    const animateOut2 = () => {
      if (state2 === 0) return;
      state2 = 0;
      gsap.to(featurePanels[1].querySelector('.feature-text-container'), { y: 50, opacity: 0, duration: 0.3, ease: 'power2.inOut', overwrite: true });
      gsap.to(featurePanels[1].querySelector('.feature-image-container'), { clipPath: 'inset(50%)', duration: 0.4, ease: 'power2.inOut', overwrite: true });
      gsap.to(featurePanels[0].querySelector('.feature-text-container'), { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.1, overwrite: true });
    };

    ScrollTrigger.create({
      trigger: trigger2,
      scroller: mainContainer,
      start: 'top 80%',
      end: 'top 20%',
      onEnter: animateIn2,
      onLeave: animateIn2,
      onEnterBack: animateOut2,
      onLeaveBack: animateOut2
    });

    let state3 = 0;
    const animateIn3 = () => {
      if (state3 === 1) return;
      state3 = 1;
      gsap.to(featurePanels[1].querySelector('.feature-text-container'), { y: -50, opacity: 0, duration: 0.3, ease: 'power2.inOut', overwrite: true });
      gsap.to(featurePanels[2].querySelector('.feature-text-container'), { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.1, overwrite: true });
      gsap.to(featurePanels[2].querySelector('.feature-image-container'), { clipPath: 'inset(0%)', duration: 0.45, ease: 'power2.inOut', overwrite: true });
    };

    const animateOut3 = () => {
      if (state3 === 0) return;
      state3 = 0;
      gsap.to(featurePanels[2].querySelector('.feature-text-container'), { y: 50, opacity: 0, duration: 0.3, ease: 'power2.inOut', overwrite: true });
      gsap.to(featurePanels[2].querySelector('.feature-image-container'), { clipPath: 'inset(50%)', duration: 0.4, ease: 'power2.inOut', overwrite: true });
      gsap.to(featurePanels[1].querySelector('.feature-text-container'), { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.1, overwrite: true });
    };

    ScrollTrigger.create({
      trigger: trigger3,
      scroller: mainContainer,
      start: 'top 80%',
      end: 'top 20%',
      onEnter: animateIn3,
      onLeave: animateIn3,
      onEnterBack: animateOut3,
      onLeaveBack: animateOut3
    });
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
      <enhanced:img src={heroImg} alt="Church interior" class="w-full h-full object-cover opacity-60" fetchpriority="high" />
      <div class="absolute inset-0 bg-black/40"></div>
    </div>

    <nav class="absolute top-0 left-0 w-full z-50 flex justify-end items-center px-6 md:px-16 py-8">
      <div class="hidden md:flex gap-8">
        <a href="/schedule" class="text-sand/80 hover:text-white tracking-widest text-sm transition-colors duration-300">Schedule</a>
        <a href="/history" class="text-sand/80 hover:text-white tracking-widest text-sm transition-colors duration-300">History</a>
        <a href="/doctrine" class="text-sand/80 hover:text-white tracking-widest text-sm transition-colors duration-300">What we believe</a>
      </div>
      <button class="md:hidden relative z-60 text-sand/80 hover:text-white focus:outline-none transition-colors duration-300" onclick={toggleMenu} aria-label="Toggle menu">
        {#if isMenuOpen}
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        {/if}
      </button>
    </nav>

    {#if isMenuOpen}
      <div class="fixed inset-0 bg-[#0f0f0f] z-40 flex flex-col items-center justify-center space-y-10 md:hidden">
        <a href="/schedule" onclick={toggleMenu} class="text-3xl font-light text-white tracking-widest">Schedule</a>
        <a href="/history" onclick={toggleMenu} class="text-3xl font-light text-white tracking-widest">History</a>
        <a href="/doctrine" onclick={toggleMenu} class="text-3xl font-light text-white tracking-widest">What we believe</a>
      </div>
    {/if}

    <div class="relative z-10 text-center flex flex-col items-center justify-center px-4 w-full h-full pt-20 pb-20">
      <h1 class="text-5xl md:text-8xl font-light tracking-widest text-white mb-6">Life Tabernacle</h1>
      <p class="text-xl md:text-3xl text-sand font-light tracking-wide mb-12">Where the Bible is believed and obeyed</p>
    </div>

    <!-- Scroll Line -->
    <div class="absolute z-20 w-px h-16 bg-white/10 overflow-hidden pointer-events-none rounded-full bottom-[15%] right-8 md:bottom-10 md:inset-x-0 md:mx-auto">
      <div class="w-full h-8 bg-linear-to-b from-transparent via-white to-transparent animate-scroll-line"></div>
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
    <div class="sticky top-0 w-full h-dvh overflow-hidden bg-dark shadow-2xl">
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
        <div class="feature-image-container w-full md:w-1/2 h-[40dvh] md:h-[60dvh] relative order-2 md:order-0 overflow-hidden rounded-xl">
          {#if currentFeature1}
            <enhanced:img src={currentFeature1} alt="Bible reading" class="w-full h-full object-cover" fetchpriority="high" />
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
        <div class="feature-image-container w-full md:w-1/2 h-[40dvh] md:h-[60dvh] relative order-2 md:order-0 overflow-hidden rounded-xl">
          {#if currentFeature2}
            <enhanced:img src={currentFeature2} alt="Community fellowship" class="w-full h-full object-cover" />
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
        <div class="feature-image-container w-full md:w-1/2 h-[40dvh] md:h-[60dvh] relative order-2 md:order-0 overflow-hidden rounded-xl">
          {#if currentFeature3}
            <enhanced:img src={currentFeature3} alt="Worship service" class="w-full h-full object-cover" />
          {/if}
        </div>
      </div>
    </div>

    <div class="absolute top-0 w-full h-dvh snap-start snap-always pointer-events-none"></div>
    <div bind:this={trigger2} class="absolute top-[100dvh] w-full h-dvh snap-start snap-always pointer-events-none"></div>
    <div bind:this={trigger3} class="absolute top-[200dvh] w-full h-dvh snap-start snap-always pointer-events-none"></div>
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

  <section id="visit" class="w-full h-dvh snap-start snap-always shrink-0 px-8 md:px-24 bg-zinc-900 flex flex-col justify-center">
    <div class="max-w-4xl mx-auto w-full foldable-padding text-center md:text-left">
      <h2 class="text-4xl md:text-6xl font-light mb-12 text-white">Visit us</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div class="flex flex-col space-y-8">
          <div>
            <h3 class="text-2xl text-white font-light mb-4">What to expect</h3>
            <p class="text-lg text-sand/70 leading-relaxed">
              Worship, biblical teaching, friendly atmosphere, no dress code, come as you are type of thing
            </p>
          </div>

          <div>
            <h3 class="text-2xl text-white font-light mb-4">Transportation</h3>
            <p class="text-lg text-sand/70 leading-relaxed">
              We offer free transportation if you need a ride
            </p>
          </div>
        </div>

        <div class="flex flex-col space-y-8">
          <div>
            <h3 class="text-2xl text-white font-light mb-4">Location</h3>
            <div class="flex items-center justify-center md:justify-start gap-4">
              <a href="https://maps.google.com/?q=939+N+Main+St,+Porterville,+CA+93257" target="_blank" rel="noopener noreferrer" class="text-lg text-sand/70 hover:text-white transition-colors underline-offset-4 hover:underline">
                939 N Main St, Porterville, CA 93257
              </a>
              <button onclick={copyAddress} class="p-2 rounded-full hover:bg-white/10 transition-colors text-sand/70 hover:text-white" aria-label="Copy address" title="Copy address">
                {#if addressCopied}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                {/if}
              </button>
            </div>
          </div>

          <div>
            <h3 class="text-2xl text-white font-light mb-4">Contact</h3>
            <div class="flex items-center justify-center md:justify-start gap-4">
              <a href="tel:+15597818068" class="text-lg text-sand/70 hover:text-white transition-colors">
                (559) 781-8068
              </a>
              <button onclick={copyPhone} class="p-2 rounded-full hover:bg-white/10 transition-colors text-sand/70 hover:text-white" aria-label="Copy phone number" title="Copy phone number">
                {#if phoneCopied}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                {/if}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</main>

<style>
  @keyframes scroll-line {
    0% {
      transform: translateY(200%);
    }
    100% {
      transform: translateY(-100%);
    }
  }

  .animate-scroll-line {
    animation: scroll-line 2s cubic-bezier(0.77, 0, 0.175, 1) infinite;
  }


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