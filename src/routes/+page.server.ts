import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { defaultSchedule, getCurrentWeekKey, type Schedule } from '$lib/server/schedule';

export const load: PageServerLoad = async ({ platform, cookies }) => {
  const session = cookies.get('admin_session');
  const isLoggedIn = session === 'authenticated';

  let schedule = defaultSchedule;
  let isOverride = false;

  if (platform?.env?.SCHEDULE_KV) {
    const key = getCurrentWeekKey();
    const stored = await platform.env.SCHEDULE_KV.get(key);
    if (stored) {
      schedule = JSON.parse(stored) as Schedule;
      isOverride = JSON.stringify(schedule.items) !== JSON.stringify(defaultSchedule.items);
    }
  }

  return {
    schedule,
    isOverride,
    isLoggedIn
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
    } catch (e) {
      return fail(400, { error: 'Invalid schedule payload' });
    }

    if (platform?.env?.SCHEDULE_KV) {
      const key = getCurrentWeekKey();
      await platform.env.SCHEDULE_KV.put(key, JSON.stringify(schedule), {
        expirationTtl: 604800 * 2 // 2 weeks TTL
      });
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
