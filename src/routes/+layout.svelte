<script lang="ts">
  import { page } from '$app/stores';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="h-dvh flex flex-col w-full">
  {#if $page.url.pathname !== '/'}
    <nav class="flex items-center justify-between px-6 md:px-16 py-6 bg-dark/80 backdrop-blur border-b border-sand/10 z-50 shrink-0">
      <a href="/" class="text-xl font-light tracking-widest text-white uppercase">Life tabernacle</a>
      <div class="hidden md:flex gap-8">
        <a href="/schedule" class="text-sand/80 hover:text-white uppercase tracking-widest text-sm transition-colors duration-300">Schedule</a>
        <a href="/history" class="text-sand/80 hover:text-white uppercase tracking-widest text-sm transition-colors duration-300">History</a>
        <a href="/what-we-believe" class="text-sand/80 hover:text-white uppercase tracking-widest text-sm transition-colors duration-300">What we believe</a>
      </div>
    </nav>
  {/if}

  <main class="flex-1 w-full relative overflow-hidden">
    {@render children()}
  </main>
</div>
