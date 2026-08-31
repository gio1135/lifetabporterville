export function getLADate(date?: Date): Date {
	const d = date || new Date();
	return new Date(d.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
}

export function getLADateString(d: Date): string {
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const date = String(d.getDate()).padStart(2, '0');
	return `${year}-${month}-${date}`;
}
