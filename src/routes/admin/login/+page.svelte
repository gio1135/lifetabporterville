<script lang="ts">
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
  <title>Admin login</title>
</svelte:head>

<div class="max-w-md mx-auto mt-20 px-4 h-full overflow-y-auto">
  <div class="mb-4">
    <a
      href="/schedule"
      class="inline-flex items-center text-sm font-medium text-sand/80 hover:text-white transition-colors"
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
  <div class="border border-sand/20 bg-dark/50 p-8 rounded-lg shadow-sm">
    <h2 class="text-2xl font-light tracking-widest text-white uppercase mb-6 text-center">Admin access</h2>

    {#if form?.missing}
      <div class="bg-red-900/20 text-red-400 p-3 rounded mb-6 text-sm border border-red-500/20">
        Username and password are required
      </div>
    {/if}

    {#if form?.incorrect}
      <div class="bg-red-900/20 text-red-400 p-3 rounded mb-6 text-sm border border-red-500/20">
        Invalid credentials
      </div>
    {/if}

    <form method="POST" class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium mb-1 text-sand">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          class="w-full px-3 py-2 rounded-md border border-sand/20 bg-dark/80 text-white focus:outline-none focus:border-white transition-colors"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium mb-1 text-sand">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          class="w-full px-3 py-2 rounded-md border border-sand/20 bg-dark/80 text-white focus:outline-none focus:border-white transition-colors"
        />
      </div>

      <div class="pt-4">
        <button
          type="submit"
          class="w-full py-3 bg-white text-dark uppercase tracking-widest text-sm font-medium rounded-md hover:bg-sand transition-colors"
        >
          Log in
        </button>
      </div>
    </form>
  </div>
</div>
