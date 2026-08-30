import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { defaultSchedule, getCurrentWeekKey, getPreviousWeekKey, type Schedule } from '$lib/server/schedule';

export const load: PageServerLoad = async ({ platform, cookies }) => {
	const session = cookies.get('admin_session');
	const isLoggedIn = session === 'authenticated';
	const isSunday = new Date().getDay() === 0;

	let schedule = JSON.parse(JSON.stringify(defaultSchedule)) as Schedule;
	let isOverride = false;

	if (platform?.env?.SCHEDULE_KV) {
		const key = getCurrentWeekKey();
		const stored = await platform.env.SCHEDULE_KV.get(key);
		if (stored) {
			schedule = JSON.parse(stored) as Schedule;
			isOverride = JSON.stringify(schedule.items) !== JSON.stringify(defaultSchedule.items);
		}

		if (isSunday) {
			const prevKey = getPreviousWeekKey();
			const prevStored = await platform.env.SCHEDULE_KV.get(prevKey);
			let prevSchedule = JSON.parse(JSON.stringify(defaultSchedule)) as Schedule;
			if (prevStored) {
				prevSchedule = JSON.parse(prevStored) as Schedule;
			}
			
			schedule.todaySundaySchool = prevSchedule.sundaySchool;
			const todaySundayItems = prevSchedule.items
				.filter(i => i.dayOfWeek === 0)
				.map(i => ({ ...i, id: i.id + '-today', isToday: true }));
			
			schedule.items = [...todaySundayItems, ...schedule.items];
		}
	} else if (isSunday) {
		schedule.todaySundaySchool = schedule.sundaySchool;
		const todaySundayItems = schedule.items
			.filter(i => i.dayOfWeek === 0)
			.map(i => ({ ...i, id: i.id + '-today', isToday: true }));
		schedule.items = [...todaySundayItems, ...schedule.items];
	}

	return {
		schedule,
		isOverride,
		isLoggedIn,
		isSunday
	};
};

export const actions = {
	save: async ({ request, platform, cookies }) => {
		const session = cookies.get('admin_session');
		if (session !== 'authenticated') {
			return fail(401, { error: 'Unauthorized' });
		}

		const data = await request.formData();
		const payloadStr = data.get('payload');
		if (!payloadStr || typeof payloadStr !== 'string') {
			return fail(400, { error: 'Missing schedule payload' });
		}

		let schedule: Schedule;
		try {
			schedule = JSON.parse(payloadStr);
		} catch {
			return fail(400, { error: 'Invalid schedule payload' });
		}

		if (platform?.env?.SCHEDULE_KV) {
			const key = getCurrentWeekKey();
			const isSunday = new Date().getDay() === 0;

			if (isSunday) {
				const prevKey = getPreviousWeekKey();
				
				const prevStored = await platform.env.SCHEDULE_KV.get(prevKey);
				let prevSchedule = JSON.parse(JSON.stringify(defaultSchedule)) as Schedule;
				if (prevStored) prevSchedule = JSON.parse(prevStored) as Schedule;

				prevSchedule.sundaySchool = schedule.todaySundaySchool ?? prevSchedule.sundaySchool;
				
				const newTodayItems = schedule.items.filter((i) => i.isToday);
				prevSchedule.items = [
					...prevSchedule.items.filter(i => i.dayOfWeek !== 0),
					...newTodayItems.map((i) => {
						const rest = { ...i, id: i.id.replace('-today', '') };
						delete rest.isToday;
						return rest;
					})
				];

				await platform.env.SCHEDULE_KV.put(prevKey, JSON.stringify(prevSchedule), { expirationTtl: 604800 * 2 });

				const nextItems = schedule.items.filter((i) => !i.isToday);
				const nextSchedule = {
					sundaySchool: schedule.sundaySchool,
					items: nextItems
				};
				await platform.env.SCHEDULE_KV.put(key, JSON.stringify(nextSchedule), { expirationTtl: 604800 * 2 });
			} else {
				await platform.env.SCHEDULE_KV.put(key, JSON.stringify(schedule), {
					expirationTtl: 604800 * 2
				});
			}

			return { success: true, action: 'save' };
		}

		return fail(500, { error: 'KV store not available' });
	},

	reset: async ({ platform, cookies }) => {
		const session = cookies.get('admin_session');
		if (session !== 'authenticated') {
			return fail(401, { error: 'Unauthorized' });
		}

		if (platform?.env?.SCHEDULE_KV) {
			const key = getCurrentWeekKey();
			await platform.env.SCHEDULE_KV.delete(key);
			return { success: true, action: 'reset', schedule: defaultSchedule };
		}

		return fail(500, { error: 'KV store not available' });
	},

	logout: async ({ cookies }) => {
		cookies.delete('admin_session', { path: '/' });
		return { success: true, action: 'logout' };
	}
} satisfies Actions;
