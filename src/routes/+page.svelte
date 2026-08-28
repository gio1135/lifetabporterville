<script lang="ts">
	import { onMount, tick, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import heroImg from '$lib/images/hero.jpeg?enhanced';
	import { accessibility } from '$lib/stores/accessibility.svelte';

	const f1 = import.meta.glob('$lib/images/features/IMG_8737.jpeg', {
		query: { enhanced: true },
		eager: true,
		import: 'default'
	});
	const f1_2 = import.meta.glob('$lib/images/features/IMG_8741.jpeg', {
		query: { enhanced: true },
		eager: true,
		import: 'default'
	});
	const f1_3 = import.meta.glob('$lib/images/features/IMG_8743.jpeg', {
		query: { enhanced: true },
		eager: true,
		import: 'default'
	});
	const f1_4 = import.meta.glob('$lib/images/features/IMG_8744.jpeg', {
		query: { enhanced: true },
		eager: true,
		import: 'default'
	});
	const feature1Pool = [
		Object.values(f1)[0],
		Object.values(f1_2)[0],
		Object.values(f1_3)[0],
		Object.values(f1_4)[0]
	] as string[];

	const f2 = import.meta.glob('$lib/images/features/IMG_8748.jpeg', {
		query: { enhanced: true },
		eager: true,
		import: 'default'
	});
	const f2_2 = import.meta.glob('$lib/images/features/IMG_8806.jpeg', {
		query: { enhanced: true },
		eager: true,
		import: 'default'
	});
	const feature2Pool = [Object.values(f2)[0], Object.values(f2_2)[0]] as string[];

	const f3 = import.meta.glob('$lib/images/features/IMG_8761.jpeg', {
		query: { enhanced: true },
		eager: true,
		import: 'default'
	});
	const f3_2 = import.meta.glob('$lib/images/features/IMG_8762.jpeg', {
		query: { enhanced: true },
		eager: true,
		import: 'default'
	});
	const feature3Pool = [Object.values(f3)[0], Object.values(f3_2)[0]] as string[];

	if (browser) {
		gsap.registerPlugin(ScrollTrigger);
	}

	let mainContainer: HTMLElement;
	let featuresContainer: HTMLElement;
	let featurePanels: HTMLElement[] = [];
	let opportunityText: HTMLElement;
	let trigger2: HTMLElement;
	let trigger3: HTMLElement;

	let lastHeight = 0;
	let lastMaxScroll = 0;

	function handleResize() {
		if (!mainContainer || !browser) return;

		setTimeout(() => {
			const currentHeight = window.innerHeight;
			const currentMaxScroll = mainContainer.scrollHeight - mainContainer.clientHeight;

			if (lastHeight === 0) {
				lastHeight = currentHeight;
				lastMaxScroll = currentMaxScroll;
				return;
			}

			if (currentHeight !== lastHeight) {
				if (lastMaxScroll > 0 && currentMaxScroll > 0) {
					const scrollProportion = mainContainer.scrollTop / lastMaxScroll;
					mainContainer.scrollTop = scrollProportion * currentMaxScroll;
					ScrollTrigger.refresh();
				}
				lastHeight = currentHeight;
				lastMaxScroll = currentMaxScroll;
			}
		}, 50);
	}

	let currentFeature1 = $state<string | null>(null);
	let currentFeature2 = $state<string | null>(null);
	let currentFeature3 = $state<string | null>(null);

	let isMenuOpen = $state(false);
	let addressCopied = $state(false);
	let phoneCopied = $state(false);

	function copyAddress() {
		navigator.clipboard.writeText('939 N Main St, Porterville, CA 93257');
		addressCopied = true;
		setTimeout(() => (addressCopied = false), 2000);
	}

	function copyPhone() {
		navigator.clipboard.writeText('(559) 781-8068');
		phoneCopied = true;
		setTimeout(() => (phoneCopied = false), 2000);
	}

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'PageDown') {
			e.preventDefault();
			if (mainContainer) {
				mainContainer.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
			}
		} else if (e.key === 'PageUp') {
			e.preventDefault();
			if (mainContainer) {
				mainContainer.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
			}
		}
	}

	onMount(async () => {
		if (!browser) return;

		window.addEventListener('resize', handleResize);
		setTimeout(handleResize, 50);

		currentFeature1 = feature1Pool[Math.floor(Math.random() * feature1Pool.length)];
		currentFeature2 = feature2Pool[Math.floor(Math.random() * feature2Pool.length)];
		currentFeature3 = feature3Pool[Math.floor(Math.random() * feature3Pool.length)];

		await tick();

		gsap.fromTo(
			opportunityText,
			{ opacity: 0, y: 50 },
			{
				opacity: 1,
				y: 0,
				duration: 1.5,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: opportunityText,
					scroller: mainContainer,
					start: 'top 80%',
					toggleActions: 'play none none reverse'
				}
			}
		);

		gsap.set([featurePanels[1], featurePanels[2]], { opacity: 1, pointerEvents: 'none' });
		gsap.set(
			[
				featurePanels[1].querySelector('.feature-text-container'),
				featurePanels[2].querySelector('.feature-text-container')
			],
			{ y: 50, opacity: 0 }
		);
		gsap.set(
			[
				featurePanels[1].querySelector('.feature-image-container'),
				featurePanels[2].querySelector('.feature-image-container')
			],
			{ clipPath: 'inset(50%)' }
		);

		let state2 = 0;
		const animateIn2 = () => {
			if (state2 === 1) return;
			state2 = 1;
			gsap.to(featurePanels[0].querySelector('.feature-text-container'), {
				y: -50,
				opacity: 0,
				duration: 0.3,
				ease: 'power2.inOut',
				overwrite: true
			});
			gsap.to(featurePanels[1].querySelector('.feature-text-container'), {
				y: 0,
				opacity: 1,
				duration: 0.3,
				ease: 'power2.out',
				delay: 0.1,
				overwrite: true
			});
			gsap.to(featurePanels[1].querySelector('.feature-image-container'), {
				clipPath: 'inset(0%)',
				duration: 0.45,
				ease: 'power2.inOut',
				overwrite: true
			});
		};

		const animateOut2 = () => {
			if (state2 === 0) return;
			state2 = 0;
			gsap.to(featurePanels[1].querySelector('.feature-text-container'), {
				y: 50,
				opacity: 0,
				duration: 0.3,
				ease: 'power2.inOut',
				overwrite: true
			});
			gsap.to(featurePanels[1].querySelector('.feature-image-container'), {
				clipPath: 'inset(50%)',
				duration: 0.4,
				ease: 'power2.inOut',
				overwrite: true
			});
			gsap.to(featurePanels[0].querySelector('.feature-text-container'), {
				y: 0,
				opacity: 1,
				duration: 0.3,
				ease: 'power2.out',
				delay: 0.1,
				overwrite: true
			});
		};

		ScrollTrigger.create({
			trigger: trigger2,
			scroller: mainContainer,
			start: 'top 80%',
			end: 'top 20%',
			onEnter: animateIn2,
			onLeave: animateIn2,
			onEnterBack: animateOut2,
			onLeaveBack: animateOut2
		});

		let state3 = 0;
		const animateIn3 = () => {
			if (state3 === 1) return;
			state3 = 1;
			gsap.to(featurePanels[1].querySelector('.feature-text-container'), {
				y: -50,
				opacity: 0,
				duration: 0.3,
				ease: 'power2.inOut',
				overwrite: true
			});
			gsap.to(featurePanels[2].querySelector('.feature-text-container'), {
				y: 0,
				opacity: 1,
				duration: 0.3,
				ease: 'power2.out',
				delay: 0.1,
				overwrite: true
			});
			gsap.to(featurePanels[2].querySelector('.feature-image-container'), {
				clipPath: 'inset(0%)',
				duration: 0.45,
				ease: 'power2.inOut',
				overwrite: true
			});
		};

		const animateOut3 = () => {
			if (state3 === 0) return;
			state3 = 0;
			gsap.to(featurePanels[2].querySelector('.feature-text-container'), {
				y: 50,
				opacity: 0,
				duration: 0.3,
				ease: 'power2.inOut',
				overwrite: true
			});
			gsap.to(featurePanels[2].querySelector('.feature-image-container'), {
				clipPath: 'inset(50%)',
				duration: 0.4,
				ease: 'power2.inOut',
				overwrite: true
			});
			gsap.to(featurePanels[1].querySelector('.feature-text-container'), {
				y: 0,
				opacity: 1,
				duration: 0.3,
				ease: 'power2.out',
				delay: 0.1,
				overwrite: true
			});
		};

		ScrollTrigger.create({
			trigger: trigger3,
			scroller: mainContainer,
			start: 'top 80%',
			end: 'top 20%',
			onEnter: animateIn3,
			onLeave: animateIn3,
			onEnterBack: animateOut3,
			onLeaveBack: animateOut3
		});
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('resize', handleResize);
			ScrollTrigger.getAll().forEach((t) => t.kill());
		}
	});
