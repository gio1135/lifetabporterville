<script lang="ts">
  const colors = [
    {
      category: 'Primary brand (light)',
      items: [
        {
          name: 'Dark Purple',
          hex: '#150529',
          tailwind: 'custom',
          description: 'Dark mode background'
        },
        {
          name: 'Purple 600',
          hex: '#9333ea',
          tailwind: 'purple-600',
          description: 'Primary interactive color'
        },
        {
          name: 'Purple 700',
          hex: '#7e22ce',
          tailwind: 'purple-700',
          description: 'Hover states'
        },
        {
          name: 'Purple 100',
          hex: '#f3e8ff',
          tailwind: 'purple-100',
          description: 'Soft accents / badges'
        }
      ]
    },
    {
      category: 'Primary brand (dark)',
      items: [
        {
          name: 'Amber 400',
          hex: '#fbbf24',
          tailwind: 'amber-400',
          description: 'Primary interactive color'
        },
        {
          name: 'Amber 500',
          hex: '#f59e0b',
          tailwind: 'amber-500',
          description: 'Hover states / badges'
        },
        {
          name: 'White',
          hex: '#ffffff',
          tailwind: 'white',
          description: 'Light mode background / text'
        }
      ]
    },
    {
      category: 'Background patterns',
      items: [
        {
          name: 'Light dots',
          hex: 'rgba(147, 51, 234, 0.04)',
          tailwind: 'purple-600 / 4%',
          description: 'Subtle pattern on white bg'
        },
        {
          name: 'Dark dots',
          hex: 'rgba(168, 85, 247, 0.06)',
          tailwind: 'purple-500 / 6%',
          description: 'Subtle pattern on dark bg'
        }
      ]
    }
  ];
</script>

<svelte:head>
  <title>Brand kit</title>
</svelte:head>

<div class="max-w-4xl mx-auto py-12 px-4 animate-fade-in relative z-10">
  <div class="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
    <h1 class="text-4xl font-semibold mb-4">Brand kit</h1>
  </div>

  <section class="mb-12">
    <h2 class="text-2xl font-medium mb-6">Color palette</h2>

    {#each colors as group (group.category)}
      <h3 class="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4 mt-8">
        {group.category}
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {#each group.items as color (color.name)}
          <div
            class="bg-white dark:bg-[#1a0b2e] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm"
          >
            <div
              class="h-24 w-full border-b border-slate-100 dark:border-slate-800 flex items-center justify-center relative overflow-hidden"
              style="background-color: {color.hex.startsWith('rgba') ? 'transparent' : color.hex};"
            >
              {#if color.hex.startsWith('rgba')}
                <div class="absolute inset-0 {color.name === 'Dark Dots' ? 'dark' : ''}">
                  <div class="absolute inset-0 bg-dots-pattern"></div>
                </div>
              {/if}
            </div>
            <div class="p-4">
              <div class="font-medium text-slate-900 dark:text-slate-100">{color.name}</div>
              <div class="text-sm font-mono text-slate-500 dark:text-slate-400 mt-1">
                {color.hex}
              </div>
              <div class="text-xs text-slate-400 dark:text-slate-500 mt-2">{color.description}</div>
            </div>
          </div>
        {/each}
      </div>
    {/each}
  </section>

  <section class="mb-12">
    <h2 class="text-2xl font-medium mb-6">Typography</h2>
    <div
      class="bg-white dark:bg-[#1a0b2e] border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8"
    >
      <div class="font-sans">
        <div class="text-xl">Inter, system-ui, -apple-system, sans-serif</div>
        <p class="mt-4 text-slate-600 dark:text-slate-400">
          Always use system native fonts prioritizing Inter if available, San Francisco on Apple
          devices, and Segoe UI on windows
        </p>
      </div>
    </div>
  </section>
</div>