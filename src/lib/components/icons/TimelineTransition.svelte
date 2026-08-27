<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';

  let containerEl: HTMLDivElement;
  let lottiePlayer: HTMLElement & { play: () => void; pause: () => void; seek: (frame: number | string) => void };

  export const play = async () => {
    // 1. Fade in first
    const tlIn = gsap.timeline();
    tlIn.fromTo(containerEl, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" });
    // 2. Start the lottie animation immediately
    if (lottiePlayer && typeof lottiePlayer.play === 'function') {
      lottiePlayer.seek(0);
      lottiePlayer.play();
    }

    await tlIn;

    // 3. Allow the Lottie animation to play
    await new Promise(r => setTimeout(r, 1200));

    // 4. Zoom and fade out to exit
    const tlOut = gsap.timeline();
    tlOut.to(containerEl, {
      scale: 1.5,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in"
    });

    await tlOut;
  };

  onMount(() => {
    gsap.set(containerEl, { scale: 0.8, opacity: 0 });
  });
</script>

<svelte:head>
  <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
</svelte:head>

<div bind:this={containerEl} class="flex justify-center items-center pointer-events-none">
  <lottie-player 
    bind:this={lottiePlayer}
    src="/history.json" 
    background="transparent" 
    speed="1" 
    style="width: 80px; height: 80px;" 
    loop>
  </lottie-player>
</div>
