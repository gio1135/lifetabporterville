import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ADMIN_USER, ADMIN_PASS } from '$env/static/private';

export const load: PageServerLoad = async ({ cookies }) => {
  const session = cookies.get('admin_session');
  if (session === 'authenticated') {
    throw redirect(303, '/');
  }
};

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    if (!username || !password) {
      return fail(400, { missing: true });
    }

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      cookies.set('admin_session', 'authenticated', {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      throw redirect(303, '/');
    }

    return fail(401, { incorrect: true });
  }
} satisfies Actions;
