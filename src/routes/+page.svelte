<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import { fade, slide } from 'svelte/transition';
  import { enhance } from '$app/forms';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let showToast = $state(false);
  let toastMessage = $state('');

  let isEditing = $state(false);
  let editSchedule = $state(JSON.parse(JSON.stringify(data.schedule)));

  let saveFormElement: HTMLFormElement | undefined = $state();

  // When form submission returns success
  $effect(() => {
    if (form?.success) {
      if (form.action === 'save' || form.action === 'reset') {
        toastMessage = form.action === 'save' ? 'Saved' : 'Reset';
        showToast = true;
        setTimeout(() => {
          showToast = false;
        }, 3000);
      }
    }
  });

  function copyAddress() {
    navigator.clipboard.writeText('939 N Main St, Porterville, CA, 93257');
    toastMessage = 'Copied';
    showToast = true;
    setTimeout(() => {
      showToast = false;
    }, 3000);
  }

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function enterEditMode() {
    editSchedule = JSON.parse(JSON.stringify(data.schedule));
    isEditing = true;
  }

  function addDay() {
    editSchedule.items.push({
      id: crypto.randomUUID(),
      dayOfWeek: 0,
      title: 'New event',
      description: '',
      time: '12:00 PM',
      crossedOut: false
    });
    sortItems();
  }

  function removeDay(id: string) {
    editSchedule.items = editSchedule.items.filter((i: any) => i.id !== id);
  }

  function toggleCrossOut(item: any) {
    item.crossedOut = !item.crossedOut;
  }

  function sortItems() {
    editSchedule.items.sort((a: any, b: any) => a.dayOfWeek - b.dayOfWeek);
  }

  function handleDayChange(item: any, e: Event) {
    item.dayOfWeek = parseInt((e.target as HTMLSelectElement).value, 10);
    sortItems();
  }

  function doneEditing() {
    if (saveFormElement) {
      saveFormElement.requestSubmit();
    }
    isEditing = false;
  }
</script>

<svelte:head>
  <title>Life Tabernacle</title>
</svelte:head>

