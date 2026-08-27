<script lang="ts">
  import { enhance } from '$app/forms';
  import { SvelteDate } from 'svelte/reactivity';
  import type { PageData } from './$types';
  import type { Schedule } from '$lib/server/schedule';

  let { data }: { data: PageData } = $props();

  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  let isEditing = $state(false);
  let editSchedule = $state<Schedule>({ sundaySchool: true, items: [] });
  let saveFormElement: HTMLFormElement | undefined = $state();

  function getDateString(dayOfWeek: number): string {
    const d = new SvelteDate();
    d.setHours(0, 0, 0, 0);
    const today = d.getDay();
    const diffToMonday = d.getDate() - today + (today === 0 ? -6 : 1);
    const monday = new SvelteDate(d.setDate(diffToMonday));
    
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const targetDate = new SvelteDate(monday.setDate(monday.getDate() + offset));
    return `${targetDate.getMonth() + 1}/${targetDate.getDate()}`;
  }

  function toggleEdit() {
    if (!isEditing) {
      editSchedule = JSON.parse(JSON.stringify(data.schedule));
    }
    isEditing = !isEditing;
  }

  function addDay() {
    editSchedule.items.push({
      id: `custom-${Date.now()}`,
      dayOfWeek: 0,
      title: 'New service',
      time: '10:00 AM',
      crossedOut: false
    });
  }

  function removeDay(id: string) {
    editSchedule.items = editSchedule.items.filter((item) => item.id !== id);
  }

  function toggleCrossOut(id: string) {
    const item = editSchedule.items.find((i) => i.id === id);
    if (item) {
      item.crossedOut = !item.crossedOut;
    }
  }

  function doneEditing() {
    saveFormElement?.requestSubmit();
  }

  function getGroupedItems(items: Schedule['items']) {
    return items.reduce((acc, item) => {
      let group = acc.find(g => g.dayOfWeek === item.dayOfWeek);
      if (group) {
        group.items.push(item);
      } else {
        acc.push({
          id: `group-${item.dayOfWeek}`,
          dayOfWeek: item.dayOfWeek,
          items: [item]
        });
      }
      return acc;
    }, [] as { id: string; dayOfWeek: number; items: typeof items }[]);
  }
</script>

<svelte:head>
  <title>Schedule | Life Tabernacle</title>
</svelte:head>

