<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { goto } from '$app/navigation';
	import gsap from 'gsap';

	import ChurchTransition from './icons/ChurchTransition.svelte';
	import TimelineTransition from './icons/TimelineTransition.svelte';
	import CalendarTransition from './icons/CalendarTransition.svelte';
	import BibleTransition from './icons/BibleTransition.svelte';
	import LoginTransition from './icons/LoginTransition.svelte';

	let isTransitioning = $state(false);
	let skipNextTransition = $state(false);

	let transitionContainer = $state<HTMLDivElement | null>(null);
	let currentIcon = $state<string | null>(null);

	interface TransitionComponent {
		play: () => Promise<void>;
	}

	let churchComponent = $state<TransitionComponent | null>(null);
	let timelineComponent = $state<TransitionComponent | null>(null);
	let calendarComponent = $state<TransitionComponent | null>(null);
	let bibleComponent = $state<TransitionComponent | null>(null);
	let loginComponent = $state<TransitionComponent | null>(null);

	beforeNavigate((navigation) => {
		if (skipNextTransition) {
			skipNextTransition = false;
			return;
		}

		const toPath = navigation.to?.url.pathname;
		const fromPath = navigation.from?.url.pathname;

		if (toPath && fromPath !== toPath) {
			navigation.cancel();
			currentIcon = getIconType(toPath);
			startTransitionSequence(toPath);
		}
	});

	function getIconType(path: string) {
		if (path === '/') return 'home';
		if (path.startsWith('/history')) return 'history';
		if (path.startsWith('/schedule')) return 'schedule';
		if (path.startsWith('/doctrine')) return 'doctrine';
		if (path.startsWith('/admin/login')) return 'login';
		return null;
	}

	async function startTransitionSequence(path: string) {
		isTransitioning = true;

		await new Promise((r) => setTimeout(r, 10));

		if (transitionContainer) {
			await gsap.fromTo(transitionContainer, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.inOut' });
		}

		await playIconAnimation();

		skipNextTransition = true;
		await goto(path);

		if (transitionContainer) {
			await gsap.to(transitionContainer, {
				opacity: 0,
				duration: 0.5,
				ease: 'power2.inOut',
				delay: 0.1
			});
		}

		isTransitioning = false;
		currentIcon = null;
	}

	async function playIconAnimation() {
		if (currentIcon === 'home' && churchComponent) await churchComponent.play();
		else if (currentIcon === 'history' && timelineComponent) await timelineComponent.play();
		else if (currentIcon === 'schedule' && calendarComponent) await calendarComponent.play();
		else if (currentIcon === 'doctrine' && bibleComponent) await bibleComponent.play();
		else if (currentIcon === 'login' && loginComponent) await loginComponent.play();
		else {
			await new Promise((r) => setTimeout(r, 500));
		}
	}
</script>

<div
	bind:this={transitionContainer}
	class="fixed inset-0 z-100 flex items-center justify-center bg-black opacity-0"
	style="display: {isTransitioning ? 'flex' : 'none'}; pointer-events: {isTransitioning ? 'auto' : 'none'};">
	{#if currentIcon === 'home'}
		<ChurchTransition bind:this={churchComponent} />
	{:else if currentIcon === 'history'}
		<TimelineTransition bind:this={timelineComponent} />
	{:else if currentIcon === 'schedule'}
		<CalendarTransition bind:this={calendarComponent} />
	{:else if currentIcon === 'doctrine'}
		<BibleTransition bind:this={bibleComponent} />
	{:else if currentIcon === 'login'}
		<LoginTransition bind:this={loginComponent} />
	{/if}
</div>