{#if showToast}
  <div
    transition:fade
    class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg font-medium z-50"
  >
    {toastMessage}
  </div>
{/if}

<div class="flex flex-col items-center justify-center py-12 text-center space-y-8 animate-fade-in">
  <div class="p-8 md:p-12 max-w-4xl w-full">
    <h1 class="text-4xl md:text-6xl font-medium mb-6">Life Tabernacle</h1>

    <div
      class="flex flex-col md:flex-row items-center justify-center gap-6 mt-12 text-lg text-slate-600 dark:text-slate-400"
    >
      <div class="flex items-center space-x-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          ></path><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          ></path></svg
        >
        <div class="flex items-center gap-2">
          <a
            href="https://maps.google.com/?q=939+N+Main+St,+Porterville,+CA,+93257"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:underline"
          >
            939 N Main St, Porterville, CA, 93257
          </a>
          <button
            onclick={copyAddress}
            class="p-1 text-slate-400 hover:text-purple-600 dark:hover:text-amber-400 transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Copy address"
            title="Copy address"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              ></path></svg
            >
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="max-w-3xl mx-auto py-8 px-4 animate-fade-in relative">
  <div
    class="mb-10 border-b border-slate-200 dark:border-slate-800 pb-4 text-center flex flex-col items-center"
  >
    <div class="flex items-center gap-4 justify-center">
      <h2 class="text-3xl font-medium mb-2">Schedule</h2>
      {#if data.isLoggedIn && !isEditing}
        <button
          onclick={enterEditMode}
          class="mb-2 p-2 text-slate-500 hover:text-purple-600 dark:hover:text-amber-400 transition-colors"
          aria-label="Edit schedule"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path></svg
          >
        </button>
      {/if}
    </div>
    {#if data.isOverride && !isEditing}
      <p class="text-sm font-medium text-amber-600 dark:text-amber-400 inline-block mt-2">
        Special schedule in effect this week
      </p>
    {/if}
  </div>

  <div class="overflow-hidden">
    {#if isEditing}
      <!-- Admin Edit Mode -->
      <div class="space-y-6">
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400 text-center mb-6">
          The schedule automatically resets to default every week
        </p>
        {#each editSchedule.items as item (item.id)}
          <div
            transition:slide
            class="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-white/50 dark:bg-black/20 flex flex-col md:flex-row gap-4 items-start md:items-center"
          >
            <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div>
                <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1"
                  >Day</label
                >
                <select
                  value={item.dayOfWeek}
                  onchange={(e) => handleDayChange(item, e)}
                  class="w-full px-2 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a0b2e]"
                >
                  {#each daysOfWeek as day, i}
                    <option value={i}>{day}</option>
                  {/each}
                </select>
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1"
                  >Time</label
                >
                <input
                  type="text"
                  bind:value={item.time}
                  class="w-full px-2 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a0b2e]"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1"
                  >Title</label
                >
                <input
                  type="text"
                  bind:value={item.title}
                  class="w-full px-2 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a0b2e]"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1"
                  >Description (optional)</label
                >
                <input
                  type="text"
                  bind:value={item.description}
                  class="w-full px-2 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a0b2e]"
                />
              </div>

              {#if item.dayOfWeek === 0 && item.title.toLowerCase().includes('morning')}
                <div class="sm:col-span-2 mt-2">
                  <button
                    onclick={() => (editSchedule.sundaySchool = !editSchedule.sundaySchool)}
                    class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border
                      {editSchedule.sundaySchool
                      ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30 hover:bg-purple-200 dark:hover:bg-amber-500/30'
                      : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50'}"
                  >
                    {editSchedule.sundaySchool ? 'Sunday school' : 'No sunday school'}
                  </button>
                </div>
              {/if}
            </div>

            <div class="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto justify-end">
              <button
                onclick={() => toggleCrossOut(item)}
                class="p-2 text-sm font-medium rounded {item.crossedOut
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'} hover:opacity-80 transition-opacity"
              >
                {item.crossedOut ? 'Uncross' : 'Cross out'}
              </button>
              <button
                onclick={() => removeDay(item.id)}
                class="p-2 text-sm font-medium rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:opacity-80 transition-opacity"
              >
                Remove
              </button>
            </div>
          </div>
        {/each}

        <div class="flex justify-center pt-4">
          <button
            onclick={addDay}
            class="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            + Add day
          </button>
        </div>

        <div class="flex justify-center gap-4 pt-4 mt-4">
          <form
            method="POST"
            action="?/save"
            class="inline"
            use:enhance
            bind:this={saveFormElement}
          >
            <input type="hidden" name="payload" value={JSON.stringify(editSchedule)} />
            <button
              type="submit"
              class="px-6 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded font-medium hover:bg-purple-700 dark:hover:bg-gold-400 transition-colors hidden"
            >
              Save
            </button>
          </form>

          <form
            method="POST"
            action="?/reset"
            class="inline"
            use:enhance={() => {
              isEditing = false;
            }}
          >
            <button
              type="submit"
              class="px-6 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              Reset
            </button>
          </form>

          <button
            onclick={doneEditing}
            class="px-6 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded font-medium hover:bg-purple-700 dark:hover:bg-gold-400 transition-colors"
          >
            Done editing
          </button>
        </div>
      </div>
    {:else}
      <!-- Public View Mode -->
      <ul class="divide-y divide-slate-100 dark:divide-slate-800/50">
        {#each data.schedule.items as item}
          <li class="py-5 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h3
                class="text-lg font-medium flex flex-wrap items-center gap-3 {item.crossedOut
                  ? 'line-through opacity-50'
                  : ''}"
              >
                {daysOfWeek[item.dayOfWeek]} - {item.title}

                {#if item.dayOfWeek === 0 && item.title.toLowerCase().includes('morning')}
                  {#if data.schedule.sundaySchool}
                    <span
                      class="text-xs font-medium px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-amber-500/20 dark:text-amber-400"
                    >
                      Sunday school
                    </span>
                  {:else}
                    <span
                      class="text-xs font-medium px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    >
                      No sunday school
                    </span>
                  {/if}
                {/if}
              </h3>
              {#if item.description}
                <p
                  class="text-sm text-slate-500 dark:text-slate-400 mt-0.5 {item.crossedOut
                    ? 'line-through opacity-50'
                    : ''}"
                >
                  {item.description}
                </p>
              {/if}
            </div>

            <div
              class="text-lg font-medium text-slate-600 dark:text-slate-400 mt-2 md:mt-0 {item.crossedOut
                ? 'line-through opacity-50'
                : ''}"
            >
              {item.time}
            </div>
          </li>
        {/each}
      </ul>
    {/if}

    <div class="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800 text-center">
      <p class="text-slate-500 dark:text-slate-400 italic text-sm">
        Services have prayer 30 minutes before. Prayer nights are 30 minutes of prayer with no
        service
      </p>
    </div>
  </div>
</div>