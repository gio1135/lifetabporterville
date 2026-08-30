<script lang="ts">
	import { enhance } from '$app/forms';
	import { SvelteDate } from 'svelte/reactivity';
	import type { PageData } from './$types';
	import type { Schedule } from '$lib/server/schedule';

	let { data }: { data: PageData } = $props();

	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	let isEditing = $state(false);
	let editSchedule = $state<Schedule>({ sundaySchool: true, items: [] });

	function convertTo24Hour(timeStr: string): string {
		if (!timeStr || !timeStr.includes(' ')) return timeStr;
		const [time, modifier] = timeStr.trim().split(/\s+/);
		if (!time || !modifier) return timeStr;
		let [hours, minutes] = time.split(':');
		if (hours === '12') hours = '00';
		if (modifier.toUpperCase() === 'PM') hours = String(parseInt(hours, 10) + 12);
		return `${hours.padStart(2, '0')}:${minutes}`;
	}

	function convertTo12Hour(timeStr: string): string {
		if (!timeStr || timeStr.includes(' ') || !timeStr.includes(':')) return timeStr;
		const [hours, minutes] = timeStr.split(':');
		let h = parseInt(hours, 10);
		const ampm = h >= 12 ? 'PM' : 'AM';
		h = h % 12 || 12;
		return `${h}:${minutes} ${ampm}`;
	}

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
			editSchedule.items.forEach((item) => {
				item.time = convertTo24Hour(item.time);
			});
		}
		isEditing = !isEditing;
	}

	function addDay() {
		editSchedule.items.push({
			id: `custom-${Date.now()}`,
			dayOfWeek: 0,
			title: '',
			description: '',
			time: '',
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

	function getGroupedItems(items: Schedule['items']) {
		return items.reduce(
			(acc, item) => {
				let group = acc.find((g) => g.dayOfWeek === item.dayOfWeek);
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
			},
			[] as { id: string; dayOfWeek: number; items: typeof items }[]
		);
	}
</script>

<svelte:head>
	<title>Schedule | Life Tabernacle</title>
</svelte:head>

<div id="schedule-content" class="custom-scrollbar h-full w-full overflow-y-auto scroll-smooth pt-24 md:pt-32">
	<div class="mx-auto w-full max-w-4xl hc:max-w-5xl dyslexia:max-w-6xl md:border md:border-sand/10 md:bg-dark/60 p-8 px-6 pb-32 md:backdrop-blur md:p-12 md:px-12">
		<div class="mb-10 flex items-center justify-between border-b border-sand/20 pb-6">
			<h1 class="text-3xl font-light tracking-widest md:text-5xl">Service schedule</h1>

			{#if data.isLoggedIn}
				<div class="flex items-center gap-4">
					<button
						onclick={toggleEdit}
						class="cursor-pointer border border-sand/30 px-4 py-2 text-sm tracking-widest transition-colors hover:bg-white hover:text-black">
						{isEditing ? 'Cancel edit' : 'Edit'}
					</button>
					<form method="POST" action="?/logout" use:enhance class="inline">
						<button
							type="submit"
							class="cursor-pointer bg-red-900/30 px-4 py-2 text-sm tracking-widest text-red-400 transition-colors hover:bg-red-900/50">
							Logout
						</button>
					</form>
				</div>
			{:else}
				<a href="/admin/login" class="text-xs tracking-widest text-sand/50 transition-colors hover:text-white">
					Login
				</a>
			{/if}
		</div>

		{#if isEditing}
			<div class="space-y-6">
				<div class="mb-6 flex items-center gap-3 border border-sand/20 bg-dark/40 p-4">
					<input
						type="checkbox"
						id="sundaySchool"
						bind:checked={editSchedule.sundaySchool}
						class="h-5 w-5 cursor-pointer accent-sand" />
					<label for="sundaySchool" class="cursor-pointer text-lg font-medium tracking-wider">Sunday school</label>
				</div>

				{#each editSchedule.items as item (item.id)}
					<div class="group relative border border-sand/20 bg-dark/40 p-4">
						<div class="grid grid-cols-1 gap-4 md:grid-cols-12">
							<div class="col-span-1 md:col-span-3">
								<label for="dayOfWeek-{item.id}" class="mb-1 block text-xs tracking-widest text-sand/70">Day</label>
								<select
									id="dayOfWeek-{item.id}"
									bind:value={item.dayOfWeek}
									class="w-full cursor-pointer border border-sand/30 bg-dark px-3 py-2 text-white transition-colors focus:border-white focus:outline-none">
									{#each daysOfWeek as day (day)}
										<option value={daysOfWeek.indexOf(day)}>{day} ({getDateString(daysOfWeek.indexOf(day))})</option>
									{/each}
								</select>
							</div>

							<div class="col-span-1 md:col-span-3">
								<label for="title-{item.id}" class="mb-1 block text-xs tracking-widest text-sand/70">Title</label>
								<input
									id="title-{item.id}"
									type="text"
									bind:value={item.title}
									class="w-full border border-sand/30 bg-dark px-3 py-2 text-white transition-colors focus:border-white focus:outline-none" />
							</div>

							<div class="col-span-1 md:col-span-4">
								<label for="desc-{item.id}" class="mb-1 block text-xs tracking-widest text-sand/70">Subtitle</label>
								<input
									id="desc-{item.id}"
									type="text"
									bind:value={item.description}
									class="w-full border border-sand/30 bg-dark px-3 py-2 text-white transition-colors focus:border-white focus:outline-none" />
							</div>

							<div class="col-span-1 md:col-span-2">
								<label for="time-{item.id}" class="mb-1 block text-xs tracking-widest text-sand/70">Time</label>
								<input
									id="time-{item.id}"
									type="time"
									bind:value={item.time}
									class="w-full cursor-pointer border border-sand/30 bg-dark px-3 py-2 text-white transition-colors focus:border-white focus:outline-none" />
							</div>
						</div>

						<div class="mt-4 flex items-center justify-end gap-3">
							<button
								onclick={() => toggleCrossOut(item.id)}
								class="cursor-pointer border border-sand/30 px-3 py-1 text-xs tracking-widest transition-colors hover:bg-white hover:text-black {item.crossedOut
									? 'bg-white text-black'
									: ''}">
								{item.crossedOut ? 'Uncross' : 'Cross out'}
							</button>
							<button
								onclick={() => removeDay(item.id)}
								class="cursor-pointer border border-red-500/20 bg-red-900/30 px-3 py-1 text-xs tracking-widest text-red-400 transition-colors hover:bg-red-900/50">
								Remove
							</button>
						</div>
					</div>
				{/each}

				<div class="flex justify-center border-t border-sand/20 pt-4">
					<button
						onclick={addDay}
						class="cursor-pointer border border-sand px-6 py-3 tracking-widest transition-colors hover:bg-sand hover:text-dark">
						Add new
					</button>
				</div>

				<div class="mt-4 flex justify-center gap-4 pt-4">
					<form
						method="POST"
						action="?/reset"
						class="inline"
						use:enhance={() => {
							return async ({ update }) => {
								await update();
								isEditing = false;
							};
						}}>
						<button
							type="submit"
							class="cursor-pointer border border-red-500/30 bg-red-900/30 px-6 py-3 tracking-widest text-red-400 transition-colors hover:bg-red-900/50">
							Reset
						</button>
					</form>

					<form method="POST" action="?/save" class="inline" use:enhance={() => {
						return async ({ update }) => {
							await update();
							isEditing = false;
						};
					}}>
						<input type="hidden" name="payload" value={JSON.stringify({
							...editSchedule,
							items: editSchedule.items.map(item => ({ ...item, time: convertTo12Hour(item.time) }))
						})} />
						<button
							type="submit"
							class="cursor-pointer bg-white px-6 py-3 font-medium tracking-widest text-dark transition-colors hover:bg-sand">
							Done
						</button>
					</form>
				</div>
			</div>
		{:else}
			<ul class="divide-y divide-sand/10">
				{#each getGroupedItems(data.schedule.items) as group (group.id)}
					<li class="group flex flex-col items-start gap-6 py-6 md:flex-row md:items-stretch md:gap-8">
						<div
							class="flex w-full shrink-0 flex-row items-baseline justify-start gap-3 border-sand/20 md:w-60 md:hc:w-72 md:dyslexia:w-80 md:flex-col md:items-start md:justify-center md:gap-0 md:border-r md:pr-6">
							<span class="text-2xl font-light tracking-widest text-white md:text-3xl"
								>{daysOfWeek[group.dayOfWeek]}</span>
							<span class="text-sm tracking-widest text-sand/70 md:mt-1">{getDateString(group.dayOfWeek)}</span>
						</div>

						<div class="flex w-full flex-1 flex-col justify-center gap-8">
							{#each group.items as item (item.id)}
								<div class="flex w-full flex-col items-start justify-between md:flex-row md:items-center">
									<div class="flex w-full flex-col">
										<div class="flex w-full flex-row items-baseline justify-between md:items-center">
											<h3
												class="flex flex-wrap items-center gap-4 text-xl font-light tracking-wide md:text-2xl {item.crossedOut
													? 'line-through opacity-40'
													: ''}">
												{item.title}

												{#if item.dayOfWeek === 0 && item.title.toLowerCase().includes('morning')}
													{#if data.schedule.sundaySchool}
														<span class="border border-sand/40 px-2 py-1 text-xs tracking-widest text-sand">
															Sunday school
														</span>
													{:else}
														<span
															class="border border-red-500/30 bg-red-900/20 px-2 py-1 text-xs tracking-widest text-red-400">
															No sunday school
														</span>
													{/if}
												{/if}
											</h3>

											<div
												class="ml-4 shrink-0 text-lg font-light tracking-wider md:hidden {item.crossedOut
													? 'line-through opacity-40'
													: ''}">
												{item.time}
											</div>
										</div>

										{#if item.description}
											<p class="mt-2 text-sand/60 {item.crossedOut ? 'line-through opacity-40' : ''}">
												{item.description}
											</p>
										{/if}
									</div>

									<div
										class="hidden shrink-0 text-2xl font-light tracking-wider md:ml-6 md:block {item.crossedOut
											? 'line-through opacity-40'
											: ''}">
										{item.time}
									</div>
								</div>
							{/each}
						</div>
					</li>
				{/each}
			</ul>
		{/if}

		<div class="mt-6 pt-10 text-center">
			<p class="text-sm tracking-wide text-sand/50">Services have prayer 30 minutes before. Prayer nights are 30 minutes of prayer with no service</p>
		</div>
	</div>
</div>
