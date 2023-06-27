import { writable } from 'svelte/store';
import type { UserInterface } from '../lib/server/type';

export class User implements UserInterface {
	constructor(
		public userId: number,
		public isLoggedIn: boolean,
		public email: string | null,
		public sessionTimeout: number | null
	) {}
}

export const currentUser = writable(new User(-1, false, null, null));
