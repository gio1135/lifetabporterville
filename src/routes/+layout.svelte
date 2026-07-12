<script lang="ts">
  import './layout.css';
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms';
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();
  let isDarkMode = $state(true);

  onMount(() => {
    if (data.isLoggedIn) {
      if (localStorage.getItem('theme') === 'light') {
        isDarkMode = false;
      } else {
        isDarkMode = true;
      }
    } else {
      isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        isDarkMode = e.matches;
        updateTheme();
      });
    }
    updateTheme();
  });

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (data.isLoggedIn) {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
    updateTheme();
  }

  function updateTheme() {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
</script>

<div class="flex flex-col min-h-screen">
  <main class="container mx-auto p-4 md:p-8 flex-1">
    {@render children()}
  </main>

  <footer
    class="mt-12 py-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400"
  >
    <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
      <span>Phone: (559) 781-8068</span>
      <span class="hidden md:inline">•</span>
      <span>Fax: (559) 123-4567</span>
    </div>
  </footer>

  <div class="p-4 flex items-center justify-center gap-4">
    {#if data.isLoggedIn}
      <form method="POST" action="/?/logout" class="inline" use:enhance>
        <button
          type="submit"
          class="text-sm text-slate-500 hover:text-purple-600 dark:hover:text-amber-400 transition-colors"
        >
          Logout
        </button>
      </form>
    {:else}
      <a
        href="/admin/login"
        class="text-sm text-slate-500 hover:text-purple-600 dark:hover:text-amber-400 transition-colors"
        >Login</a
      >
    {/if}
    {#if data.isLoggedIn}
      <button
        onclick={toggleTheme}
        class="p-2 rounded-md hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
        aria-label="Toggle theme"
      >
        {#if isDarkMode}
          <svg
            class="w-4 h-4 text-slate-400 hover:text-amber-400 transition-colors"
            fill="currentColor"
            viewBox="0 0 20 20"
            ><path
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            /></svg
          >
        {:else}
          <svg
            class="w-4 h-4 text-slate-600 hover:text-purple-600 transition-colors"
            fill="currentColor"
            viewBox="0 0 20 20"
            ><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg
          >
        {/if}
      </button>
    {/if}
  </div>
</div>