import { browser } from '$app/environment';

export function createFontState() {
	let useDyslexicFont = $state(false);

	if (browser) {
		const stored = localStorage.getItem('useDyslexicFont');
		if (stored === 'true') {
			useDyslexicFont = true;
		}
	}

	return {
		get useDyslexicFont() {
			return useDyslexicFont;
		},
		toggle() {
			useDyslexicFont = !useDyslexicFont;
			if (browser) {
				localStorage.setItem('useDyslexicFont', String(useDyslexicFont));
			}
		}
	};
}

export const fontState = createFontState();