</script>

<svelte:head>
	<title>Life Tabernacle</title>
	<meta name="description" content="Where the Bible is believed and obeyed" />
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<main
	bind:this={mainContainer}
	class="relative h-dvh w-full snap-y snap-mandatory overflow-x-hidden overflow-y-auto scroll-smooth bg-dark">
	<section
		id="imagery"
		class="relative flex h-dvh w-full shrink-0 snap-start snap-always items-center justify-center overflow-hidden">
		<div class="absolute inset-0 z-0">
			<enhanced:img
				src={heroImg}
				alt="Church interior"
				class="h-full w-full object-cover opacity-60"
				fetchpriority="high" />
			<div class="absolute inset-0 bg-black/40"></div>
		</div>

		<nav class="absolute top-0 left-0 z-50 flex w-full items-center justify-end px-6 py-8 md:px-16">
			<div class="hidden gap-8 md:flex">
				<a href="/schedule" class="text-sm tracking-widest text-sand/80 transition-colors duration-300 hover:text-white"
					>Schedule</a>
				<a href="/history" class="text-sm tracking-widest text-sand/80 transition-colors duration-300 hover:text-white"
					>History</a>
				<a href="/doctrine" class="text-sm tracking-widest text-sand/80 transition-colors duration-300 hover:text-white"
					>What we believe</a>
			</div>
			<button
				class="relative z-60 text-sand/80 transition-colors duration-300 hover:text-white focus:outline-none md:hidden"
				onclick={toggleMenu}
				aria-expanded={isMenuOpen}
				aria-controls="home-mobile-menu"
				aria-label="Toggle menu">
				{#if isMenuOpen}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line
							x1="4"
							x2="20"
							y1="18"
							y2="18" /></svg>
				{/if}
			</button>
		</nav>

		{#if isMenuOpen}
			<div id="home-mobile-menu" class="fixed inset-0 z-40 flex flex-col items-center justify-center space-y-10 bg-[#0f0f0f] md:hidden">
				<a href="/schedule" onclick={toggleMenu} class="text-3xl font-light tracking-widest text-white">Schedule</a>
				<a href="/history" onclick={toggleMenu} class="text-3xl font-light tracking-widest text-white">History</a>
				<a href="/doctrine" onclick={toggleMenu} class="text-3xl font-light tracking-widest text-white"
					>What we believe</a>
			</div>
		{/if}

		<div class="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 pt-20 pb-20 text-center">
			<div class="hc:bg-black/95 hc:p-8 hc:rounded-2xl hc:backdrop-blur-md hc:ring-1 hc:ring-white/20">
				<h1 class="mb-6 text-5xl font-light tracking-widest text-white md:text-8xl">Life Tabernacle</h1>
				<p class="mb-12 text-xl font-light tracking-wide text-sand md:text-3xl">Where the Bible is believed and obeyed</p>
			</div>
		</div>

		{#if accessibility.highContrast || accessibility.dyslexiaFont}
			<div class="absolute right-8 bottom-[15%] z-20 text-center font-bold tracking-widest text-white/90 md:inset-x-0 md:bottom-10 md:mx-auto">
				Scroll to continue
			</div>
		{:else}
			<div
				class="pointer-events-none absolute right-8 bottom-[15%] z-20 h-16 w-px overflow-hidden rounded-full bg-white/10 md:inset-x-0 md:bottom-10 md:mx-auto">
				<div class="animate-scroll-line h-8 w-full bg-linear-to-b from-transparent via-white to-transparent"></div>
			</div>
		{/if}
	</section>

	<section
		id="opportunity"
		class="flex h-dvh w-full shrink-0 snap-start snap-always flex-col items-center justify-center bg-zinc-900 px-8 text-center md:px-24">
		<div bind:this={opportunityText} class="foldable-padding mx-auto max-w-5xl dyslexia:max-w-7xl opacity-0">
			<h2 class="text-4xl leading-tight font-light tracking-wide text-sand md:text-6xl">Redeeming the time, because the days are evil.</h2>
		</div>
	</section>

	<section id="stay" bind:this={featuresContainer} class="relative h-[300dvh] w-full shrink-0">
		<div class="sticky top-0 h-dvh w-full overflow-hidden bg-dark shadow-2xl">
			<div
				bind:this={featurePanels[0]}
				class="foldable-split absolute inset-0 flex flex-col items-center justify-center p-8 md:flex-row md:p-24">
				<div
					class="feature-text-container order-1 mb-6 flex h-[35dvh] w-full flex-col justify-start pr-0 md:order-0 md:mb-0 md:h-auto md:w-1/2 md:justify-center md:flex-none md:pr-16">
					<h2 class="mb-6 text-4xl font-light text-white md:text-6xl">The Bible</h2>
					<p class="max-w-lg dyslexia:max-w-2xl text-xl leading-relaxed text-sand/80">We believe the Bible is the inspired, infallible, inerrant Word of the living God. Everything at Life Tabernacle is rooted directly in scripture</p>
				</div>
				<div
					class="feature-image-container relative order-2 h-[40dvh] w-full overflow-hidden rounded-xl md:order-0 md:h-[60dvh] md:w-1/2">
					{#if currentFeature1}
						<enhanced:img
							src={currentFeature1}
							alt="Bible reading"
							class="h-full w-full object-cover"
							fetchpriority="high" />
					{/if}
				</div>
			</div>

			<div
				bind:this={featurePanels[1]}
				class="foldable-split absolute inset-0 flex flex-col items-center justify-center p-8 opacity-0 md:flex-row md:p-24">
				<div
					class="feature-text-container order-1 mb-6 flex h-[35dvh] w-full flex-col justify-start pr-0 md:order-0 md:mb-0 md:h-auto md:w-1/2 md:justify-center md:flex-none md:pr-16">
					<h2 class="mb-6 text-4xl font-light text-white md:text-6xl">Fellowship</h2>
					<p class="max-w-lg dyslexia:max-w-2xl text-xl leading-relaxed text-sand/80">Now therefore ye are no more strangers and foreigners, but fellowcitizens with the saints, and of the household of God;</p>
				</div>
				<div class="feature-image-container relative order-2 h-[40dvh] w-full overflow-hidden rounded-xl md:order-0 md:h-[60dvh] md:w-1/2">
					{#if currentFeature2}
						<enhanced:img src={currentFeature2} alt="Community fellowship" class="h-full w-full object-cover" />
					{/if}
				</div>
			</div>

			<div bind:this={featurePanels[2]} class="foldable-split absolute inset-0 flex flex-col items-center justify-center p-8 opacity-0 md:flex-row md:p-24">
				<div class="feature-text-container order-1 mb-6 flex h-[35dvh] w-full flex-col justify-start pr-0 md:order-0 md:mb-0 md:h-auto md:w-1/2 md:justify-center md:flex-none md:pr-16">
					<h2 class="mb-6 text-4xl font-light text-white md:text-6xl">The truth</h2>
					<p class="max-w-lg dyslexia:max-w-2xl text-xl leading-relaxed text-sand/80">Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost.</p>
				</div>
				<div class="feature-image-container relative order-2 h-[40dvh] w-full overflow-hidden rounded-xl md:order-0 md:h-[60dvh] md:w-1/2">
					{#if currentFeature3}
						<enhanced:img src={currentFeature3} alt="Worship service" class="h-full w-full object-cover" />
					{/if}
				</div>
			</div>
		</div>

		<div class="pointer-events-none absolute top-0 h-dvh w-full snap-start snap-always"></div>
		<div bind:this={trigger2} class="pointer-events-none absolute top-[100dvh] h-dvh w-full snap-start snap-always">
		</div>
		<div bind:this={trigger3} class="pointer-events-none absolute top-[200dvh] h-dvh w-full snap-start snap-always">
		</div>
	</section>

	<section
		id="place"
		class="flex h-dvh w-full shrink-0 snap-start snap-always flex-col justify-center bg-zinc-900 px-8 md:px-24">
		<h2 class="mb-16 text-center text-4xl font-light text-white md:text-6xl">Explore</h2>
		<div class="mx-auto grid w-full max-w-7xl dyslexia:max-w-360 grid-cols-1 gap-8 md:grid-cols-3">
			<a href="/schedule" class="group relative block h-[20dvh] overflow-hidden rounded-xl border border-white/10 bg-linear-to-br from-zinc-800 to-zinc-900 shadow-lg transition-all duration-500 hover:border-white/30 hover:shadow-2xl md:h-[50dvh]">
				<div class="absolute inset-0 bg-linear-to-br from-amber-500/20 to-orange-600/20 opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>
				<div class="absolute inset-0 flex flex-col items-center justify-center gap-6">
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-sand/50 transition-all duration-700 group-hover:scale-110 group-hover:text-amber-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
					<h3 class="text-3xl font-light tracking-wide text-white transition-transform duration-700 group-hover:scale-110">Schedule</h3>
				</div>
			</a>
			<a
				href="/history"
				class="group relative block h-[20dvh] overflow-hidden rounded-xl border border-white/10 bg-linear-to-br from-zinc-800 to-zinc-900 shadow-lg transition-all duration-500 hover:border-white/30 hover:shadow-2xl md:h-[50dvh]">
				<div
					class="absolute inset-0 bg-linear-to-br from-blue-500/20 to-indigo-600/20 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
				</div>
				<div class="absolute inset-0 flex flex-col items-center justify-center gap-6">
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-sand/50 transition-all duration-700 group-hover:scale-110 group-hover:text-blue-400"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
					<h3 class="text-3xl font-light tracking-wide text-white transition-transform duration-700 group-hover:scale-110">History</h3>
				</div>
			</a>
			<a href="/doctrine" class="group relative block h-[20dvh] overflow-hidden rounded-xl border border-white/10 bg-linear-to-br from-zinc-800 to-zinc-900 shadow-lg transition-all duration-500 hover:border-white/30 hover:shadow-2xl md:h-[50dvh]">
				<div class="absolute inset-0 bg-linear-to-br from-emerald-500/20 to-teal-600/20 opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>
				<div class="absolute inset-0 flex flex-col items-center justify-center gap-6">
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-sand/50 transition-all duration-700 group-hover:scale-110 group-hover:text-emerald-400"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
					<h3 class="text-3xl font-light tracking-wide text-white transition-transform duration-700 group-hover:scale-110">What we believe</h3>
				</div>
			</a>
		</div>
	</section>

	<section
		id="answers"
		class="flex h-dvh w-full shrink-0 snap-start snap-always flex-col justify-center bg-dark px-8 md:px-24">
		<div class="foldable-padding mx-auto w-full max-w-4xl dyslexia:max-w-6xl">
			<h2 class="mb-16 text-center text-4xl font-light text-white md:text-left md:text-6xl">Answers</h2>

			<div class="space-y-12">
				<div>
					<h3 class="mb-4 text-2xl font-light text-white">I've never been to church, how do I know what to expect?</h3>
					<p class="text-lg leading-relaxed text-sand/70">Music, worship, preaching, maybe something else</p>
				</div>

				<div>
					<h3 class="mb-4 text-2xl font-light text-white">Is there a dress code?</h3>
					<p class="text-lg leading-relaxed text-sand/70">No. As long as you are here, we will be extremely glad, although most of our members like to dress their best</p>
				</div>

				<div>
					<h3 class="mb-4 text-2xl font-light text-white">What about my kids?</h3>
					<p class="text-lg leading-relaxed text-sand/70">Our church family includes kids of all ages. We offer programs for children on Sunday mornings, hold special activities and sports at Zalud Park on Friday nights, and join events with churches in neighboring cities throughout the year. There is always something to do!</p>
				</div>
			</div>
		</div>
	</section>

	<section
		id="visit"
		class="flex h-dvh w-full shrink-0 snap-start snap-always flex-col justify-center bg-zinc-900 px-8 md:px-24">
		<div class="foldable-padding mx-auto w-full max-w-4xl dyslexia:max-w-6xl text-center md:text-left">
			<h2 class="mb-12 text-4xl font-light text-white md:text-6xl">Visit us</h2>

			<div class="grid grid-cols-1 gap-12 md:grid-cols-2">
				<div class="flex flex-col space-y-8">
					<div>
						<h3 class="mb-4 text-2xl font-light text-white">Location</h3>
						<div class="flex items-center justify-center gap-4 md:justify-start">
							<div class="h-9 w-9 md:hidden"></div>
							<a href="https://maps.google.com/?q=939+N+Main+St,+Porterville,+CA+93257" target="_blank" rel="noopener noreferrer" class="text-lg text-sand/70 underline-offset-4 transition-colors hover:text-white hover:underline">939 N Main St</a>
							<button onclick={copyAddress} class="rounded-full p-2 text-sand/70 transition-colors hover:bg-white/10 hover:text-white" aria-label="Copy address" title="Copy address">
								{#if addressCopied}
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
								{:else}
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
								{/if}
							</button>
						</div>
					</div>

					<div>
						<h3 class="mb-4 text-2xl font-light text-white">Contact</h3>
						<div class="flex items-center justify-center gap-4 md:justify-start">
							<div class="h-9 w-9 md:hidden"></div>
							<a href="tel:+15597818068" class="text-lg text-sand/70 transition-colors hover:text-white">(559) 781-8068</a>
							<button
								onclick={copyPhone}
								class="rounded-full p-2 text-sand/70 transition-colors hover:bg-white/10 hover:text-white"
								aria-label="Copy phone number"
								title="Copy phone number">
								{#if phoneCopied}
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
								{:else}
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
								{/if}
							</button>
						</div>
					</div>
				</div>

				<div class="flex flex-col space-y-8">
					<div>
						<h3 class="mb-4 text-2xl font-light text-white">Transportation</h3>
						<p class="text-lg leading-relaxed text-sand/70">We offer free transportation if you need a ride. Just give us a call</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>

<style>
	@keyframes scroll-line {
		0% {
			transform: translateY(200%);
		}
		100% {
			transform: translateY(-100%);
		}
	}

	.animate-scroll-line {
		animation: scroll-line 2s cubic-bezier(0.77, 0, 0.175, 1) infinite;
	}

	@media (horizontal-viewport-segments: 2) {
		.foldable-split {
			display: grid !important;
			grid-template-columns: 1fr 1fr;
			gap: env(viewport-segment-width 0 0);
		}

		.foldable-padding {
			padding-top: max(env(viewport-segment-top 0 0), 2rem);
			padding-bottom: max(env(viewport-segment-bottom 0 0), 2rem);
			padding-left: max(env(viewport-segment-left 0 0), 2rem);
			padding-right: max(env(viewport-segment-right 0 0), 2rem);
		}
	}
</style>