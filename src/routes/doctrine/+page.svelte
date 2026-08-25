<script lang="ts">
  let useDyslexicFont = false;

  function toggleFont() {
    useDyslexicFont = !useDyslexicFont;
  }
</script>

<svelte:head>
  <title>Typography Showcase | Life Tabernacle</title>
</svelte:head>

<div class="h-full w-full overflow-y-auto scroll-smooth {useDyslexicFont ? 'font-dyslexic' : ''}">
  <div class="max-w-4xl mx-auto px-6 md:px-12 py-24 pb-32">
    <header class="flex flex-col md:flex-row md:items-end justify-between border-b pb-8 mb-12 gap-6">
      <div>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#0a0a0a]">Typography Showcase</h1>
        <p class="text-lg text-[#4a4a4a] leading-relaxed">A reference for typography styles.</p>
      </div>

      <button
        onclick={toggleFont}
        class="shrink-0 flex items-center gap-3 px-5 py-3 rounded-full border-2 border-dark hover:bg-dark hover:text-[#faf8f5] transition-colors font-medium text-sm"
        aria-pressed={useDyslexicFont}
      >
        <span>Dyslexia-friendly font</span>
        <div class="w-10 h-6 bg-gray-200 rounded-full relative transition-colors {useDyslexicFont ? 'bg-dark' : ''}">
          <div class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform {useDyslexicFont ? 'translate-x-4' : ''}"></div>
        </div>
      </button>
    </header>

    <article class="prose prose-lg prose-slate max-w-none text-left" style="line-height: 1.65; font-size: 1.125rem; letter-spacing: 0.01em;">
      <section class="mb-12">
        <h1 class="text-3xl md:text-4xl font-bold mb-6 text-[#0a0a0a]">Header 1 (h1)</h1>
        <h2 class="text-2xl md:text-3xl font-semibold mb-4 text-[#0a0a0a]">Header 2 (h2)</h2>
        <h3 class="text-xl md:text-2xl font-medium mb-3 text-[#0a0a0a]">Header 3 (h3)</h3>
        <h4 class="text-lg md:text-xl font-medium mb-2 text-[#0a0a0a]">Header 4 (h4)</h4>
      </section>

      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4 text-[#0a0a0a]">Paragraphs</h2>
        <p class="mb-4">
          This is a standard paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p class="mb-4">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </section>

      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4 text-[#0a0a0a]">Lists</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-xl font-medium mb-3">Unordered List</h3>
            <ul class="list-disc pl-6 space-y-2">
              <li>First item in the list</li>
              <li>Second item with some longer text that might wrap to the next line depending on the screen size.</li>
              <li>Third item
                <ul class="list-circle pl-6 mt-2 space-y-2 text-[#4a4a4a]">
                  <li>Nested item A</li>
                  <li>Nested item B</li>
                </ul>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-medium mb-3">Ordered List</h3>
            <ol class="list-decimal pl-6 space-y-2">
              <li>Step one is very important</li>
              <li>Step two follows step one</li>
              <li>Step three concludes the process</li>
            </ol>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4 text-[#0a0a0a]">Table</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse border border-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-900">Name</th>
                <th class="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-900">Role</th>
                <th class="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-900">Email</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr>
                <td class="border border-gray-200 px-4 py-2 text-sm text-gray-700">Jane Doe</td>
                <td class="border border-gray-200 px-4 py-2 text-sm text-gray-700">Designer</td>
                <td class="border border-gray-200 px-4 py-2 text-sm text-gray-700">jane@example.com</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="border border-gray-200 px-4 py-2 text-sm text-gray-700">John Smith</td>
                <td class="border border-gray-200 px-4 py-2 text-sm text-gray-700">Developer</td>
                <td class="border border-gray-200 px-4 py-2 text-sm text-gray-700">john@example.com</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {#if useDyslexicFont}
        <p class="text-sm text-gray-500 mt-12 border-t pt-4">
          Dyslexia-friendly font provided by <a href="https://opendyslexic.org/" target="_blank" rel="noopener noreferrer" class="underline hover:text-gray-800">OpenDyslexic</a>
        </p>
      {/if}
    </article>
  </div>
</div>

<style>
  @font-face {
    font-family: 'OpenDyslexic';
    src: url('/fonts/OpenDyslexic-Regular.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  
  :global(.font-dyslexic) {
    font-family: 'OpenDyslexic', sans-serif !important;
    letter-spacing: 0.05em;
    word-spacing: 0.1em;
  }
</style>