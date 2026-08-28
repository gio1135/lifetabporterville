import { browser } from '$app/environment';

class AccessibilityStore {
	highContrast = $state(false);
	dyslexiaFont = $state(false);

	constructor() {
		if (browser) {
			const hc = localStorage.getItem('highContrast');
			const df = localStorage.getItem('dyslexiaFont');
			if (hc) this.highContrast = hc === 'true';
			if (df) this.dyslexiaFont = df === 'true';
		}
	}

	toggleHighContrast() {
		this.highContrast = !this.highContrast;
		if (browser) localStorage.setItem('highContrast', String(this.highContrast));
	}

	toggleDyslexiaFont() {
		this.dyslexiaFont = !this.dyslexiaFont;
		if (browser) localStorage.setItem('dyslexiaFont', String(this.dyslexiaFont));
	}
}

export const accessibility = new AccessibilityStore();