<div class="h-full w-full overflow-y-auto scroll-smooth custom-scrollbar pt-24 md:pt-32">
  <div class="max-w-4xl w-full mx-auto px-6 md:px-12 pb-32 bg-dark/60 backdrop-blur border border-sand/10 p-8 md:p-12">
    <div class="flex justify-between items-center mb-10 border-b border-sand/20 pb-6">
      <h1 class="text-3xl md:text-5xl font-light tracking-widest">Service schedule</h1>
      
      {#if data.isLoggedIn}
        <div class="flex items-center gap-4">
          <button
            onclick={toggleEdit}
            class="px-4 py-2 text-sm tracking-widest border border-sand/30 hover:bg-white hover:text-black transition-colors"
          >
            {isEditing ? 'Cancel edit' : 'Edit schedule'}
          </button>
          <form method="POST" action="?/logout" use:enhance class="inline">
            <button
              type="submit"
              class="px-4 py-2 text-sm tracking-widest bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      {:else}
        <a href="/admin/login" class="text-xs tracking-widest text-sand/50 hover:text-white transition-colors">
          Admin
        </a>
      {/if}
    </div>

    {#if isEditing}
      <!-- Admin Edit Mode -->
      <div class="space-y-6">
        <div class="flex items-center gap-3 mb-6 p-4 border border-sand/20 bg-dark/40">
          <input
            type="checkbox"
            id="sundaySchool"
            bind:checked={editSchedule.sundaySchool}
            class="w-5 h-5 accent-sand"
          />
          <label for="sundaySchool" class="font-medium text-lg tracking-wider">Sunday school active</label>
        </div>

        {#each editSchedule.items as item (item.id)}
          <div class="border border-sand/20 bg-dark/40 p-4 relative group">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div class="col-span-1 md:col-span-3">
                <label for="dayOfWeek-{item.id}" class="block text-xs tracking-widest text-sand/70 mb-1">Day</label>
                <select
                  id="dayOfWeek-{item.id}"
                  bind:value={item.dayOfWeek}
                  class="w-full px-3 py-2 bg-dark border border-sand/30 text-white focus:outline-none focus:border-white transition-colors"
                >
                  {#each daysOfWeek as day (day)}
                    <option value={daysOfWeek.indexOf(day)}>{day}</option>
                  {/each}
                </select>
              </div>

              <div class="col-span-1 md:col-span-3">
                <label for="title-{item.id}" class="block text-xs tracking-widest text-sand/70 mb-1">Title</label>
                <input
                  id="title-{item.id}"
                  type="text"
                  bind:value={item.title}
                  class="w-full px-3 py-2 bg-dark border border-sand/30 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div class="col-span-1 md:col-span-4">
                <label for="desc-{item.id}" class="block text-xs tracking-widest text-sand/70 mb-1">Subtitle</label>
                <input
                  id="desc-{item.id}"
                  type="text"
                  bind:value={item.description}
                  placeholder="Optional details..."
                  class="w-full px-3 py-2 bg-dark border border-sand/30 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div class="col-span-1 md:col-span-2">
                <label for="time-{item.id}" class="block text-xs tracking-widest text-sand/70 mb-1">Time</label>
                <input
                  id="time-{item.id}"
                  type="text"
                  bind:value={item.time}
                  class="w-full px-3 py-2 bg-dark border border-sand/30 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div class="flex items-center gap-3 mt-4 justify-end">
              <button
                onclick={() => toggleCrossOut(item.id)}
                class="px-3 py-1 text-xs tracking-widest border border-sand/30 hover:bg-white hover:text-black transition-colors {item.crossedOut ? 'bg-white text-black' : ''}"
              >
                {item.crossedOut ? 'Uncross' : 'Cross out'}
              </button>
              <button
                onclick={() => removeDay(item.id)}
                class="px-3 py-1 text-xs tracking-widest bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors border border-red-500/20"
              >
                Remove
              </button>
            </div>
          </div>
        {/each}

        <div class="flex justify-center pt-4 border-t border-sand/20">
          <button
            onclick={addDay}
            class="px-6 py-3 border border-sand hover:bg-sand hover:text-dark tracking-widest transition-colors"
          >
            + Add Service
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
              class="hidden"
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
              class="px-6 py-3 bg-red-900/30 border border-red-500/30 text-red-400 hover:bg-red-900/50 tracking-widest transition-colors"
            >
              Reset to default
            </button>
          </form>

          <button
            onclick={doneEditing}
            class="px-6 py-3 bg-white text-dark tracking-widest font-medium hover:bg-sand transition-colors"
          >
            Done editing
          </button>
        </div>
      </div>
    {:else}
      <!-- Public View Mode -->
      <ul class="divide-y divide-sand/10">
        {#each getGroupedItems(data.schedule.items) as group (group.id)}
          <li class="py-6 flex flex-col md:flex-row items-start md:items-stretch group gap-6 md:gap-8">
            <!-- Day and Date Column -->
            <div class="flex flex-row md:flex-col items-baseline md:items-start shrink-0 w-full md:w-60 md:border-r border-sand/20 md:pr-6 justify-start md:justify-center gap-3 md:gap-0">
              <span class="text-2xl md:text-3xl font-light tracking-widest text-white">{daysOfWeek[group.dayOfWeek]}</span>
              <span class="text-sand/70 text-sm tracking-widest md:mt-1">{getDateString(group.dayOfWeek)}</span>
            </div>

            <!-- Content Column -->
            <div class="flex-1 w-full flex flex-col gap-8 justify-center">
              {#each group.items as item (item.id)}
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                  <div class="flex flex-col w-full">
                    <!-- Title & Mobile Time Row -->
                    <div class="flex flex-row justify-between items-baseline md:items-center w-full">
                      <h3
                        class="text-xl md:text-2xl font-light tracking-wide flex flex-wrap items-center gap-4 {item.crossedOut
                          ? 'line-through opacity-40'
                          : ''}"
                      >
                        {item.title}

                      {#if item.dayOfWeek === 0 && item.title.toLowerCase().includes('morning')}
                        {#if data.schedule.sundaySchool}
                          <span
                            class="text-xs tracking-widest px-2 py-1 border border-sand/40 text-sand"
                          >
                            Sunday school
                          </span>
                        {:else}
                          <span
                            class="text-xs tracking-widest px-2 py-1 border border-red-500/30 bg-red-900/20 text-red-400"
                          >
                            No sunday school
                          </span>
                        {/if}
                      {/if}
                      </h3>
                      
                      <!-- Mobile Time -->
                      <div
                        class="md:hidden text-lg font-light tracking-wider shrink-0 ml-4 {item.crossedOut
                          ? 'line-through opacity-40'
                          : ''}"
                      >
                        {item.time}
                      </div>
                    </div>

                    {#if item.description}
                      <p
                        class="text-sand/60 mt-2 {item.crossedOut
                          ? 'line-through opacity-40'
                          : ''}"
                      >
                        {item.description}
                      </p>
                    {/if}
                  </div>

                  <!-- Desktop Time -->
                  <div
                    class="hidden md:block text-2xl font-light tracking-wider shrink-0 md:ml-6 {item.crossedOut
                      ? 'line-through opacity-40'
                      : ''}"
                  >
                    {item.time}
                  </div>
                </div>
              {/each}
            </div>
          </li>
        {/each}
      </ul>
    {/if}

    <div class="pt-10 mt-6 text-center">
      <p class="text-sand/50 tracking-wide text-sm">
        Services have prayer 30 minutes before. Prayer nights are 30 minutes of prayer with no service
      </p>
    </div>
  </div>
</div>