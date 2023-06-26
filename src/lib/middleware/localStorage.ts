let localStorageSupported = false;

export function initLocalStorage() {
	try {
		const testKey = '__testLocalStorage__';
		localStorage.setItem(testKey, testKey);
		localStorage.removeItem(testKey);
		localStorageSupported = true;
	} catch (e) {
		// LocalStorage is not supported
		localStorageSupported = false;
		console.error('localStorage is not supported');
	}
}

export function getItem(key: string) {
	if (localStorageSupported) {
		return localStorage.getItem(key);
	}
	return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setItem(key: string, value: any) {
	if (localStorageSupported) {
		localStorage.setItem(key, value);
	}
}

export function removeItem(key: string) {
	if (localStorageSupported) {
		localStorage.removeItem(key);
	}
}
