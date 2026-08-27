import fs from 'fs';
import readline from 'readline';
import path from 'path';

const bibleFile = 'kjv.txt';
const outputDir = path.join('static', 'bible');

async function parseBible() {
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const fileStream = fs.createReadStream(bibleFile);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const books = {};

	for await (const line of rl) {
		if (!line.includes('\t')) continue;

		// Parse: Book Chapter:Verse\tText
		const match = line.match(/^(.+?)\s+(\d+):(\d+)\t(.+)$/);
		if (match) {
			const book = match[1];
			const chapter = match[2];
			const verse = match[3];
			const text = match[4];

			if (!books[book]) {
				books[book] = {};
			}
			if (!books[book][chapter]) {
				books[book][chapter] = {};
			}

			books[book][chapter][verse] = text;
		}
	}

	// Write out a JSON file for each book
	let numBooks = 0;
	for (const [book, data] of Object.entries(books)) {
		const filename = `${book.replace(/\s+/g, '_')}.json`;
		const outputPath = path.join(outputDir, filename);
		fs.writeFileSync(outputPath, JSON.stringify(data));
		numBooks++;
	}

	console.log(`Successfully generated ${numBooks} JSON files in ${outputDir}`);
}

parseBible().catch(console.error);
