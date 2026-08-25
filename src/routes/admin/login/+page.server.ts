import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  const session = cookies.get('admin_session');
  if (session === 'authenticated') {
    throw redirect(303, '/schedule');
  }
};

export const actions = {
  default: async ({ request, cookies, platform }) => {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    if (!username || !password) {
      return fail(400, { missing: true });
    }

    // Fetch credentials from Cloudflare KV
    let ADMIN_USER = 'Admin';
    let ADMIN_PASS = 'RVcUYb04uTTr5xcw4Za*';
    
    if (platform?.env?.SCHEDULE_KV) {
      const kvUser = await platform.env.SCHEDULE_KV.get('ADMIN_USER');
      const kvPass = await platform.env.SCHEDULE_KV.get('ADMIN_PASS');
      if (kvUser) ADMIN_USER = kvUser;
      if (kvPass) ADMIN_PASS = kvPass;
    }

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      cookies.set('admin_session', 'authenticated', {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      throw redirect(303, '/schedule');
    }

    return fail(401, { incorrect: true });
  }
} satisfies Actions;
