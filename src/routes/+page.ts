import type { PageLoad } from './$types';

const opportunityVerses = [
  'Ephesians 5:16',
  'Acts 2:42',
  '2 Chronicles 7:14'
];

export const load: PageLoad = async ({ fetch }) => {
	const reference = opportunityVerses[Math.floor(Math.random() * opportunityVerses.length)];

	try {
		const match = reference.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
		if (!match) throw new Error('Invalid scripture reference format');

		const book = match[1];
		const chapter = match[2];
		const startVerse = parseInt(match[3], 10);
		const endVerse = match[4] ? parseInt(match[4], 10) : startVerse;

		const bookFilename = book.replace(/\s+/g, '_');
		const response = await fetch(`/bible/${bookFilename}.json`);

		if (!response.ok) throw new Error(`Failed to load book: ${book}`);

		const bookData = (await response.json()) as Record<string, Record<string, string>>;
		const chapterData = bookData[chapter];

		if (!chapterData) throw new Error(`Chapter ${chapter} not found`);

		let combinedText = '';
		for (let v = startVerse; v <= endVerse; v++) {
			const verseText = chapterData[v.toString()];
			if (verseText) {
				combinedText += (v > startVerse ? ' ' : '') + `[${v}] ${verseText}`;
			}
		}

		let versesText = combinedText;
		if (startVerse === endVerse) {
			versesText = combinedText.replace(/^\[\d+\]\s*/, '');
		}

		return {
			opportunityVerse: {
				text: versesText,
				reference
			}
		};
	} catch (e) {
		console.error('Failed to load opportunity verse:', e);
		return {
			opportunityVerse: {
				text: 'Redeeming the time, because the days are evil.',
				reference: 'Ephesians 5:16'
			}
		};
	}
};
