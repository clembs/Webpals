export function replacePlaceholders(string: string, data: unknown) {
	return string.replaceAll(/{data.(\w+)}/g, (_, key) => {
		const keys = key.split('.');
		let value = data;
		for (const k of keys) {
			if (value === undefined) {
				return 'N/A';
			}
			value = value[k] ?? 'N/A';
		}
		return value;
	});
}
