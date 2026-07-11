<script lang="ts">
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
  <title>Admin login</title>
</svelte:head>

<div class="max-w-md mx-auto mt-20 px-4 animate-fade-in relative">
  <div class="mb-4">
    <a
      href="/"
      class="inline-flex items-center text-sm font-medium text-slate-500 hover:text-purple-600 dark:hover:text-amber-400 transition-colors"
    >
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        ></path></svg
      >
      Back
    </a>
  </div>
  <div
    class="border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-black/20 p-8 rounded-lg shadow-sm"
  >
    <h2 class="text-2xl font-medium mb-6 text-center">Admin access</h2>

    {#if form?.missing}
      <div
        class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded mb-6 text-sm"
      >
        Username and password are required
      </div>
    {/if}

    {#if form?.incorrect}
      <div
        class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded mb-6 text-sm"
      >
        Invalid credentials
      </div>
    {/if}

    <form method="POST" class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium mb-1">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          class="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-[#1a0b2e] focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          class="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-[#1a0b2e] focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div class="pt-2">
        <button
          type="submit"
          class="w-full py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium rounded-md hover:bg-purple-700 dark:hover:bg-gold-400 transition-colors"
        >
          Log in
        </button>
      </div>
    </form>
  </div>
</div>