<script lang="ts">
  let useDyslexicFont = $state(false);

  function toggleFont() {
    useDyslexicFont = !useDyslexicFont;
  }
</script>

<svelte:head>
  <title>What We Believe | Life Tabernacle</title>
</svelte:head>

<!-- We apply the font class to the container dynamically -->
<div class="h-full w-full overflow-y-auto scroll-smooth bg-[#faf8f5] text-dark transition-colors duration-500 {useDyslexicFont ? 'font-dyslexic' : 'font-sans'}">
  <div class="max-w-[65ch] mx-auto px-6 py-12 md:py-24">
    
    <header class="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
      <div>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#0a0a0a]">What We Believe</h1>
        <p class="text-lg text-[#4a4a4a] leading-relaxed">Our core foundations, faith, and practice.</p>
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
        <h2 class="text-2xl font-semibold mb-4 text-[#0a0a0a]">The Bible</h2>
        <p class="mb-4">
          We believe the Bible is the inspired, infallible Word of God and the absolute authority in matters of faith and practice. We believe it is the only guide to a faithful and righteous life, providing us with the wisdom necessary for salvation.
        </p>
      </section>

      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4 text-[#0a0a0a]">God</h2>
        <p class="mb-4">
          We believe in one God, who has revealed Himself as our Father in His Son, Jesus Christ, and as the Holy Spirit. Jesus Christ is God manifested in flesh. He is both God and man.
        </p>
      </section>

      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4 text-[#0a0a0a]">Sin and Salvation</h2>
        <p class="mb-4">
          Everyone has sinned and needs salvation. Salvation comes by grace through faith based on the atoning sacrifice of Jesus Christ. Our basic and fundamental doctrine shall be the Bible standard of full salvation, which is repentance, baptism in water by immersion in the name of the Lord Jesus Christ for the remission of sins, and the baptism of the Holy Ghost with the initial sign of speaking with other tongues as the Spirit gives utterance.
        </p>
      </section>

      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4 text-[#0a0a0a]">Christian Living</h2>
        <p class="mb-4">
          As Christians we are to love God and others. We should live a holy life inwardly and outwardly, and worship God joyfully. The supernatural gifts of the Spirit, including healing, are for the church today.
        </p>
      </section>

      {#if useDyslexicFont}
        <p class="text-sm text-gray-500 mt-12 border-t pt-4">
          Dyslexia-friendly font provided by <a href="https://opendyslexic.org/" target="_blank" rel="noopener noreferrer" class="underline hover:text-gray-800">OpenDyslexic</a>.
        </p>
      {/if}
    </article>

  </div>
</div>

<style>
  /* Import OpenDyslexic for the dyslexic-friendly toggle */
  @font-face {
    font-family: 'OpenDyslexic';
    src: url('/fonts/OpenDyslexic-Regular.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }

  .font-dyslexic {
    font-family: 'OpenDyslexic', 'Comic Sans MS', sans-serif !important;
    /* Adjustments specific to OpenDyslexic which tends to run large and wide */
    letter-spacing: 0.05em;
    word-spacing: 0.1em;
  }
</style>
