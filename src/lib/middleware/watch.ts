import { onDestroy } from 'svelte';
import { derived, type Readable } from 'svelte/store';

export function watch<T>(deps: Readable<T> | Readable<T>[], fn: (values: T[] | T) => void) {
	const unsubscribe = derived(deps, (values) => values).subscribe(fn);
	onDestroy(unsubscribe);
}
