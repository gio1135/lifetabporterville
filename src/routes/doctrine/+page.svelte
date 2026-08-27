<script lang='ts'>
  import { fontState } from '$lib/fontState.svelte.js';
</script>

<svelte:head>
  <title>What we believe | Life Tabernacle</title>
</svelte:head>

<div class='h-full w-full overflow-y-auto scroll-smooth {fontState.useDyslexicFont ? "font-dyslexic" : ""}'>
  <div class='mx-auto px-6 md:px-12 py-24 pb-32 transition-all duration-300 {fontState.useDyslexicFont ? "max-w-6xl" : "max-w-4xl"}'>
    <header class='flex flex-col items-start md:flex-row md:items-end justify-between border-b border-white/10 pb-8 mb-12 gap-4 md:gap-0'>
      <h1 class='text-4xl md:text-5xl font-light tracking-widest text-white'>What we believe</h1>

      <button
        onclick={() => fontState.toggle()}
        class='text-xs text-sand/50 hover:text-white transition-colors underline underline-offset-4 tracking-widest whitespace-nowrap'
        aria-pressed={fontState.useDyslexicFont}
      >
        {fontState.useDyslexicFont ? 'Disable' : 'Enable'} dyslexia font
      </button>
    </header>

    <article class='prose prose-lg prose-invert max-w-none text-left text-sand/80' style='line-height: 1.65; font-size: 1.125rem; letter-spacing: 0.01em;'>
      <section class='mb-12'>
        <h2 class='text-2xl font-light mb-4 text-white'>Headings</h2>
        <h1>Heading 1 (h1)</h1>
        <h2>Heading 2 (h2)</h2>
        <h3>Heading 3 (h3)</h3>
        <h4>Heading 4 (h4)</h4>
        <h5>Heading 5 (h5)</h5>
        <h6>Heading 6 (h6)</h6>
      </section>

      <section class='mb-12'>
        <h2 class='text-2xl font-light mb-4 text-white'>Paragraphs and inline styles</h2>
        <p class='mb-4'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dictum arcu eget ullamcorper porttitor. Curabitur eleifend lacinia diam a rutrum. Nunc sit amet lacus aliquam, ultrices libero quis, auctor neque. Nam nec leo vitae quam congue sagittis. Vestibulum a est arcu. Quisque faucibus, elit sit amet venenatis sagittis, odio dui consectetur sem, sed malesuada lectus tortor et ante. Maecenas scelerisque purus ac quam hendrerit, a congue ex vulputate. Quisque fermentum nec massa vitae egestas
        </p>
        <p class='mb-4'>
          <strong>Bold text</strong>, <em>italic text</em>, <code>monospace</code>, <a href='./' class='underline hover:text-white'>links</a>
        </p>
      </section>

      <section class='mb-12'>
        <h2 class='text-2xl font-light mb-4 text-white'>Blockquotes</h2>
        <blockquote class='border-l-2 border-white/20 pl-6 italic text-sand/60 my-8'>
          Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost.
        </blockquote>
      </section>

      <section class='mb-12'>
        <h2 class='text-2xl font-light mb-4 text-white'>Lists</h2>
        <div class='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h3 class='text-xl font-light mb-4 text-white'>Unordered list</h3>
            <ul class='list-disc list-inside space-y-2'>
              <li>Repentance</li>
              <li>Baptism in the name of Jesus Christ</li>
              <li>Receiving the Holy Ghost
                <ul class='list-disc list-inside ml-6 mt-2 space-y-2'>
                  <li>Speaking in tongues</li>
                  <li>Power to live above sin</li>
                </ul>
              </li>
              <li>Living a separated life</li>
            </ul>
          </div>
          <div>
            <h3 class='text-xl font-light mb-4 text-white'>Ordered list</h3>
            <ol class='list-decimal list-inside space-y-2'>
              <li>First step</li>
              <li>Second step</li>
              <li>Third step
                <ol class='list-decimal list-inside ml-6 mt-2 space-y-2'>
                  <li>Sub-step one</li>
                  <li>Sub-step two</li>
                </ol>
              </li>
              <li>Fourth step</li>
            </ol>
          </div>
        </div>
      </section>

      <section class='mb-12'>
        <h2 class='text-2xl font-light mb-4 text-white'>Tables</h2>
        <div class='overflow-x-auto'>
          <table class='w-full text-left border-collapse'>
            <thead>
              <tr class='border-b border-white/20'>
                <th class='py-3 px-4 font-normal text-white'>Doctrine</th>
                <th class='py-3 px-4 font-normal text-white'>Scripture</th>
                <th class='py-3 px-4 font-normal text-white'>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr class='border-b border-white/10'>
                <td class='py-3 px-4'>One God</td>
                <td class='py-3 px-4'>Deuteronomy 6:4</td>
                <td class='py-3 px-4'>He is not divided into three separate persons</td>
              </tr>
              <tr class='border-b border-white/10'>
                <td class='py-3 px-4'>Foundation</td>
                <td class='py-3 px-4'>Psalms 119:105</td>
                <td class='py-3 px-4'>The Bible lights our path</td>
              </tr>
              <tr class='border-b border-white/10'>
                <td class='py-3 px-4'>Salvation</td>
                <td class='py-3 px-4'>Acts 2:38</td>
                <td class='py-3 px-4'>Repentance, baptism, and recieving the Holy Ghost</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class='mb-12'>
        <h2 class='text-2xl font-light mb-4 text-white'>Images</h2>
        <figure class='my-8'>
          <div class='w-full h-64 bg-white/5 rounded flex items-center justify-center text-sand/30 border border-white/10'>
            Image placeholder
          </div>
          <figcaption class='text-sm text-center text-sand/50 mt-4'>
            Caption for the image
          </figcaption>
        </figure>
      </section>

      {#if fontState.useDyslexicFont}
        <p class='text-sm text-sand/50 mt-12 border-t border-white/10 pt-4'>
          Dyslexia-friendly font provided by <a href='https://opendyslexic.org/about' target='_blank' rel='noopener noreferrer' class='underline hover:text-white'>OpenDyslexic</a>
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

  @media (max-width: 767px) {
    :global(.font-dyslexic .prose) {
      font-size: 0.875rem !important;
    }
  }
</style>