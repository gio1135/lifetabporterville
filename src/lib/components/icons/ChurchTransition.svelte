<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';

  let containerEl: HTMLDivElement;
  let lottiePlayer: HTMLElement & { play: () => void; pause: () => void; seek: (frame: number | string) => void };

  export const play = async () => {
    // 1. Fade in first
    const tlIn = gsap.timeline();
    tlIn.fromTo(containerEl, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" });
    await tlIn;

    // 2. Start the door opening animation
    if (lottiePlayer && typeof lottiePlayer.play === 'function') {
      lottiePlayer.seek(0);
      lottiePlayer.play();
    }

    // 3. Wait for the doors to fully open (~650ms)
    await new Promise(r => setTimeout(r, 650));

    // 4. Zoom massively through the doors
    const tlOut = gsap.timeline();
    tlOut.to(containerEl, {
      scale: 1000,
      duration: 0.9,
      ease: "power4.inOut"
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
    src="/home.json" 
    background="transparent" 
    speed="1" 
    style="width: 80px; height: 80px;">
  </lottie-player>
</div>