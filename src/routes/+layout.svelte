<script lang="ts">
  import { page } from '$app/stores';
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import PageTransition from '$lib/components/PageTransition.svelte';

  let { children } = $props();
  let isMenuOpen = $state(false);

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  $effect(() => {
    // Close menu when path changes
    if ($page.url.pathname) {
      isMenuOpen = false;
    }
  });
</script>

<PageTransition />

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="h-dvh flex flex-col w-full relative">
  {#if $page.url.pathname !== '/'}
    <nav class="flex items-center justify-between px-6 md:px-16 py-6 bg-dark/80 backdrop-blur border-b border-sand/10 z-50 shrink-0">
      <a href="/" class="text-xl font-light tracking-widest text-white relative z-60">Life Tabernacle</a>
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
  {/if}

  {#if isMenuOpen}
    <div class="fixed inset-0 bg-[#0f0f0f] z-40 flex flex-col items-center justify-center space-y-10 md:hidden">
      <a href="/" class="text-3xl font-light text-white tracking-widest">Home</a>
      <a href="/schedule" class="text-3xl font-light text-white tracking-widest">Schedule</a>
      <a href="/history" class="text-3xl font-light text-white tracking-widest">History</a>
      <a href="/doctrine" class="text-3xl font-light text-white tracking-widest">What we believe</a>
    </div>
  {/if}

  <main class="flex-1 w-full relative overflow-hidden">
    {@render children()}
  </main>
</div>